# Plano de Implementação: Baggy Hype (E-commerce WhatsApp)

Este plano descreve a criação de um site de streetwear para a marca **Baggy Hype**, focado no público de Palmas (TO), com finalização de compra via WhatsApp e painel administrativo integrado.

## 📌 Visão Geral
- **Objetivo:** Criar um site leve, visualmente impactante (Streetwear/Oversized) e focado em conversão mobile.
- **Diferencial:** Destaque para Palmas (TO) e frete grátis na cidade.
- **Workflow:** `/site-build` orientado por referências visuais da Monteleste.

---

## 🏗️ Tipo de Projeto: WEB (Next.js)

### Success Criteria (Critérios de Sucesso)
- [ ] Carregamento da Home em menos de 1.5s no mobile.
- [ ] Checkout gerando mensagem correta para o WhatsApp com SKU e Tamanho.
- [ ] Painel Admin funcional para criar/editar produtos e ver pedidos.
- [ ] SEO configurado para buscas locais em Palmas.

---

## 🛠️ Stack Tecnológica
- **Framework:** Next.js 15 (App Router)
- **Estilização:** Tailwind CSS v4
- **Banco de Dados:** Prisma + Postgres (Supabase/Neon) ou SQLite local para MVP rapidíssimo.
- **Autenticação Admin:** NextAuth.js / Auth.js
- **Ícones:** Lucide React
- **Hospedagem:** Vercel

---

## 📁 Estrutura de Arquivos Proposta
```text
/
├── .agent/               # Configurações do agente
├── brand/               # Ativos da marca (já existentes)
├── references/          # Referências visuais (já existentes)
├── src/
│   ├── app/             # Rotas do Next.js (Client + Admin)
│   │   ├── (client)/    # Rotas públicas (Home, Produtos)
│   │   ├── admin/       # Rotas protegidas (Dashboard)
│   │   └── api/         # Endpoints de dados
│   ├── components/      # Componentes reutilizáveis
│   │   ├── ui/          # Shadcn/Base components
│   │   ├── store/       # Componentes do front-end
│   │   └── admin/       # Componentes do painel admin
│   ├── lib/             # Utilitários, Prisma, Configs
│   └── styles/          # CSS Global e Tokens da Marca
├── prisma/              # Schema do banco de dados
└── public/              # Imagens e assets estáticos
```

---

## 📝 Task Breakdown

### Fase 1: Fundação & Setup (P0)
- **Task 1.1: Inicialização do Projeto**
  - **Agente:** project-planner
  - **Ação:** `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias`
  - **VERIFY:** `npm run dev` inicia sem erros.
- **Task 1.2: Configuração de Banco de Dados & Prisma**
  - **Agente:** backend-specialist
  - **Ação:** Configurar schema Prisma com modelos `Product`, `Category`, `Order`, `User` (Admin).
  - **VERIFY:** `npx prisma db push` executado com sucesso.
- **Task 1.3: Design Tokens & Tailwind Config**
  - **Agente:** frontend-specialist
  - **Ação:** Mapear cores/fontes da pasta `/brand` no `tailwind.config`.
  - **VERIFY:** Aplicar cores primárias em um layout de teste.

### Fase 2: UI/UX Client (P1) - Mobile First
- **Task 2.1: Header & Footer Institucional (Palmas Focus)**
  - **Agente:** frontend-specialist
  - **Ação:** Criar header fixo com banner "Entrega Grátis Palmas-TO".
  - **VERIFY:** Mobile responsiveness (sticky behavior).
- **Task 2.2: Home Page (Inspirada na Monteleste)**
  - **Agente:** frontend-specialist
  - **Ação:** Grid de produtos, seções de destaque (Hero Banner).
  - **VERIFY:** Visual check contra references/home.png.
- **Task 2.3: Página de Produto & WhatsApp Checkout**
  - **Agente:** frontend-specialist
  - **Ação:** Galeria de imagens, seletor de tamanho, botão CTA "Finalizar no WhatsApp".
  - **VERIFY:** Clique no botão abre WhatsApp com o template de mensagem correto.

### Fase 3: Core & Admin (P2)
- **Task 3.1: Autenticação Admin**
  - **Agente:** backend-specialist
  - **Ação:** Proteger a rota `/admin`.
  - **VERIFY:** Tentativa de acesso redireciona para login.
- **Task 3.2: CRUD de Produtos (Painel Admin)**
  - **Agente:** frontend-specialist
  - **Ação:** Formulário para upload de fotos, preço, estoque e descrição.
  - **VERIFY:** Produto criado aparece na home imediatamente.
- **Task 3.3: Gerenciamento de Configurações Básicas**
  - **Agente:** backend-specialist
  - **Ação:** Tela para editar banner de aviso (ex: "Entregas suspensas no feriado").

### Fase 4: Otimização & SEO (P3)
- **Task 4.1: Performance Audit (Lighthouse)**
  - **Agente:** performance-optimizer
  - **Ação:** Otimização de imagens (Next/Image) e fontes urbanas leves.
  - **VERIFY:** Score > 90 em Mobile.
- **Task 4.2: SEO Local (Palmas-TO)**
  - **Agente:** seo-specialist
  - **Ação:** Configuração de JSON-LD e MetaTags focadas em Streetwear em Palmas.

---

## 🏁 Phase X: Verificação Final
- [ ] Executar `python .agent/scripts/verify_all.py .`
- [ ] Verificar ausência de cores roxas/púrpureas (Purple Ban).
- [ ] Testar fluxo completo de compra no Mobile.
- [ ] Validar acesso admin seguro.
