# Guia de Implantacao do Admin para Novo Cliente

Este guia e para voce usar o painel admin deste projeto em uma loja nova. O cliente pode ter um frontend proprio, mas o painel administrativo, banco e APIs seguem este template.

## 1. O que sera entregue

- Frontend proprio do cliente.
- Painel admin em `/admin`.
- Banco Supabase proprio do cliente.
- Storage Supabase para midias.
- Deploy Netlify proprio.
- Login admin via Supabase Auth.
- Controle de permissao pela tabela `AdminUser`.

## 2. Antes de iniciar

Colete do cliente:

- Nome da loja.
- Dominio.
- WhatsApp com DDI e DDD.
- Instagram.
- Email do admin.
- Logo, cores e imagens.
- Categorias iniciais.
- Produtos iniciais.
- Politicas de entrega, retirada e troca.

## 3. Criar estrutura do cliente

1. Criar projeto Supabase do cliente.
2. Criar bucket `product-media` no Supabase Storage.
3. Criar usuario admin em Supabase Auth.
4. Criar projeto Netlify do cliente.
5. Criar repositorio/projeto do frontend do cliente.
6. Copiar a pasta `admin-template` para dentro do projeto do cliente, ou usar seus arquivos como referencia para montar `/admin`.

## 4. Variaveis obrigatorias

Configurar localmente e na Netlify:

```env
DATABASE_URL=""
SUPABASE_URL=""
SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
SUPABASE_MEDIA_BUCKET="product-media"
AUTH_SECRET=""
ADMIN_EMAIL=""
```

Nunca colocar esses valores em arquivos versionados.

## 5. Banco e permissoes

Rodar no projeto do cliente:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run db:seed
```

Depois conferir:

- O usuario existe em Supabase Auth.
- O email do usuario existe em `AdminUser`.
- O bucket `product-media` existe.
- O painel `/admin/login` aceita o login.

## 6. Integracao com frontend proprio

O frontend do cliente pode consumir o mesmo banco e as mesmas tabelas:

- `Product`
- `ProductVariant`
- `ProductMedia`
- `Category`
- `Coupon`
- `Order`
- `Customer`
- `SiteConfig`

Para pedidos via WhatsApp, o frontend deve chamar `POST /api/orders` ou implementar endpoint equivalente usando as mesmas regras de estoque/cupom.

Para upload de midia no admin, manter:

- `POST /api/media/sign`
- `POST /api/media/commit`

## 7. Teste final

Validar antes de entregar:

- Login admin.
- Email nao autorizado bloqueado.
- Criacao de produto.
- Edicao de produto.
- Upload de midia.
- Reordenacao/preview de midia.
- Criacao de categoria.
- Criacao de cupom.
- Registro de pedido.
- Baixa de estoque.
- Lista de clientes.
- Configuracoes da loja.
- Deploy Netlify sem secrets expostos.

## 8. Entrega

Enviar ao cliente:

- URL da loja.
- URL do painel admin.
- Email de acesso.
- Instrucao para trocar senha no Supabase Auth ou via fluxo combinado.
- Guia simples de uso do painel.

Explique que o painel gerencia produtos, pedidos, estoque, categorias, cupons e configuracoes, mas pagamento online nao faz parte desta versao.
