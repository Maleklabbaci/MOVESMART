/**
 * Minimal, dependency-free implementation of the PostgREST query parameters this
 * application uses ("eq", "neq", "lt/lte/gt/gte", "is.null", "not.is.null", "ilike",
 * "or=(...)" and "order").
 *
 * It exists so the Playwright backend mock (tests/fixtures.ts) filters and orders rows
 * exactly like Supabase does, and so that behaviour is unit-tested in Node without a
 * database or a browser (src/tests/analytics.test.ts).
 */
export type Row = Record<string, unknown>;

const IGNORED = new Set([
  "select",
  "limit",
  "offset",
  "apikey",
  "columns",
  "on_conflict",
]);

const REGEXP_SPECIALS = ".*+?^$()[]{}|";
const PLACEHOLDER = "\u0000";

/** PostgREST "ilike" accepts both "*" and "%" as wildcards. */
function wildcardToRegExp(pattern: string): RegExp {
  let source = "";
  for (const character of pattern) {
    if (character === "*" || character === "%") source += ".*";
    else if (REGEXP_SPECIALS.includes(character) || character === "\\")
      source += "\\" + character;
    else if (character === PLACEHOLDER) source += ".*";
    else source += character;
  }
  return new RegExp("^" + source + "$", "i");
}

function unquote(value: string): string {
  if (value.length > 1 && value.startsWith('"') && value.endsWith('"'))
    return value.slice(1, -1).split('\\"').join('"');
  return value;
}

function compare(left: unknown, right: string, operator: string): boolean {
  const leftDate = Date.parse(String(left));
  const rightDate = Date.parse(right);
  const leftValue: number | string = Number.isNaN(leftDate)
    ? String(left ?? "")
    : leftDate;
  const rightValue: number | string = Number.isNaN(rightDate)
    ? right
    : rightDate;
  if (typeof leftValue === "number" && typeof rightValue === "number")
    return operator === "lt"
      ? leftValue < rightValue
      : operator === "lte"
        ? leftValue <= rightValue
        : operator === "gt"
          ? leftValue > rightValue
          : leftValue >= rightValue;
  const comparison = String(leftValue).localeCompare(String(rightValue));
  return operator === "lt"
    ? comparison < 0
    : operator === "lte"
      ? comparison <= 0
      : operator === "gt"
        ? comparison > 0
        : comparison >= 0;
}

function matchesExpression(row: Row, expression: string): boolean {
  const match = /^([A-Za-z0-9_]+)\.([a-z]+)\.(.*)$/i.exec(expression.trim());
  if (!match) return true;
  const field = match[1];
  const operator = match[2].toLowerCase();
  const rawValue = match[3];
  const cell = row[field];
  if (operator === "is") {
    const value = unquote(rawValue);
    return value === "null"
      ? cell === null || cell === undefined
      : String(cell) === value;
  }
  if (operator === "eq") return String(cell ?? "") === unquote(rawValue);
  if (operator === "neq") return String(cell ?? "") !== unquote(rawValue);
  if (operator === "like" || operator === "ilike")
    return wildcardToRegExp(unquote(rawValue)).test(String(cell ?? ""));
  if (operator === "in") {
    const list = unquote(rawValue)
      .replace(/^\(/, "")
      .replace(/\)$/, "")
      .split(",")
      .map((item) => unquote(item.trim()));
    return list.includes(String(cell ?? ""));
  }
  if (["lt", "lte", "gt", "gte"].includes(operator))
    return compare(cell, unquote(rawValue), operator);
  return true;
}

export function splitTopLevel(value: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const character of value) {
    if (character === "(") depth += 1;
    if (character === ")") depth -= 1;
    if (character === "," && depth === 0) {
      parts.push(current);
      current = "";
      continue;
    }
    current += character;
  }
  if (current) parts.push(current);
  return parts;
}

/** Returns true when every constraint in "params" is satisfied by "row". */
export function matchesPostgrestRow(
  row: Row,
  params: URLSearchParams,
): boolean {
  for (const key of new Set(params.keys())) {
    if (IGNORED.has(key)) continue;
    const values = params.getAll(key);
    if (key === "or" || key === "and") {
      for (const group of values) {
        const inner = group.replace(/^\(/, "").replace(/\)$/, "");
        const expressions = splitTopLevel(inner);
        const ok =
          key === "or"
            ? expressions.some((expression) =>
                matchesExpression(row, expression),
              )
            : expressions.every((expression) =>
                matchesExpression(row, expression),
              );
        if (!ok) return false;
      }
      continue;
    }
    for (const value of values) {
      if (value.startsWith("not.")) {
        if (matchesExpression(row, key + "." + value.slice(4))) return false;
        continue;
      }
      if (!matchesExpression(row, key + "." + value)) return false;
    }
  }
  return true;
}

/** Applies "order=field.asc[.nullsfirst]" chains, mimicking PostgREST ordering. */
export function applyPostgrestOrder(
  rows: Row[],
  params: URLSearchParams,
): Row[] {
  const orderings = params.getAll("order").map((value) => {
    const parts = value.split(".");
    const direction = parts[1]?.toLowerCase();
    const nulls = parts[2]?.toLowerCase();
    return {
      field: parts[0],
      ascending: direction !== "desc",
      // PostgREST puts NULLs last for ascending order unless nullsfirst is asked for.
      nullsFirst:
        nulls === "nullsfirst" ? true : nulls === "nullslast" ? false : false,
    };
  });
  if (!orderings.length) return rows;
  return [...rows].sort((left, right) => {
    for (const ordering of orderings) {
      const a = left[ordering.field];
      const b = right[ordering.field];
      const aMissing = a === null || a === undefined;
      const bMissing = b === null || b === undefined;
      if (aMissing || bMissing) {
        if (aMissing && bMissing) continue;
        return aMissing
          ? ordering.nullsFirst
            ? -1
            : 1
          : ordering.nullsFirst
            ? 1
            : -1;
      }
      const aDate = Date.parse(String(a));
      const bDate = Date.parse(String(b));
      const comparison =
        Number.isNaN(aDate) || Number.isNaN(bDate)
          ? String(a).localeCompare(String(b))
          : aDate - bDate;
      if (comparison !== 0)
        return ordering.ascending ? comparison : -comparison;
    }
    return 0;
  });
}
