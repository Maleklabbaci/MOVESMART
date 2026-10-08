# Administration MoveSmart — activation et utilisation

## 1. Ce que le client peut modifier

Dans `/admin`, **Contenus du site** regroupe :

- Marque, raison sociale, téléphone/WhatsApp, email, localisation et réseaux sociaux.
- Logo, bannière d’accueil, image de la page À propos et textes alternatifs FR/EN/AR. L’option de logo monochrome permet de conserver les couleurs d’un logo importé.
- Textes des pages et éléments publics existants : accueil, À propos, contact, catalogue, journal, navigation, boutons, pied de page, messages des formulaires et confidentialité.
- Titres/descriptions SEO des pages. Les métadonnées des articles utilisent leur titre, extrait et image.
- FAQ, témoignages et articles : ajouter, modifier, retirer, réordonner ; traductions dans les trois langues.
- Ordre et affichage des sections de l’accueil : bannière, statistiques, services, avantages, témoignages, FAQ et appel à l’action.

**Biens immobiliers** conserve son éditeur distinct, avec les champs de la table `listings` et une galerie jusqu’à 30 images. Les textes d’une annonce conservent le modèle existant à une langue ; les libellés généraux du catalogue sont traduits. Les prix restent en AED et les surfaces en sqft.

Le CMS conserve la mise en page et les composants actuels. Il n’ajoute ni nouvelles pages arbitraires, ni HTML libre, ni changement de grille/couleurs, ni constructeur type Wix. Les types de biens, codes pays et identifiants d’options de formulaire restent des valeurs structurées ; leurs libellés publics sont localisés.

## 2. Installer dans Supabase — propriétaire du projet

### Avant toute exécution

1. Vérifier que le projet correspond aux valeurs de `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` utilisées par le site.
2. Sauvegarder les tables, fonctions, politiques RLS et fichiers concernés. Tester d’abord sur un projet de recette si possible.
3. Vérifier les fichiers du bucket `photos` existant. Ce bucket doit contenir exclusivement des images marketing destinées à être publiques.
4. Examiner les éventuelles tables homonymes d’une autre application. Le script ne convertit pas automatiquement un ancien CMS de structure inconnue.

La migration est transactionnelle et réexécutable. Elle conserve les annonces et fichiers existants, mais **modifie les droits d’accès** aux annonces et au bucket `photos`. Elle élargit `price` et `area` en `numeric` pour préserver les décimales ; si des vues ou dépendances empêchent cette conversion, PostgreSQL bloque la migration et le propriétaire doit les traiter explicitement. Elle ne réinitialise pas les identifiants ni les séquences existantes.

**Un bucket `photos` déjà privé bloque volontairement la migration.** Ne pas résoudre cette erreur en le rendant public sans analyser ses fichiers. Utiliser un projet marketing séparé ou préparer une adaptation des noms de buckets et du code si des documents confidentiels y sont présents.

### Appliquer le schéma

Ouvrir le SQL Editor du bon projet Supabase et exécuter le contenu complet de :

```text
supabase/migrations/202610080001_admin_cms.sql
```

Le script crée/configure :

| Objet                      | Utilité                                                                |
| -------------------------- | ---------------------------------------------------------------------- |
| `cms_administrators`       | Comptes Auth autorisés à administrer le site                           |
| `site_content`             | Version publique courante                                              |
| `site_content_drafts`      | Brouillon partagé privé                                                |
| `site_content_revisions`   | 30 derniers instantanés privés de publication                          |
| `listings`                 | Annonces publiques, écriture réservée aux admins                       |
| `contact_requests`         | Demandes clients privées                                               |
| `newsletter_subscriptions` | Inscriptions privées, email unique                                     |
| `form_request_limits`      | Limites anti-spam internes, sans accès navigateur                      |
| Bucket `photos`            | Images publiques ; import et liste des métadonnées réservés aux admins |

La version publique initiale `{}` utilise les valeurs du site déjà présentes dans le dépôt. La première sauvegarde depuis l’éditeur crée le brouillon complet. Réexécuter la migration n’écrase pas une publication ou un brouillon existants.

### Créer et autoriser le compte client

1. Dans **Authentication → Users**, créer ou retrouver le compte du client et confirmer son email. L’authentification email/mot de passe doit être activée.
2. Transmettre les accès au client par un canal sécurisé, jamais dans le dépôt ou une clé de configuration frontend.
3. Exécuter dans le SQL Editor, en remplaçant l’email d’exemple :

```sql
insert into public.cms_administrators (user_id)
select id
from auth.users
where lower(email) = lower('votre-admin@votre-domaine.com')
on conflict (user_id) do nothing;
```

