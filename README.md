# TaskFlow

Mini-application web de gestion de tâches, développée avec **React + Vite** et **Supabase** (Auth + Postgres).

Chaque utilisateur peut créer un compte, gérer ses tâches personnelles (CRUD), filtrer, trier, rechercher, et visualiser leur état d'avancement.

> Le cahier des charges recommandait Firebase. **Supabase** a été retenu comme alternative autorisée : architecture BaaS équivalente (Auth + base relationnelle), 100 % gratuite sur le plan Free, sans carte bancaire requise.

---

## Fonctionnalités

### Authentification
- Inscription par email + mot de passe (validation côté client : email valide, mot de passe ≥ 6 caractères, confirmation).
- Connexion / déconnexion.
- Persistance de la session (rafraîchir la page conserve l'utilisateur connecté).
- Redirection automatique vers `/connexion` si non authentifié.

### Gestion des tâches (CRUD)
- Création : titre (obligatoire), description, échéance, priorité (basse / moyenne / haute).
- Listing limité aux tâches de l'utilisateur connecté (garanti par RLS Postgres).
- Modification d'une tâche existante.
- Suppression avec confirmation.
- Bascule du statut « terminée / en cours ».

### Filtrage, tri et recherche
- Filtre par statut : toutes / en cours / terminées.
- Tri par date de création, échéance ou priorité.
- Recherche textuelle sur le titre.

### UI / UX
- Interface responsive (mobile et desktop).
- États de chargement explicites.
- Notifications via `react-toastify` (succès et erreurs non-bloquantes).
- Validation des formulaires côté client.

---

## Stack

- **Frontend** : React 19, React Router DOM 7, Vite.
- **Backend** : Supabase (Auth + Postgres + Row Level Security).
- **Notifications** : `react-toastify`.
- **Lint** : ESLint.

---

## Démarrage rapide (3 commandes)

```bash
npm install
cp .env.example .env   # puis renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
npm run dev
```

L'application est disponible sur [http://localhost:5173](http://localhost:5173).

---

## Configuration Supabase

1. Créer un compte sur [supabase.com](https://supabase.com) (login GitHub possible).
2. **New project** → nommer le projet, choisir une région, définir un mot de passe DB.
3. Une fois le projet prêt, aller dans **SQL Editor** → **New query**, coller le contenu de [`supabase/schema.sql`](supabase/schema.sql) puis cliquer **Run**. Cela crée la table `taches` et les politiques RLS.
4. Dans **Project Settings → API**, copier :
   - **Project URL** → `VITE_SUPABASE_URL` dans `.env`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY` dans `.env`
5. Dans **Authentication → Providers**, vérifier que **Email** est activé (par défaut oui). Pour faciliter les tests, désactiver « Confirm email » dans **Authentication → Sign In / Up** (sinon il faut confirmer chaque email avant connexion).

### Variables d'environnement (`.env`)

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

Le fichier `.env` est ignoré par git ; seul `.env.example` est versionné. La `anon key` est conçue pour être publique côté client : la sécurité repose sur les politiques RLS.

---

## Structure du projet

```
taskflow/
├── supabase/
│   └── schema.sql            # Schéma + politiques RLS à exécuter dans Supabase
└── src/
    ├── App.jsx               # Routeur + protection des routes + auth listener
    ├── main.jsx              # Point d'entrée + ToastContainer
    ├── index.css             # Styles globaux
    ├── supabase/
    │   ├── config.js         # Initialisation du client Supabase
    │   └── services.js       # CRUD sur la table "taches"
    ├── composants/
    │   ├── Navigation.jsx    # Barre de navigation + déconnexion
    │   ├── FormulaireTache.jsx   # Formulaire création / édition
    │   └── CarteTache.jsx    # Carte d'une tâche (toggle, edit, delete)
    └── pages/
        ├── Connexion.jsx
        ├── Inscription.jsx
        └── TableauDeBord.jsx # Dashboard : liste, filtres, tri, recherche
```

### Modèle de données

Table `public.taches` :

| Colonne       | Type          | Notes                                      |
| ------------- | ------------- | ------------------------------------------ |
| `id`          | uuid          | clé primaire (auto)                        |
| `user_id`     | uuid          | FK vers `auth.users(id)` (cascade delete)  |
| `titre`       | text          | obligatoire, 1–200 caractères              |
| `description` | text          | défaut `''`                                |
| `echeance`    | text          | date ISO (YYYY-MM-DD), défaut `''`         |
| `priorite`    | text          | `'basse'` / `'moyenne'` / `'haute'`        |
| `termine`     | boolean       | défaut `false`                             |
| `cree_le`     | timestamptz   | défaut `now()`                             |

Les colonnes Postgres sont en `snake_case` ; le client JS expose les tâches en `camelCase` (`userId`, `creeLe`) — la conversion est faite dans [`src/supabase/services.js`](src/supabase/services.js).

Les politiques RLS garantissent qu'un utilisateur ne peut lire / écrire que ses propres tâches même si quelqu'un récupérait la `anon key`.

---

## Scripts npm

| Commande          | Effet                          |
| ----------------- | ------------------------------ |
| `npm run dev`     | Serveur de développement Vite  |
| `npm run build`   | Build de production            |
| `npm run preview` | Sert le build localement       |
| `npm run lint`    | Analyse ESLint                 |

---

## Déploiement (bonus)

Le projet est compatible avec **Vercel**, **Netlify** ou **Cloudflare Pages**.

Exemple Vercel :
```bash
npm run build
# importer le repo sur vercel.com et renseigner les variables d'environnement VITE_SUPABASE_*
```

---

## Améliorations possibles avec plus de temps

- Tests unitaires (Vitest) sur `services.js` et les composants critiques.
- Système de tags / catégories (mentionné en bonus).
- Realtime via les channels Supabase pour synchroniser plusieurs onglets.
- Skeleton loaders au lieu de simples textes "Chargement...".
- Internationalisation (FR / EN).
