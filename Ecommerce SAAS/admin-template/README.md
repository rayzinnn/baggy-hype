# Admin Template

Base tecnica do painel administrativo reutilizavel.

Este template contem apenas o que o admin precisa:

- rotas `/admin`;
- login admin;
- APIs de upload de midia;
- server actions administrativas;
- componentes administrativos;
- Prisma schema e migrations;
- configuracao Next/Netlify.

Use este template quando um cliente tiver frontend proprio, mas precisar do mesmo painel de gerenciamento.

## Instalar

```bash
npm install
```

## Configurar `.env`

```env
DATABASE_URL=""
SUPABASE_URL=""
SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
SUPABASE_MEDIA_BUCKET="product-media"
AUTH_SECRET=""
ADMIN_EMAIL=""
```

## Banco

```bash
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

## Rodar

```bash
npm run dev
```

Abra `/admin/login`.

## Regras de login

- O email/senha sao validados pelo Supabase Auth.
- O email precisa existir tambem na tabela `AdminUser`.
- Senha nao fica no banco do app.

## Observacao

Este template nao substitui o frontend publico do cliente. Ele e o modulo administrativo a ser acoplado ao projeto do cliente.
