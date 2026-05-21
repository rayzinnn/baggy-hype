# Ecommerce SAAS

Esta pasta guarda o sistema de ADMIN reutilizavel para clientes.

Importante: o frontend publico da Baggy Hype continua sendo um projeto proprio. Clientes futuros podem ter frontends diferentes, mas podem reutilizar o mesmo painel admin, schema, APIs administrativas e fluxo Supabase.

## Estrutura

- `admin-template/`: base tecnica do painel admin reutilizavel.
- `guia-implantacao-novo-cliente.md`: passo a passo para implantar o admin em um novo cliente.

## Modelo correto

- Cada cliente tem frontend proprio.
- Cada cliente tem Supabase proprio.
- Cada cliente tem Netlify/deploy proprio.
- O admin reutilizado fica em `/admin`.
- Login do admin usa Supabase Auth.
- Permissao de admin vem da tabela `AdminUser`.

Nao transforme a loja principal da Baggy Hype em template visual. O template aqui e do painel/admin e da estrutura operacional.