Vérifier que le compte existe et que son ID a bien été ajouté. Un `INSERT … SELECT` sur un email introuvable n’ajoute aucune ligne.

4. Se connecter avec ce compte sur `/admin`. Si le compte était déjà connecté, cliquer sur la vérification des accès ou se reconnecter.

L’application peut afficher une aide SQL quand le schéma n’est pas installé ; **le navigateur ne peut pas exécuter lui-même la migration ni s’attribuer les droits**.

Ne pas tester `is_cms_admin()` depuis une session SQL Editor sans JWT puis conclure à un échec : `auth.uid()` y est normalement vide. Tester avec une vraie session Auth dans l’application.

Si le projet n’a aucun besoin d’inscription publique, envisager de désactiver les inscriptions Auth libres, après vérification des autres applications qui utilisent ce projet. Le site MoveSmart n’a pas besoin d’un formulaire public de création de comptes admin.

### Retirer les droits

```sql
delete from public.cms_administrators
where user_id in (
  select id from auth.users
  where lower(email) = lower('votre-admin@votre-domaine.com')
);
```

Le serveur refuse alors les prochains accès administrateur, même si un ancien JWT est encore valide. Cela n’efface pas les données déjà téléchargées par ce compte. Ne supprimer le compte Auth lui-même que si cela convient aussi aux autres usages du projet.

## 3. Modifier une page sans toucher au site public

1. Ouvrir **Contenus du site** puis la rubrique voulue.
2. Choisir FR, EN ou AR et modifier les champs. Le brouillon est commun à tous les administrateurs.
3. Cliquer sur **Enregistrer le brouillon**. Le site public ne change pas.
4. Cliquer sur **Aperçu**. Cette action sauvegarde le brouillon, puis ouvre une fenêtre avec `?preview=draft`.
5. Vérifier desktop/mobile et les langues. Les liens publics internes conservent le marqueur d’aperçu ; utiliser **Quitter** pour revenir au site publié.
6. Cliquer sur **Publier** et confirmer. Les modifications locales sont sauvegardées avant la publication.

L’aperçu du brouillon nécessite un compte Auth membre de `cms_administrators`. Un lien transmis à un visiteur anonyme ou à un non-admin montre uniquement du contenu public. Tous les formulaires de contact/newsletter sont désactivés sur une URL d’aperçu, y compris pendant la vérification d’accès. Les liens externes email/WhatsApp peuvent toujours ouvrir leurs applications : ils n’envoient pas automatiquement de message.

Le navigateur vérifie à nouveau le contenu quand la fenêtre reprend le focus. Ce n’est pas une synchronisation temps réel par WebSocket ; recharger une fenêtre publique permet aussi de voir une nouvelle publication. Une panne temporaire conserve la dernière version publiée connue, jamais une copie de brouillon. Une déconnexion retire le brouillon affiché dans les autres onglets d’aperçu.

### Saisies et modifications concurrentes

- Changer d’onglet de l’admin conserve les panneaux et les saisies locales.
- Recharger/quitter avec des modifications de contenu ou d’annonce déclenche une protection de saisie.
- Annuler une annonce modifiée ou fermer son dialogue avec Échap demande confirmation. Une opération en cours ne peut pas être fermée via ce dialogue.
- Deux administrateurs ne peuvent pas écraser silencieusement un brouillon ou publier à partir d’une révision périmée. En cas de conflit, exporter ses changements locaux avant de recharger et les réappliquer à la bonne version.
- Les annonces ont un CRUD immédiat, **sans historique de publication ni verrou de révision CMS**. Coordonner les modifications d’un même bien entre administrateurs.

### Historique et sauvegardes

**Historique des publications → Restaurer** charge un instantané dans le brouillon local. Ce n’est pas une publication automatique : sauvegarder, prévisualiser puis publier explicitement.

**Exporter le JSON** exporte le brouillon local ; **Importer le JSON** le charge dans l’éditeur après validation. Taille maximale : 1 Mo pour le fichier et le contenu validé. L’import ne modifie pas immédiatement le serveur. Conserver ces fichiers comme des sauvegardes privées, surtout s’ils contiennent des articles non publiés.

Ces exports concernent le CMS des pages, pas les annonces, fichiers binaires ou demandes clients. Prévoir également une sauvegarde Supabase et Storage.

## 4. Articles, FAQ et témoignages

