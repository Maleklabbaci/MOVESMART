# Mesure d’audience sans IP ni empreinte numérique

Ce document décrit la mesure de fréquentation ajoutée avec
`supabase/migrations/202610080002_admin_dashboard_analytics.sql` : ce qui est
enregistré, ce qui ne l’est jamais, comment le consentement fonctionne, et pourquoi
les chiffres affichés sont volontairement inférieurs au trafic réel.

## 1. Principe

- **Aucune mesure sans consentement explicite.** Aucune requête n’est envoyée tant que
  le visiteur n’a pas cliqué sur « J’accepte la mesure ».
- **Aucune adresse IP, aucun cookie de suivi, aucune empreinte numérique.** Le navigateur
  n’envoie jamais d’IP au serveur applicatif pour cette fonction : la base ne contient ni
  colonne IP, ni chaîne _user-agent_, ni identifiant persistant de visiteur.
- **Un seul identifiant : une session aléatoire.** Le navigateur génère un UUID aléatoire
  conservé localement, renouvelé après 30 minutes d’inactivité, effacé lorsque l’accord
  est retiré ou le stockage vidé.
- **Agrégats uniquement côté administrateur.** Les pages vues individuelles ne sont
  lisibles par personne via l’API : même un administrateur connecté ne reçoit que des
  totaux (RPC `analytics_summary`).
- **Conservation limitée : 90 jours.** Chaque écriture supprime les lignes plus anciennes.

## 2. Ce qui est enregistré

| Donnée       | Exemple                                                                     | Utilité                                                  |
| ------------ | --------------------------------------------------------------------------- | -------------------------------------------------------- |
| `session_id` | UUID aléatoire                                                              | Compter des sessions distinctes sans identifier personne |
| `path`       | `/listings`                                                                 | Pages distinctes et pages les plus consultées            |
| `browser`    | `Chrome`, `Safari`, `Firefox`, `Edge`, `Opera`, `Samsung Internet`, `Autre` | Répartition par navigateur                               |
| `created_at` | horodatage                                                                  | Série par jour, fraîcheur des données                    |

Sont **exclus par construction** (et vérifiés par les tests) : adresse IP, chaîne
_user-agent_ complète, cookies, identifiant publicitaire, empreinte de canvas/WebGL,
résolution d’écran, référent, paramètres d’URL, adresse email, identité de compte.

Le chemin est nettoyé avant l’envoi : chaîne de requête et fragment sont supprimés
(`/blog/article?preview=draft` devient `/blog/article`), l’espace d’administration
(`/admin…`) et les aperçus de brouillon ne sont jamais mesurés.

## 3. Consentement

- Une bannière apparaît sur le site public **une seule fois**, uniquement si la mesure
  est disponible et qu’aucun signal de confidentialité n’est présent.
- « J’accepte la mesure » enregistre le consentement et déclenche la première mesure.
- « Refuser » et « Effacer mon choix » sont aussi accessibles ; il n’y a pas de bouton
  discret ou dissimulé.
- La page `/privacy` affiche la section « Mesure d’audience », les contrôles
  (accepter / retirer / effacer le choix) et l’explication du sous-comptage. Textes
  modifiables dans le CMS (section **Confidentialité**), en FR/EN/AR.
- **`Do Not Track` et `Global Privacy Control` gagnent toujours** : si l’un des deux est
  actif, la bannière n’apparaît pas, rien n’est mesuré, et un accord précédent est ignoré.

## 4. Désactiver complètement la mesure

Sans variable, la mesure est **activée** mais reste soumise au consentement. Pour la
désactiver à la construction du site :

```dotenv
VITE_ANALYTICS_ENABLED="false"
```

Dans ce cas, aucune bannière, aucun texte supplémentaire et aucune requête ne sont émis.

## 5. Installer la migration

1. Sauvegarder le projet Supabase.
2. Exécuter `supabase/migrations/202610080001_admin_cms.sql` s’il ne l’est pas déjà.
3. Exécuter ensuite `supabase/migrations/202610080002_admin_dashboard_analytics.sql`.
4. Recharger le cache de l’API : `notify pgrst, 'reload schema';`
5. Vérifier dans `/admin` → **Tableau de bord** : la section « Fréquentation du site
   public » doit afficher « Aucune mesure disponible » (et non une erreur de migration).

