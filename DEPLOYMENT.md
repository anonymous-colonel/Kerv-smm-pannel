# Guide de déploiement - KERV SMM PANEL

## Déploiement sur Vercel

### 1. Préparer le projet

Assurez-vous que tous les fichiers sont commités sur Git.

### 2. Connecter à Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Import Project"
3. Sélectionnez votre repository GitHub
4. Vercel détectera automatiquement Next.js

### 3. Configurer les variables d'environnement

Dans les paramètres Vercel, ajoutez toutes les variables d'environnement :

**Supabase** (déjà configurées)
- `SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY`
- Toutes les autres variables Supabase

**Email**
- `EMAIL_PROVIDER=gmail`
- `EMAIL_FROM=contact.kerventzweb@gmail.com`
- `GMAIL_USER=your-gmail@gmail.com`
- `GMAIL_APP_PASSWORD=your-app-password`

**SMS (Twilio)**
- `TWILIO_ACCOUNT_SID=ACxxxxx`
- `TWILIO_AUTH_TOKEN=your-token`
- `TWILIO_FROM_NUMBER=+1234567890`

**SMM API**
- `SMM_API_URL=https://your-smm-api.com`
- `SMM_API_KEY=your-api-key`

### 4. Déployer

Cliquez sur "Deploy" et attendez que le déploiement se termine.

## Configuration post-déploiement

### 1. Exécuter les scripts SQL

Connectez-vous à votre dashboard Supabase et exécutez les scripts dans l'ordre :

1. `scripts/001_create_database_schema.sql`
2. `scripts/002_create_user_profile_trigger.sql`
3. `scripts/003_create_admin_accounts.sql`
4. `scripts/004_create_rpc_functions.sql`

### 2. Configurer l'authentification Supabase

Dans le dashboard Supabase :

1. Allez dans Authentication > URL Configuration
2. Ajoutez votre URL de production dans "Site URL"
3. Ajoutez `https://your-domain.vercel.app/auth/callback` dans "Redirect URLs"

### 3. Configurer Gmail App Password

1. Allez sur [myaccount.google.com/security](https://myaccount.google.com/security)
2. Activez la vérification en 2 étapes
3. Générez un "App Password"
4. Utilisez ce mot de passe dans `GMAIL_APP_PASSWORD`

### 4. Configurer Twilio

1. Créez un compte sur [twilio.com](https://twilio.com)
2. Achetez un numéro de téléphone
3. Récupérez votre Account SID et Auth Token
4. Ajoutez-les dans les variables d'environnement

### 5. Configurer l'API SMM

Contactez votre fournisseur d'API SMM pour obtenir :
- L'URL de l'API
- Votre clé API

## Vérification

Après le déploiement, vérifiez :

- [ ] La page d'accueil s'affiche correctement
- [ ] L'inscription fonctionne
- [ ] La connexion fonctionne
- [ ] Les emails sont envoyés
- [ ] Les SMS sont envoyés (si configuré)
- [ ] Le dashboard client fonctionne
- [ ] Les commandes peuvent être passées
- [ ] Les dépôts peuvent être demandés
- [ ] Les transferts fonctionnent
- [ ] Le panel admin est accessible
- [ ] Le panel sous-admin est accessible
- [ ] Les notifications en temps réel fonctionnent

## Maintenance

### Sauvegardes

Supabase effectue des sauvegardes automatiques. Pour des sauvegardes manuelles :

\`\`\`bash
pg_dump -h your-db-host -U postgres -d your-db > backup.sql
\`\`\`

### Monitoring

Utilisez Vercel Analytics pour surveiller :
- Les performances
- Les erreurs
- Le trafic

### Mises à jour

Pour mettre à jour le site :

\`\`\`bash
git add .
git commit -m "Update"
git push
\`\`\`

Vercel déploiera automatiquement les changements.

## Support

Pour toute question :
- WhatsApp: +18494865098
- Email: contact.kerventzweb@gmail.com