- Les textes sont du texte brut. Les paragraphes des articles sont séparés par une ligne vide ; aucun HTML arbitraire n’est injecté.
- Remplir les trois langues. Les champs localisés de collections peuvent se rabattre sur le français puis une autre traduction disponible lorsqu’un champ est vide.
- Garder des titres, libellés de boutons et textes courts compatibles avec la mise en page. Vérifier l’aperçu avant de publier.
- Le slug/ID d’un article est son URL. Modifier un slug déjà diffusé ne crée pas de redirection automatique pour l’ancienne URL.
- La date d’un article est une date affichée, **pas une programmation de publication**.
- Un article décoché « Afficher après publication » reste dans le brouillon et l’historique privés. Son corps est exclu du JSON public lors de la publication globale du site. Cocher l’article puis publier pour le rendre public.
- Masquer une section de l’accueil est seulement une option d’affichage : les autres textes/collections inclus dans le contenu publié restent lisibles par l’API. Ne pas utiliser une section masquée comme un coffre de données confidentielles.
- Ne publier que de vrais témoignages, avec autorisation d’utiliser le nom, l’avis et la photo. Les avis et chiffres initiaux sont repris du dépôt, pas certifiés par le CMS.

Retirer un contenu publié ne garantit pas la disparition de toutes les copies déjà vues, indexées ou mises en cache. Les historiques privés et sauvegardes ont aussi leur propre durée de conservation.

## 5. Images et médiathèque

Formats d’import : **JPG/JPEG, PNG, WEBP, AVIF**, jusqu’à **5 Mo (5 × 1024² octets)** par image. Pas de SVG, PDF ou fichier vide. Les chemins générés utilisent des UUID, sans écraser un fichier existant.

- Un champ image accepte un import ou une URL HTTP(S)/un chemin local absolu comme `/images/photo.jpg`.
- La médiathèque affiche `photos/cms/`, avec imports par lots de 20 et copies d’URL.
- Les galeries d’annonces utilisent `photos/listings/`.
- Les images des témoignages et articles se modifient dans leurs collections.
- Les textes alternatifs des images de pages et articles sont disponibles dans les trois langues. Les photos d’annonces utilisent le titre du bien comme description générale.
- Décocher l’adaptation monochrome si le logo doit garder ses couleurs en mode clair.

> **Tout fichier importé dans `photos` est public dès l’import**, même avant sauvegarde ou publication d’un brouillon. Les règles privées du CMS ne rendent pas les photos confidentielles. Ne jamais y déposer une pièce d’identité, un contrat ou un document client.

Retirer une image d’un champ ou d’une annonce retire sa référence ; cela ne supprime pas son fichier physique, qui peut être partagé avec d’autres pages ou versions. La suppression physique n’est volontairement pas exposée dans la médiathèque. Pour nettoyer Storage, sauvegarder les fichiers et vérifier les références publiées, brouillons, historiques et annonces avant une suppression manuelle par le propriétaire.

Les photos initiales peuvent être hébergées chez des tiers ; ces hébergeurs reçoivent les requêtes d’images. Utiliser ses propres images dans Storage pour maîtriser leurs URLs et leur disponibilité. Les polices sont distribuées localement avec leurs licences OFL dans `public/licenses/`.

## 6. Demandes clients et newsletter

Les formulaires publics valident leurs champs et attendent une confirmation serveur avant d’afficher un succès. Les erreurs conservent les saisies. Les numéros sont normalisés au format international ; les chiffres arabes du téléphone sont acceptés et convertis.

Dans l’admin :

- **Demandes clients** : détails, options/message, statuts nouveau/contacté/archivé, suppression explicite, export CSV.
- **Newsletter** : adresses enregistrées, désinscription, suppression et export. Une adresse désinscrite doit passer par une nouvelle inscription consentie sur le formulaire public ; l’interface ne la réactive pas silencieusement.
- Les lectures se font par pages de 50. **Le CSV contient seulement les lignes chargées**, pas toute la base par défaut. Cliquer sur « Charger plus » avant un export complet.
- Les cellules susceptibles d’être interprétées comme formules Excel sont neutralisées ; protéger les exports contenant des données personnelles.

Le consentement est **déclaré via la case du formulaire**, avec horodatage serveur. Il ne prouve pas à lui seul l’identité ou la propriété de l’adresse email.

**Aucun email automatique, envoi de newsletter, double opt-in, notification, webhook ou CRM externe n’est configuré.** Ajouter un service serveur d’email/CRM et une procédure de confirmation si l’exploitation commerciale le nécessite. Ne jamais placer sa clé secrète dans le frontend.

Anti-spam de base : honeypot, validation serveur, 3 soumissions par email/type en 15 minutes, quota commun de 30 par IP/heure lorsque l’API fournit l’adresse IP, et nettoyage des compteurs vieux de 24 heures lors d’une nouvelle soumission acceptée. Ce dispositif n’est pas un CAPTCHA et n’empêche pas tous les abus distribués ; prévoir une protection complémentaire et une surveillance en production.

