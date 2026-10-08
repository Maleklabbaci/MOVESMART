import { test, expect, type Page } from "@playwright/test";
import { mockBackend, login } from "./fixtures";

async function afterRender(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
}

test("temporary public or authorization failures preserve published copy and never fall back to a private draft", async ({
  context,
  page,
}) => {
  const backend = await mockBackend(context);
  backend.published.translations.fr.home_hero_title = "Notre version publique";
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Notre version publique");
  backend.failPublished = true;
  const failed = page.waitForResponse(
    (response) =>
      response.url().includes("/rest/v1/site_content?") &&
      response.status() === 503,
  );
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await failed;
  await afterRender(page);
  await expect(page.locator("h1")).toContainText("Notre version publique");
  backend.failPublished = false;
  backend.draft = structuredClone(backend.published);
  backend.draft.translations.fr.home_hero_title = "Texte privé";
  backend.draftRevision = 1;
  await login(page);
  await expect(
    page.getByRole("heading", { name: "Contenus du site" }),
  ).toBeVisible();
  const reads = backend.privateReads;
  backend.failRole = true;
  await page.goto("/?preview=draft");
  await expect(page.locator("h1")).toContainText("Notre version publique");
  await expect(page.locator("h1")).not.toContainText("Texte privé");
  expect(backend.privateReads).toBe(reads);
});

test("a slower previous focus request cannot overwrite the latest published version", async ({
  context,
  page,
}) => {
  const backend = await mockBackend(context);
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Investir");
  let releaseSlow!: () => void;
  const gate = new Promise<void>((resolve) => {
    releaseSlow = resolve;
  });
  let receivedFirst!: () => void;
  const firstRead = new Promise<void>((resolve) => {
    receivedFirst = resolve;
  });
  let reads = 0;
  const headers = {
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "*",
  };
  await page.route("**/rest/v1/site_content?*", async (route) => {
    if (route.request().method() === "OPTIONS")
      return route.fulfill({ status: 204, headers });
    const first = ++reads === 1;
    const content = structuredClone(backend.published);
    content.translations.fr.home_hero_title = first
      ? "Ancienne version lente"
      : "Nouvelle version rapide";
    if (first) {
      receivedFirst();
      await gate;
    }
    await route.fulfill({
      contentType: "application/json",
      headers,
      body: JSON.stringify([
        { content, revision: reads, published_at: "2026-10-08T10:00:00Z" },
      ]),
    });
  });
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await firstRead;
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.locator("h1")).toContainText("Nouvelle version rapide");
  const oldResponse = page.waitForResponse("**/rest/v1/site_content?*");
  releaseSlow();
  await (await oldResponse).finished();
  await afterRender(page);
  await expect(page.locator("h1")).toContainText("Nouvelle version rapide");
});

test("signing out in the admin tab removes private copy from an already open draft preview", async ({
  context,
  page,
}) => {
  const backend = await mockBackend(context);
  backend.published.translations.fr.home_hero_title = "Texte public";
  backend.draft = structuredClone(backend.published);
  backend.draft.translations.fr.home_hero_title =
    "Texte confidentiel du brouillon";
  backend.draftRevision = 1;
  await login(page);
  await expect(
    page.getByRole("heading", { name: "Contenus du site" }),
  ).toBeVisible();
  const preview = await context.newPage();
  await preview.goto("/?preview=draft");
  await expect(preview.locator("h1")).toContainText(
    "Texte confidentiel du brouillon",
  );
  await page.getByRole("button", { name: "Déconnexion", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Votre espace admin" }),
  ).toBeVisible();
  await expect(preview.locator("h1")).toContainText("Texte public");
  await expect(preview.locator("h1")).not.toContainText("Texte confidentiel");
});

test("all draft-preview URLs disable submissions, even before authentication or when the draft is unavailable", async ({
  context,
  page,
}) => {
  const backend = await mockBackend(context);
  backend.admin = false;
  await page.goto("/blog?preview=draft");
  await expect(
    page.getByRole("button", { name: "S'abonner", exact: true }),
  ).toBeDisabled();
  await page.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/\/contact\?preview=draft$/);
  await page
    .getByRole("button", { name: "Immobilier & Investissement", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Revenus locatifs", exact: true })
    .click();
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "ÊTRE CONTACTÉ", exact: true }),
  ).toBeDisabled();
  expect(backend.requests.length).toBe(0);
  expect(backend.subscribers.length).toBe(0);
  expect(backend.privateReads).toBe(0);
});

