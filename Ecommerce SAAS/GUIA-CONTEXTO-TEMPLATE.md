# Guia Completo do Template Ecommerce SAAS

Este documento existe para orientar voce e futuras sessoes do Codex. A regra principal: a Baggy Hype e uma loja propria; o `Ecommerce SAAS` e o kit reutilizavel para implantar o admin e, quando fizer sentido, copiar partes do checkout para frontends sob medida.

## Visao Geral

O modelo escolhido nao e multi-tenant. Cada cliente deve ter uma instalacao propria:

- um projeto Supabase proprio;
- um banco Postgres proprio;
- um bucket Supabase Storage proprio;
- um deploy Netlify proprio;
- um dominio proprio;
- um frontend proprio, com visual sob medida;
- o mesmo sistema de admin como base.

O cliente final deve usar apenas o painel admin. Supabase, Netlify, GitHub e codigo ficam sob responsabilidade tecnica de quem implanta.

## Estrutura da Pasta

`Ecommerce SAAS/admin-template`

Template do painel administrativo. Ele contem rotas de admin, Prisma, autenticacao por Supabase Auth, upload de midias, CRUDs e gestao operacional da loja.

`Ecommerce SAAS/storefront-checkout`

Snapshot do carrinho/checkout da Baggy para reaproveitamento em frontends customizados. Nao e um app ativo. E material de copia/adaptacao.

`Ecommerce SAAS/guia-implantacao-novo-cliente.md`

Checklist operacional para implantar um cliente novo.

`Ecommerce SAAS/GUIA-CONTEXTO-TEMPLATE.md`

Este arquivo. Use como contexto mestre antes de mexer no template.

## O Que o Template Entrega

- Login admin via Supabase Auth.
- Allowlist de emails admin via tabela `AdminUser`.
- Dashboard com metricas de carrinho, WhatsApp, vendas, faturamento, conversao e pendencias.
- Produtos, categorias, variantes, estoque, precos, custo e midias.
- Upload de midias via Supabase Storage.
- Pedidos com status operacional.
- Clientes/CRM derivados apenas de pedidos pagos ou entregues.
- Cupons.
- Configuracoes da loja.
- Base para deploy em Netlify.

## O Que Nao Deve Estar no Template

- Nome Baggy Hype.
- Copy, identidade, dominio, Instagram ou WhatsApp da Baggy.
- Credenciais reais.
- Arquivos `.env` com segredos.
- Banco local versionado.
- Frontend final de um cliente especifico.

## Fluxo de Pedido e Cliente

O checkout cria um pedido `PENDING`. Isso representa uma intencao de compra, nao um cliente real.

Quando o admin muda o pedido para `PAID` ou `DELIVERED`, o sistema cria ou atualiza o registro em `Customer` usando os dados do pedido. Assim o CRM mostra compradores reais, nao curiosos ou abandonos.

Se um cliente for excluido no admin, os pedidos permanecem no historico, mas deixam de apontar para aquele `Customer`.

## Checkout Reutilizavel

Para um novo frontend, copie/adapte os arquivos de `Ecommerce SAAS/storefront-checkout`.

Arquivos principais:

- `src/providers/CartProvider.tsx`
- `src/components/product/AddToCartButton.tsx`
- `src/app/cart/page.tsx`
- `src/app/api/orders/route.ts`

Antes de usar em outro projeto, conferir:

- aliases TypeScript;
- estilos/Tailwind do projeto;
- schema Prisma;
- textos de marca;
- telefone de WhatsApp em `SiteConfig`;
- comportamento de estoque;
- politica de cupons.

## Banco de Dados

Padrao recomendado: Supabase Postgres por cliente.

Variaveis necessarias:

- `DATABASE_URL`
- `AUTH_SECRET`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_MEDIA_BUCKET`

Credenciais de login admin nao devem ficar fixas no codigo. O login vem do Supabase Auth, e a permissao de acesso vem da tabela `AdminUser`.

## Auth Admin

Passos para liberar um admin:

1. Criar usuario no Supabase Auth.
2. Copiar o email exato.
3. Inserir esse email na tabela `AdminUser`.
4. Testar `/admin/login`.

Se o usuario existe no Auth mas nao esta em `AdminUser`, ele autentica no Supabase, mas nao deve acessar o painel.

## Midias

Padrao recomendado:

- bucket publico para leitura, por exemplo `product-media`;
- upload somente pelo admin;
- `SUPABASE_SERVICE_ROLE_KEY` usada apenas no servidor;
- URL publica salva no banco;
- `next.config.ts` deve permitir apenas o dominio real do Supabase Storage do cliente.

Nunca colocar `SUPABASE_SERVICE_ROLE_KEY` em componente client.

## Como Implantar um Cliente Novo

1. Copiar `admin-template` para um novo repositorio ou pasta.
2. Criar projeto Supabase.
3. Criar bucket de midia.
4. Configurar `.env.local` local, sem commitar.
5. Rodar migrations.
6. Criar usuario no Supabase Auth.
7. Inserir email em `AdminUser`.
8. Ajustar `SiteConfig`.
9. Conectar repo na Netlify.
10. Configurar envs na Netlify.
11. Fazer deploy.
12. Testar login, produto, midia, estoque, cupom, pedido e status pago.
13. Entregar ao cliente apenas URL da loja, URL do admin e email de acesso.

## Como Aplicar Frontend Proprio

O frontend do cliente pode ser totalmente customizado, mas deve respeitar os contratos:

- produto e variante precisam carregar estoque/preco reais do banco;
- carrinho deve enviar `items`, `customer` e `couponCode` para `/api/orders`;
- `/api/orders` cria pedido pendente e gera WhatsApp;
- admin muda status para pago quando pagamento for confirmado;
- CRM depende desse status.

## Checklist Antes de Publicar

- `npm run lint`
- `npm run build`
- login admin funciona;
- email nao autorizado nao acessa admin;
- produto com variantes salva estoque;
- upload de midia funciona;
- checkout cria pedido pendente;
- pedido pago cria cliente;
- deletar cliente nao apaga pedido;
- Netlify nao acusa segredo exposto;
- `.env` e bancos locais nao estao versionados;
- nenhuma referencia da Baggy ficou no template.

## Cuidados Para Futuras Alteracoes

- Alteracoes no admin compartilhado devem ser feitas primeiro na Baggy, testadas, e depois espelhadas no `admin-template`.
- Alteracoes de checkout devem ser refletidas no snapshot `storefront-checkout`.
- Nao transformar o projeto Baggy em template.
- Nao commitar credenciais.
- Nao criar dependencia entre clientes. Cada cliente continua isolado.
