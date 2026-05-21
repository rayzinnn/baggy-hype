# Storefront Checkout Snapshot

Esta pasta guarda a parte de carrinho/checkout para reaproveitar em frontends de clientes.

Ela nao e importada automaticamente pelo `admin-template`. Use como referencia ou copie para o projeto de frontend do cliente quando a loja precisar do fluxo:

- `src/providers/CartProvider.tsx`: estado do carrinho em `localStorage`.
- `src/components/product/AddToCartButton.tsx`: botao de adicionar item ao carrinho.
- `src/app/cart/page.tsx`: pagina de carrinho/checkout.
- `src/app/api/orders/route.ts`: API que cria pedido pendente, baixa estoque e gera link do WhatsApp.

Regra de CRM atual:

- O checkout cria uma intencao de pedido com status `PENDING`.
- Essa intencao nao cria cliente no CRM.
- O cliente so entra na tabela `Customer` quando o pedido e marcado como `PAID` ou `DELIVERED` no admin.

Ao aplicar em um frontend novo, revise:

- import aliases `@/`;
- nomes/copy da marca;
- telefone de WhatsApp vindo de `SiteConfig`;
- schema Prisma compartilhado;
- variaveis `DATABASE_URL`, `SUPABASE_*` e bucket de midias.