test("home ordering and visibility use the real preview DOM; restoring history only changes a local draft", async ({
  context,
  page,
}) => {
  const backend = await mockBackend(context);
  backend.revisions.push({
    id: 1,
    revision: 1,
    content: structuredClone(backend.published),
    created_at: "2026-10-08T10:00:00Z",
  });
  await login(page);
  await expect(
    page.getByRole("heading", { name: "Contenus du site" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Accueil", exact: true }).click();
  await page.getByRole("checkbox", { name: "FAQ", exact: true }).uncheck();
  await page
    .getByRole("button", { name: "Descendre Statistiques", exact: true })
    .click();
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Aperçu", exact: true }).click();
  const preview = await popupPromise;
  await expect(
    preview.getByText("Aperçu du brouillon — non publié"),
  ).toBeVisible();
  await expect(
    preview.getByRole("button", {
      name: backend.published.faq[0].question.fr,
      exact: true,
    }),
  ).toHaveCount(0);
  await expect(preview.locator("main > div > section").nth(1)).toContainText(
    backend.published.translations.fr.home_services_title,
  );
  expect(backend.published.visibleSections.faq).toBe(true);
  await preview.close();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Publier", exact: true }).click();
  await expect(
    page.getByText(
      "Contenu publié. Les visiteurs voient maintenant cette version.",
    ),
  ).toBeVisible();
  const history = page.getByRole("button", {
    name: "Historique des publications",
    exact: true,
  });
  await history.click();
  const dialog = page.getByRole("dialog", {
    name: "Historique des publications",
  });
  await expect(dialog).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Fermer l’historique" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Restaurer la version 1" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(history).toBeFocused();
  await history.click();
  await page.getByRole("button", { name: "Restaurer la version 1" }).click();
  await expect(
    page.getByRole("checkbox", { name: "FAQ", exact: true }),
  ).toBeChecked();
  expect(backend.published.visibleSections.faq).toBe(false);
  expect(backend.draft?.visibleSections.faq).toBe(false);
});

test("property dialogs accept decimals and ask before abandoning an edited listing", async ({
  context,
  page,
}) => {
  const backend = await mockBackend(context);
  await login(page);
  await page
    .getByRole("button", { name: "Biens immobiliers", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Ajouter un bien", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Titre", { exact: true }).fill("Appartement décimal");
  await dialog.getByLabel("Localisation", { exact: true }).fill("Dubai Creek");
  await dialog.getByLabel("Prix (AED)", { exact: true }).fill("2500000.50");
  await dialog.getByLabel("Surface (sqft)", { exact: true }).fill("1500.25");
  await page
    .getByRole("button", { name: "Enregistrer le bien", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(
    backend.listings.find((item) => item.title === "Appartement décimal")
      ?.price,
  ).toBe(2500000.5);
  expect(
    backend.listings.find((item) => item.title === "Appartement décimal")?.area,
  ).toBe(1500.25);
  await page
    .getByRole("button", { name: "Modifier Appartement décimal", exact: true })
    .click();
  await dialog.getByLabel("Titre", { exact: true }).fill("À ne pas perdre");
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(dialog.getByLabel("Titre", { exact: true })).toHaveValue(
    "À ne pas perdre",
  );
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Annuler", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(
    backend.listings.some((item) => item.title === "À ne pas perdre"),
  ).toBe(false);
});

test("catalogue searches cover records beyond the backend row cap and visible cards are paginated", async ({
  context,
  page,
}) => {
  const backend = await mockBackend(context);
  const template = backend.listings[0];
  backend.rowCap = 100;
  backend.listings = Array.from({ length: 1005 }, (_, index) => ({
    ...template,
    id: crypto.randomUUID(),
    title:
      index === 1004
        ? "Dernier projet du catalogue"
        : `Projet de test ${index}`,
  }));
  await page.goto("/listings");
  await expect(
    page.getByRole("button", { name: /Afficher plus/ }),
  ).toBeVisible();
  expect(backend.listingReads).toBeGreaterThanOrEqual(11);
  await expect(page.locator('main a[href^="/listings/"]')).toHaveCount(12);
  await page.getByRole("button", { name: /Afficher plus/ }).click();
  await expect(page.locator('main a[href^="/listings/"]')).toHaveCount(24);
  await page
    .getByRole("textbox", { name: "Rechercher par projet ou zone..." })
    .fill("Dernier projet");
  await expect(
    page.getByRole("heading", {
      name: "Dernier projet du catalogue",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator('main a[href^="/listings/"]')).toHaveCount(1);
});

test("private leads and subscribers can be managed without automatic emails or silent opt-in reactivation", async ({
  context,
  page,
}) => {
  const backend = await mockBackend(context);
  backend.requests.push({
    id: crypto.randomUUID(),
    name: "Client Test",
    email: "client@example.com",
    phone: "+33612345678",
    service: "realEstate",
    options: ["rental-income"],
    details: { budget: "2000000 AED" },
    message: "Un vrai message de test.",
    status: "new",
    created_at: "2026-10-08T10:00:00Z",
    consent_at: "2026-10-08T10:00:00Z",
  });
  backend.subscribers.push({
    id: crypto.randomUUID(),
    email: "newsletter@example.com",
    active: true,
    consent_at: "2026-10-08T10:00:00Z",
    created_at: "2026-10-08T10:00:00Z",
  });
  await login(page);
  await page
    .getByRole("button", { name: "Demandes clients", exact: true })
    .click();
  await expect(
    page.getByText("client@example.com", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Détails de Client Test" }).click();
  await expect(page.getByText("2000000 AED", { exact: false })).toBeVisible();
  const updated = page.waitForResponse(
    (response) =>
      response.url().includes("/contact_requests") &&
      response.request().method() === "PATCH",
  );
  await page.getByLabel("Statut de Client Test").selectOption("contacted");
  await (await updated).finished();
  await expect(page.getByLabel("Statut de Client Test")).toHaveValue(
    "contacted",
  );
  expect(backend.requests[0].status).toBe("contacted");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Exporter (1)", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("movesmart-requests.csv");
  await page.getByRole("button", { name: "Newsletter", exact: true }).click();
  await expect(
    page.getByText("newsletter@example.com", { exact: true }),
  ).toBeVisible();
  const unsubscribed = page.waitForResponse(
    (response) =>
      response.url().includes("/newsletter_subscriptions") &&
      response.request().method() === "PATCH",
  );
  await page.getByRole("button", { name: "Désinscrire", exact: true }).click();
  await (await unsubscribed).finished();
  await expect(
    page.getByRole("button", { name: "Désinscrit", exact: true }),
  ).toBeDisabled();
  expect(backend.subscribers[0].active).toBe(false);
});
