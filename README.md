# MoveSmart

Site immobilier React + TypeScript + Vite, avec un CMS intégré à `/admin`. La direction visuelle existante (noir/or, typographie, sections) est conservée : ce n’est pas un constructeur de pages libre.

## Fonctionnalités

- **Contenus du site** : textes FR/EN/AR, images et textes alternatifs, marque, coordonnées, réseaux sociaux, métadonnées SEO, FAQ, témoignages et articles.
- **Accueil** : ordre réel des sections et visibilité, sans modifier le code.
- **Brouillon → aperçu → publication** : révisions, protection contre les modifications concurrentes, restauration vers un brouillon et import/export JSON.
- **Annonces** : création, modification, galerie et suppression. Les changements d’annonces sont immédiatement publics, indépendamment du CMS des pages.
- **Tableau de bord admin** : écran d’accueil de `/admin` avec nombre exact de demandes, statuts, relances échues et à venir, demandes récentes, fraîcheur des données et raccourcis vers chaque section.
- **Demandes clients et newsletter** : enregistrement confirmé en base, consentement déclaré, filtres (recherche, statut, service, relance), **date de rappel**, **notes internes privées**, gestion privée dans l’admin et export CSV de la sélection filtrée. Aucun email automatique ni double opt-in n’est configuré.
- **Mesure d’audience consentie** (optionnelle) : pages vues, sessions et pages distinctes, navigateurs — sans IP, sans cookie de suivi et sans empreinte numérique, conservation 90 jours, désactivable par `VITE_ANALYTICS_ENABLED=false`. Voir **[docs/ANALYTICS.md](docs/ANALYTICS.md)**.
- **FR/EN/AR** : détection des variantes régionales, RTL, polices hébergées localement et interface d’administration en français.

## Démarrer

Prérequis : Node.js 22 et npm.

```sh
npm ci
npm run dev
```

Le serveur écoute sur `0.0.0.0:3000`. Les hôtes de prévisualisation Arena `*.e2b.app` sont autorisés.

### Configuration Supabase

La configuration publique du projet historique est conservée si les variables ne sont pas définies. Pour choisir un autre projet, créer `.env.local` avec les **vraies valeurs publiques** décrites dans `.env.example` :

```dotenv
VITE_SUPABASE_URL="https://votre-projet.supabase.co"
VITE_SUPABASE_ANON_KEY="votre-cle-publique-anon-ou-publishable"
```

Ne pas laisser les valeurs d’exemple. Ne jamais mettre de clé `service_role`, de clé secrète ou de mot de passe de base dans une variable `VITE_*` : ces variables sont intégrées au JavaScript public. Redémarrer Vite après une modification de configuration et reconstruire le site pour un déploiement.

## Activer le CMS

**Le code ne crée pas automatiquement les tables sur le projet distant.** Le propriétaire du projet doit :

1. Sauvegarder et vérifier le projet Supabase ciblé.
2. Appliquer `supabase/migrations/202610080001_admin_cms.sql` dans son SQL Editor.
3. Appliquer `supabase/migrations/202610080002_admin_dashboard_analytics.sql` (tableau de bord, relances, notes internes et statistiques de fréquentation). Elle est additive : contenus, annonces, demandes et images sont conservés.
4. Créer/confirmer le compte du client dans Supabase Auth, puis l’ajouter à `cms_administrators`.
5. Tester `/admin`, les règles d’accès, un brouillon, une publication et les formulaires sur le vrai projet, puis `notify pgrst, 'reload schema';`.

> Ces migrations sont versionnées dans le dépôt et **n’ont pas été appliquées au projet Supabase distant** depuis l’environnement de développement. Sans la deuxième, `/admin` fonctionne en mode dégradé (totaux exacts et demandes récentes, relances/notes/statistiques annoncées comme indisponibles).

Le guide détaillé, les commandes d’attribution/retrait des droits et la recette de validation se trouvent dans **[docs/ADMIN_CMS.md](docs/ADMIN_CMS.md)**.

> Les photos importées dans le bucket `photos` sont publiques dès l’import, même si la page ou l’article reste en brouillon. Ne pas y stocker de documents confidentiels. Si un bucket `photos` existant est privé, la migration s’arrête sans le rendre public.

Sans CMS installé, les pages éditoriales continuent à afficher le contenu initial du dépôt. Les formulaires ne simulent pas un succès lorsque leurs RPC sont indisponibles.

## Vérifications

```sh
npm run lint          # TypeScript strict (tsc --noEmit)
npm test              # Helpers, validation, consentement, filtres et SQL/RLS dans PGlite
npm run build         # Vérification TypeScript + build de production
npm audit
npm run format:check

# Installation du navigateur sur une machine disposant de l’accès nécessaire
npx playwright install chromium
npm run test:e2e
```

Les E2E interceptent les API Auth/REST/Storage et n’écrivent jamais dans la base de production. Les tests SQL utilisent une base PostgreSQL embarquée avec les schémas/rôles Supabase simulés ; ils ne remplacent pas une recette sur Supabase Auth et Storage réels. Un Chromium existant peut être utilisé via `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`; `PLAYWRIGHT_BASE_URL` permet de sélectionner l’URL du site testé.

## Déploiement

```sh
npm run build
```

Publier le dossier `dist/` avec un hébergement SPA. `vercel.json` prévoit le repli vers `index.html` pour les routes comme `/admin`, `/blog/:id` et `/listings/:id`. Sur un autre hébergeur, configurer le même repli. Les variables publiques Supabase doivent être présentes **au moment du build**.

Les métadonnées sont mises à jour côté client ; ce projet n’ajoute pas de SSR/prérendu. La page 404 est une page du routeur client. Prévoir du prérendu/SSR et des réponses HTTP adaptées si cela devient une exigence de référencement.

## Repères du code

| Emplacement             | Rôle                                                                                                 |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| `src/content/`          | Schéma versionné, contenu initial, catalogue des champs, localisation, API et provider publié/aperçu |
| `src/components/admin/` | Tableau de bord, éditeurs, annonces, médiathèque, demandes, relances et abonnés                      |
| `src/pages/Admin.tsx`   | Authentification, vérification de l’appartenance admin et navigation                                 |
| `src/lib/`              | Validation, images, formulaires, catalogue, CSV, consentement/mesure d’audience et partage           |
| `supabase/migrations/`  | Tables, RPC, privilèges et politiques RLS                                                            |
| `src/tests/`, `tests/`  | Tests unitaires/SQL et parcours navigateur                                                           |
| `public/licenses/`      | Licences SIL OFL des polices distribuées                                                             |

Les contenus commerciaux, chiffres, avis clients, articles historiques et textes juridiques repris du site doivent être validés par le propriétaire avant publication. Le CMS ne certifie ni leur exactitude ni la conformité juridique du site.