> Cette migration est **livrée dans le dépôt** et n’a pas été appliquée au projet
> Supabase distant depuis cet environnement : le propriétaire l’applique lui-même après
> sauvegarde et recette. Tant qu’elle n’est pas appliquée, l’administration fonctionne en
> mode dégradé : totaux exacts et demandes récentes disponibles, relances/notes et
> statistiques annoncées comme indisponibles.

La migration est additive et réexécutable : elle n’écrase ni contenus, ni annonces, ni
demandes, ni images, et ne fait que **ajouter** des colonnes et des objets.

## 6. Vérifications utiles (SQL Editor)

```sql
-- La table ne contient que ces colonnes, dont aucune IP ni user-agent.
select column_name from information_schema.columns
where table_schema = 'public' and table_name = 'analytics_pageviews'
order by ordinal_position;

-- Volumétrie par jour et navigateur (agrégat uniquement).
select date_trunc('day', created_at)::date as jour, browser, count(*) as pages_vues,
       count(distinct session_id) as sessions
from public.analytics_pageviews
group by 1, 2 order by 1 desc;

-- Purge manuelle, en plus de la purge automatique à chaque écriture.
delete from public.analytics_pageviews where created_at < now() - interval '90 days';

-- Désactiver la mesure en conservant l’historique : bloquer les écritures.
revoke execute on function public.record_pageview(uuid, text, text) from anon, authenticated;
```

## 7. Pourquoi les chiffres sous-comptent (et pourquoi c’est assumé)

1. **Seuls les visiteurs qui acceptent sont mesurés.** Les refus ne sont pas compensés
   par une estimation.
2. **`Do Not Track` / `Global Privacy Control`** désactivent la mesure, même après accord.
3. **Blocages techniques** : bloqueurs de scripts ou de publicité, JavaScript désactivé,
   navigation privée restrictive, requête réseau en échec, onglet fermé trop tôt.
4. **La page vue avant le choix n’est jamais enregistrée** : la mesure commence à la
   première navigation suivant l’acceptation.
5. **Pas de robots** : un client sans JavaScript n’est pas compté, mais certains robots
   modernes exécutent le JavaScript.
6. **Sessions ≠ visiteurs uniques.** Sans IP ni empreinte, un « visiteur unique » est
   impossible à calculer honnêtement. Un même visiteur qui vide le stockage ou navigue
   en privé crée plusieurs sessions : les sessions distinctes sont une approximation qui
   **surestime** parfois le nombre de visites, alors que le total de pages vues
   **sous-estime** le trafic réel.
7. **Plafond anti-abus** : 120 événements par heure et par session sont acceptés, le
   reste est ignoré — un visiteur très actif peut donc être légèrement tronqué.

Conclusion à communiquer au client : ces chiffres servent à suivre des **tendances**
(pages consultées, navigateurs, évolution par jour), pas à facturer ou à auditer du
trafic. Pour un besoin contractuel, un outil d’analyse externe — avec son propre
consentement — serait nécessaire.

## 8. Limites de sécurité connues

- `record_pageview` est appelable par un visiteur anonyme, comme le sont les formulaires
  publics. Le plafond par session et la validation stricte (chemin, navigateur, UUID)
  limitent les abus, mais un script malveillant pourrait gonfler les compteurs en créant
  de nouvelles sessions. Aucune donnée personnelle n’en est exposée pour autant.
- La mesure n’a pas d’objectif publicitaire ni de croisement multi-sites : aucune
  corrélation n’est possible avec d’autres sites.
- Les tests (`src/tests/analytics.test.ts`, `src/tests/dashboard.test.ts`) vérifient
  l’absence de colonnes IP/_user-agent_, la validation des chemins, le plafond, la purge
  à 90 jours, et l’impossibilité pour le navigateur de lire les pages vues.
