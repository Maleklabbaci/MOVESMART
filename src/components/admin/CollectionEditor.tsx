import { useState, type ReactNode } from "react";
import { ArrowUp, ArrowDown, Plus, Trash2, ChevronDown } from "lucide-react";
import { moveItem } from "../../content/utils";
export function CollectionEditor<T extends { id: string }>({
  items,
  onChange,
  createItem,
  title,
  render,
  noun,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  title: (item: T) => string;
  render: (item: T, update: (item: T) => void) => ReactNode;
  noun: string;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-zinc-500">
          {items.length} élément(s) · ordre d’affichage ci-dessous
        </p>
        <button
          type="button"
          className="admin-button"
          disabled={items.length >= 100}
          onClick={() => {
            const item = createItem();
            onChange([...items, item]);
            setExpanded(item.id);
          }}
        >
          <Plus size={15} />
          Ajouter {noun}
        </button>
      </div>
      {items.length === 0 && (
        <div className="admin-card text-sm text-zinc-500 py-12 text-center">
          Aucun élément. Ajoutez-en un pour l’afficher sur le site.
        </div>
      )}
      {items.map((item, index) => (
        <article className="admin-card" key={item.id}>
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="flex items-center gap-3 min-w-0 text-start"
              aria-expanded={expanded === item.id}
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              <span className="text-[11px] text-zinc-500 w-5">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-sm font-medium truncate">
                {title(item) || "Sans titre"}
              </h3>
              <ChevronDown
                size={15}
                className={`shrink-0 ${expanded === item.id ? "rotate-180" : ""}`}
              />
            </button>
            <div className="flex gap-1 shrink-0">
              <button
                type="button"
                className="p-2 text-zinc-500 hover:text-white disabled:opacity-20"
                aria-label={`Monter ${noun}`}
                disabled={index === 0}
                onClick={() => onChange(moveItem(items, index, index - 1))}
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                className="p-2 text-zinc-500 hover:text-white disabled:opacity-20"
                aria-label={`Descendre ${noun}`}
                disabled={index === items.length - 1}
                onClick={() => onChange(moveItem(items, index, index + 1))}
              >
                <ArrowDown size={14} />
              </button>
              <button
                type="button"
                className="p-2 text-zinc-500 hover:text-red-400"
                aria-label={`Supprimer ${noun}`}
                onClick={() => {
                  if (
                    window.confirm(
                      `Supprimer ${noun} du brouillon ? La version publiée ne change pas avant publication.`,
                    )
                  )
                    onChange(items.filter((current) => current.id !== item.id));
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          {expanded === item.id && (
            <div className="mt-6 pt-6 border-t border-white/5 space-y-5">
              {render(item, (updated) => {
                if (expanded === item.id && updated.id !== item.id)
                  setExpanded(updated.id);
                onChange(
                  items.map((current) =>
                    current.id === item.id ? updated : current,
                  ),
                );
              })}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
