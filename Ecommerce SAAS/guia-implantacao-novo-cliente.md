# Guia de Implantacao de Novo Cliente

Este guia e o passo a passo para vender e entregar uma loja baseada neste template. O modelo comercial e setup unico: voce configura a loja, entrega funcionando e o cliente usa o painel admin.

## 1. Checklist pre-venda

Antes de prometer prazo ou iniciar configuracao, colete:

- Nome da loja.
- Segmento e tipo de produto.
- Cidade e estado de atendimento.
- Dominio desejado.
- WhatsApp de atendimento com DDI e DDD.
- Instagram oficial.
- Logo, favicon e cores principais.
- Referencias visuais da marca.
- Lista inicial de categorias.
- Lista inicial de produtos.
- Fotos e videos dos produtos.
- Regras de entrega, retirada, troca e atendimento.
- Email que sera usado como admin da loja.

## 2. Criar contas do cliente

O cliente deve ser dono das contas. Voce pode criar junto com ele em uma chamada.

1. Criar conta no Supabase.
2. Criar um novo projeto Supabase.
3. Anotar o Project URL.
4. Anotar a anon key.
5. Anotar a service role key.
6. Copiar a connection string do banco.
7. Criar conta na Netlify.
8. Criar ou acessar o dominio.
9. Criar um repositorio GitHub para o cliente, se o deploy for conectado ao GitHub.

Nunca coloque secrets dentro do codigo. Secrets ficam no `.env` local e nas variaveis da Netlify.

## 3. Preparar o projeto do cliente

1. Copiar o template base para uma nova pasta.
2. Renomear o projeto no `package.json`.
3. Criar o arquivo `.env` local.
4. Preencher:

```env
DATABASE_URL="connection string do Supabase"
SUPABASE_URL="project url do Supabase"
SUPABASE_ANON_KEY="anon key"
SUPABASE_SERVICE_ROLE_KEY="service role key"
SUPABASE_MEDIA_BUCKET="product-media"
AUTH_SECRET="um segredo forte gerado para o projeto"
ADMIN_EMAIL="email admin inicial"
```

5. Rodar:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run db:seed
npm run build
```

Se o build falhar por variaveis ausentes, revise o `.env`.

## 4. Configurar Supabase

1. No Supabase, abrir Authentication > Users.
2. Criar o usuario admin com o email combinado.
3. Definir uma senha temporaria forte.
4. Abrir Table Editor > AdminUser.
5. Confirmar que o email admin esta cadastrado.
6. Abrir Storage.
7. Criar o bucket `product-media`, se ainda nao existir.
8. Confirmar que leitura publica esta funcionando para imagens.

Regra de acesso do admin: o usuario precisa existir no Supabase Auth e o mesmo email precisa estar na tabela `AdminUser`.

## 5. Personalizar a loja

Entrar em `/admin/login` com o email admin e configurar em Configuracoes:

- Nome da loja.
- Slug interno.
- Dominio.
- Instagram.
- Cidade e estado.
- Cor principal.
- Logo e favicon.
- WhatsApp.
- Texto do banner superior.
- Titulo e descricao da home.
- SEO padrao.
- Imagens principais da home.
- Politica de privacidade.
- Termos de compra.

Depois cadastrar:

- Categorias.
- Produtos.
- Variantes.
- Estoque.
- Imagens e videos.
- Cupons, se houver campanha inicial.

## 6. Deploy na Netlify

1. Criar novo site na Netlify.
2. Conectar ao repositorio do cliente ou enviar deploy manual.
3. Configurar build:

```txt
Build command: npm run build
Publish directory: .next
Node version: 20
```

4. Configurar variaveis de ambiente na Netlify:

```txt
DATABASE_URL
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_MEDIA_BUCKET
AUTH_SECRET
ADMIN_EMAIL
```

5. Rodar deploy.
6. Se a Netlify acusar segredo exposto, procurar o valor no codigo e remover. Nao desligue o scanner de secrets.
7. Conectar dominio.
8. Ativar HTTPS.

## 7. Teste final

Antes de entregar, validar:

- Home carrega com nome, imagens e textos do cliente.
- Catalogo abre.
- Busca funciona.
- Pagina de produto abre.
- Produto entra no carrinho.
- Pedido gera link correto de WhatsApp.
- Admin faz login.
- Email nao autorizado nao acessa o admin.
- Criacao e edicao de produto funcionam.
- Upload de midia funciona.
- Estoque diminui apos pedido.
- Cupom valido funciona.
- Cupom invalido falha.
- Paginas de contato, termos e privacidade estao coerentes.
- Site funciona bem no celular.
- Dominio final abre com HTTPS.

## 8. Entrega ao cliente

Enviar ao cliente:

- URL da loja.
- URL do admin.
- Email de login.
- Instrucao para trocar senha.
- Como cadastrar produto.
- Como editar estoque.
- Como ver pedidos.
- Como trocar banner e imagens da home.
- Como ajustar WhatsApp e Instagram.
- Limites do sistema: pedido fecha pelo WhatsApp, nao ha gateway de pagamento nesta versao.

## 9. Checklist rapido por cliente

Copie esta lista para cada projeto:

```md
# Cliente:

- [ ] Dados pre-venda coletados
- [ ] Supabase criado
- [ ] Netlify criado
- [ ] Dominio acessivel
- [ ] Projeto copiado
- [ ] .env local configurado
- [ ] Migrations aplicadas
- [ ] Seed rodado
- [ ] Admin criado no Supabase Auth
- [ ] Email liberado em AdminUser
- [ ] Bucket product-media criado
- [ ] Configuracoes da loja preenchidas
- [ ] Categorias cadastradas
- [ ] Produtos cadastrados
- [ ] Upload testado
- [ ] Pedido teste realizado
- [ ] WhatsApp validado
- [ ] Deploy Netlify publicado
- [ ] Dominio e HTTPS validados
- [ ] Cliente treinado
- [ ] Entrega concluida
```
