# 🔐 Accès aux Dashboards Admin - KERV SMM PANEL

## Super Admin (Accès Complet)
- **URL**: `/admin`
- **Email**: `admin@kerv.com`
- **Mot de passe**: `kerventz2005`
- **Permissions**: Accès total, gestion des sous-admins, modification des soldes, analytics complets

## Sous-Admin (Gestion des Dépôts)
- **URL**: `/subadmin`
- **Email**: `subadmin@kerv.com`
- **Mot de passe**: `admin1234`
- **Permissions**: Validation/refus des dépôts clients uniquement

## Notes Importantes
1. Ces comptes sont créés automatiquement lors de l'exécution du script SQL `003_create_admin_accounts.sql`
2. Pour créer ces comptes, exécutez les scripts SQL dans l'ordre :
   - `001_create_database_schema.sql`
   - `002_create_user_profile_trigger.sql`
   - `003_create_admin_accounts.sql`
3. Les mots de passe sont hachés avec bcrypt dans la base de données
4. Changez ces identifiants en production pour des raisons de sécurité

## Contact Support
- **WhatsApp**: +18494865098
- **Email**: contact.kerventzweb@gmail.com