Définir avec le propriétaire la politique de conservation des demandes, abonnements, fichiers, exports et sauvegardes. La page de confidentialité fournie est un contenu éditable, pas un avis juridique.

## 7. Recette indispensable sur le vrai projet

Après installation, vérifier au minimum :

- [ ] Le compte client se connecte et voit les bons panneaux.
- [ ] Un compte Auth non-admin est refusé, y compris s’il possède un champ `user_metadata.role = 'admin'`.
- [ ] Un visiteur anonyme ne lit pas les brouillons, historiques, demandes ou abonnements.
- [ ] Un texte/image enregistré en brouillon n’altère pas la page publique ; l’aperçu autorisé montre la nouvelle version.
- [ ] Une publication rend la version attendue publique, en FR/EN/AR, sur mobile et desktop.
- [ ] Un article non affiché ne figure pas dans le JSON public après publication.
- [ ] Un import d’image autorisé fonctionne et son URL publique charge réellement ; une liste de métadonnées non autorisée est refusée ou vide.
- [ ] Créer/modifier un bien avec prix/surface décimaux fonctionne sans perdre les décimales. Sa modification est immédiatement publique.
- [ ] Un contact de recette et une inscription newsletter sont réellement stockés, puis supprimés si nécessaire. Aucune promesse d’envoi d’email n’est faite.
- [ ] Deux onglets tentant de sauvegarder une révision périmée reçoivent un conflit.
- [ ] La déconnexion retire le brouillon d’un autre onglet d’aperçu.
- [ ] La configuration d’hébergement sert les routes SPA en accès direct et les variables correspondent au projet voulu.

## 8. Dépannage

| Symptôme                                    | Vérification                                                                                                   |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| « CMS pas encore configuré »                | Migration exécutée intégralement, projet correct, cache de schéma PostgREST actualisé                          |
| « Accès non autorisé »                      | ID du vrai utilisateur Auth présent dans `cms_administrators`; connexion seule et métadonnées ne suffisent pas |
| Migration bloquée sur bucket privé          | Auditer les fichiers ; ne jamais convertir aveuglément le bucket en public                                     |
| Migration bloquée sur colonne/vue existante | Sauvegarder et préparer la conversion des dépendances avec le propriétaire, sans supprimer les annonces        |
| « Contenu a changé dans un autre onglet »   | Exporter localement, recharger la révision puis réappliquer les changements                                    |
| Données reçues de format invalide           | Vérifier les colonnes/données héritées avec le propriétaire ; ne pas supprimer une table pour masquer l’erreur |
| Image introuvable                           | URL, bucket public, format, accès Storage et disponibilité de l’hébergeur                                      |
| Formulaire sans succès                      | RPC, validation, consentement, quotas et réseau ; la saisie reste conservée pour réessayer                     |
| Export incomplet                            | Charger les autres pages ; le bouton indique le nombre de lignes exportées                                     |
| Mot de passe oublié                         | Utiliser la gestion Auth/récupération du projet ; ce site n’ajoute pas de parcours de récupération de compte   |

Si le schéma vient d’être installé et que l’API le signale encore absent, le propriétaire peut demander le rechargement du cache :

```sql
notify pgrst, 'reload schema';
```

## 9. Validation du code et limites

```sh
npm run lint
npm test
npm run build
npm audit
npm run format:check
npx playwright install chromium
npm run test:e2e
```

- `lint` est un contrôle TypeScript strict, pas une configuration ESLint.
- Les tests SQL PGlite exécutent la migration et simulent `auth`, `storage` et les rôles. Ils vérifient notamment RLS, anciennes policies permissives, brouillons, conflits, articles privés, validation et quotas.
- Les E2E utilisent des API et images simulées. Ils ne créent aucun compte ou contenu sur le projet distant, et ne valident pas sa configuration Auth/Storage réelle.
- Le build reste une SPA. Les métadonnées SEO sont mises à jour en JavaScript et la 404 est côté routeur ; SSR/prérendu et codes HTTP de contenu ne sont pas ajoutés.
- La configuration Supabase distante, l’attribution du compte client et le déploiement doivent être effectués et validés séparément.

Avant livraison publique, faire valider les coordonnées, autorisations d’images/avis, chiffres commerciaux, articles datés, fiscalité, conditions de résidence/Golden Visa et politique de confidentialité. Les rendements sont indicatifs ; le développement du CMS ne constitue ni une vérification financière ni une validation juridique.
