import { test, expect } from "@playwright/test";
import { mockBackend, login } from "./fixtures";

test("French and Arabic regional browsers get consistent copy and document direction", async ({
  browser,
}) => {
  for (const [locale, lang, direction, title] of [
    ["en-GB", "en", "ltr", "Invest"],
    ["fr-FR", "fr", "ltr", "Investir"],
    ["ar-AE", "ar", "rtl", "استثمر"],
  ] as const) {
    const context = await browser.newContext({ locale });
    await mockBackend(context);
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator("html")).toHaveAttribute("dir", direction);
    await expect(page.locator("h1")).toContainText(title);
    await context.close();
  }
});
test("a signed-in non-administrator cannot open editors or read private tables", async ({
  context,
  page,
}) => {
  const backend = await mockBackend(context);
  backend.admin = false;
  backend.metadataAdmin = true;
  await login(page);
  await expect(
    page.getByRole("heading", { name: "Accès non autorisé" }),
  ).toBeVisible();
  expect(backend.privateReads).toBe(0);
  await expect(
    page.getByRole("button", { name: "Publier", exact: true }),
  ).toHaveCount(0);
});
test("texts and pictures follow draft → preview → publish without changing the public site early", async ({
  context,
  page,
}) => {
  const backend = await mockBackend(context);
  await login(page);
  // The administration now opens on its dashboard: editors are one click away.
  await expect(
    page.getByRole("heading", { name: "Vue d’ensemble" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Contenus du site", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Contenus du site" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Accueil", exact: true }).click();
  await page
    .getByLabel("Bannière — titre principal", { exact: true })
    .fill("Votre avenir commence ici");
  await page
    .getByLabel("Importer : Image de la bannière", { exact: true })
    .setInputFiles({
      name: "hero.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a0aQAAAAASUVORK5CYII=",
        "base64",
      ),
    });
  await expect(
    page.getByRole("button", { name: "Enregistrer le brouillon", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: "Enregistrer le brouillon", exact: true })
    .click();
  await expect(
    page.getByText("Brouillon enregistré. Le site public n’a pas changé."),
  ).toBeVisible();
  expect(backend.draft?.translations.fr.home_hero_title).toBe(
    "Votre avenir commence ici",
  );
  expect(backend.uploads.length).toBe(1);
  expect(backend.published.translations.fr.home_hero_title).not.toBe(
    "Votre avenir commence ici",
  );
  const publicPage = await context.newPage();
  await publicPage.goto("/");
  await expect(publicPage.locator("h1")).not.toContainText(
    "Votre avenir commence ici",
  );
  const popupPromise = page.waitForEvent("popup");
  await page.getByRole("button", { name: "Aperçu", exact: true }).click();
  const popup = await popupPromise;
  await expect(popup.locator("h1")).toContainText("Votre avenir commence ici");
  await expect(
    popup.getByText("Aperçu du brouillon — non publié"),
  ).toBeVisible();
  await popup.getByRole("link", { name: "À Propos", exact: true }).click();
  await expect(popup).toHaveURL(/\/about\?preview=draft$/);
  await popup.close();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Publier", exact: true }).click();
  await expect(
    page.getByText(
      "Contenu publié. Les visiteurs voient maintenant cette version.",
    ),
  ).toBeVisible();
  await publicPage.reload();
  await expect(publicPage.locator("h1")).toContainText(
    "Votre avenir commence ici",
  );
  expect(backend.published.images.homeHero.url).toContain(
    "/storage/v1/object/public/photos/cms/",
  );
});
test("an anonymous draft-preview link never retrieves or renders private draft content", async ({
  context,
  page,
}) => {
  const backend = await mockBackend(context);
  backend.draft = structuredClone(backend.published);
  backend.draft.translations.fr.home_hero_title = "PRIVATE DRAFT";
  await page.goto("/?preview=draft");
  await expect(page.locator("h1")).not.toContainText("PRIVATE DRAFT");
  await expect(page.locator("h1")).toContainText("Investir");
  expect(backend.privateReads).toBe(0);
});
test("contact and newsletter show success only after a confirmed backend response", async ({
  context,
  page,
}) => {
  const backend = await mockBackend(context);
  backend.failContact = true;
  await page.goto("/contact");
  await page
    .getByRole("button", { name: "Immobilier & Investissement", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Revenus locatifs", exact: true })
    .click();
  await page.getByRole("button", { name: "Continuer", exact: true }).click();
  await page.getByLabel("Nom complet", { exact: true }).fill("Client Test");
  await page.getByLabel("Email", { exact: true }).fill("client@example.com");
  await page.getByRole("button", { name: /\+971/ }).click();
  await page.getByRole("button", { name: /France.*\+33/ }).click();
  await page
    .getByLabel("Téléphone / WhatsApp", { exact: true })
    .fill("06 12 34 56 78");
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "ÊTRE CONTACTÉ", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("n’a pas été envoyée");
  await expect(page.getByRole("heading", { name: "Merci!" })).toHaveCount(0);
  expect(backend.requests.length).toBe(0);
  backend.failContact = false;
  await page
    .getByRole("button", { name: "ÊTRE CONTACTÉ", exact: true })
    .click();
  await expect(page.getByRole("heading", { name: "Merci!" })).toBeVisible();
  expect(backend.requests[0].phone).toBe("+33612345678");
  backend.failNewsletter = true;
  await page.goto("/blog");
  await page
    .getByLabel("Email", { exact: true })
    .fill("newsletter@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "S'abonner", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Inscription non enregistrée",
  );
  expect(backend.subscribers.length).toBe(0);
  backend.failNewsletter = false;
  await page.getByRole("button", { name: "S'abonner", exact: true }).click();
  await expect(
    page.getByText("Votre inscription a bien été enregistrée."),
  ).toBeVisible();
  expect(backend.subscribers.length).toBe(1);
});
test("failed property deletion keeps the row and catalog network errors are not empty-state messages", async ({
  context,
  page,
}) => {
  const backend = await mockBackend(context);
  backend.failDelete = true;
  await login(page);
  await page
    .getByRole("button", { name: "Biens immobiliers", exact: true })
    .click();
  await expect(
    page.getByText("Villa Dubai Marina", { exact: true }),
  ).toBeVisible();
  page.once("dialog", (dialog) => dialog.accept());
  await page
    .getByRole("button", { name: "Supprimer Villa Dubai Marina", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("Accès refusé");
  await expect(
    page.getByText("Villa Dubai Marina", { exact: true }),
  ).toBeVisible();
  backend.failListings = true;
  await page.goto("/listings");
  await expect(page.getByRole("alert")).toContainText("Impossible de charger");
  await expect(page.getByText("Aucune opportunité disponible")).toHaveCount(0);
  backend.failListings = false;
  await page.getByRole("button", { name: "Réessayer", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Villa Dubai Marina" }),
  ).toBeVisible();
});
test("mobile menu, editing workspace and 404 remain usable on narrow screens", async ({
  context,
  page,
}) => {
  await mockBackend(context);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Contact", exact: true })
    .click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await login(page);
  await expect(
    page.getByRole("heading", { name: "Contenus du site" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Accueil", exact: true }).click();
  await expect(
    page.getByLabel("Bannière — titre principal", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: ".cache/review/admin-mobile.png",
    fullPage: false,
  });
  await page.goto("/does-not-exist");
  await expect(
    page.getByRole("heading", { name: "Page introuvable" }),
  ).toBeVisible();
});
