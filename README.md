# KERV SMM PANEL 🚀🔥

Un panel SMM professionnel et moderne pour vendre des services automatisés sur WhatsApp, Facebook, Instagram, YouTube et TikTok.

## Fonctionnalités

### Partie Publique
- Page d'accueil avec présentation des services
- Inscription et connexion sécurisées
- Vérification par email
- Page de contact

### Espace Client
- Dashboard avec statistiques
- Achat de services (abonnés, likes, vues, etc.)
- Demandes de dépôts
- Transferts entre utilisateurs (commission 5%)
- Historique complet
- Notifications en temps réel

### Espace Sous-Admin
- Gestion des demandes de dépôts
- Approbation/rejet des dépôts
- Historique des actions

### Espace Super Admin
- Dashboard analytique complet
- Gestion des utilisateurs
- Ajustement des soldes
- Gestion des sous-admins
- Logs détaillés
- Statistiques globales

## Technologies

- **Frontend**: Next.js 15, React, TailwindCSS
- **Backend**: Next.js API Routes, Supabase
- **Base de données**: PostgreSQL (Supabase)
- **Authentification**: Supabase Auth + JWT
- **Notifications**: Real-time avec Supabase Realtime
- **Email**: Gmail App Password / SendGrid
- **SMS**: Twilio
- **API SMM**: Intégration personnalisée

## Installation

### 1. Cloner le projet

\`\`\`bash
git clone <repository-url>
cd kerv-smm-panel
npm install
\`\`\`

### 2. Configurer les variables d'environnement

Les variables Supabase sont déjà configurées. Ajoutez les suivantes :




### 3. Initialiser la base de données

Les scripts SQL sont dans le dossier `scripts/`. Exécutez-les dans l'ordre :

1. `001_create_database_schema.sql` - Crée toutes les tables
2. `002_create_user_profile_trigger.sql` - Crée les triggers
3. `003_create_admin_accounts.sql` - Crée les comptes admin
4. `004_create_rpc_functions.sql` - Crée les fonctions RPC

### 4. Lancer le projet

\`\`\`bash
npm run dev
\`\`\`

Le site sera accessible sur `http://localhost:3000`



## Structure du projet

\`\`\`
kerv-smm-panel/
├── app/
│   ├── (public)/          # Pages publiques
│   ├── auth/              # Authentification
│   ├── dashboard/         # Espace client
│   ├── admin/             # Espace super admin
│   ├── subadmin/          # Espace sous-admin
│   └── api/               # API routes
├── components/
│   ├── ui/                # Composants UI (shadcn)
│   ├── dashboard-layout.tsx
│   ├── admin-layout.tsx
│   └── notification-*.tsx
├── lib/
│   ├── supabase/          # Configuration Supabase
│   ├── integrations/      # Email, SMS, SMM API
│   ├── notifications/     # Système de notifications
│   └── types.ts
└── scripts/               # Scripts SQL
\`\`\`

## Sécurité

- Mots de passe hachés avec bcrypt
- Authentification JWT
- Row Level Security (RLS) sur toutes les tables
- Validation des entrées
- Protection CSRF
- Rate limiting sur les API

## Support

- WhatsApp: +18494865098
- Email: contact.kerventzweb@gmail.com

## Licence

Propriétaire - KERV SMM PANEL
