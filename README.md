# 2GL Business — Sistema de Gestão Logística

> **Protótipo de alta fidelidade** desenvolvido para a ShopMax como parte da proposta comercial da **2GL Business**.  
> Projeto acadêmico — Técnico em Logística · SENAI Ourinhos · Entrega 2

---

## 🚀 Como rodar localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- npm (já vem com o Node.js)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# 2. Entre na pasta do projeto
cd sistema2gl

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em: **http://localhost:5173**

---

## 📦 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento local |
| `npm run build` | Gera o build otimizado para produção (pasta `dist/`) |
| `npm run preview` | Visualiza o build de produção localmente |

---

## 🏗️ Estrutura do Projeto

```
sistema2gl/
├── public/               # Arquivos estáticos
├── src/
│   ├── components/
│   │   ├── DashboardERP.jsx       # Módulo ERP — pedidos e NF-e automática
│   │   ├── DashboardWMS.jsx       # Módulo WMS — picking e Modo Temporário
│   │   ├── DashboardTMS.jsx       # Módulo TMS — cotação de frete e rastreio
│   │   ├── DashboardOperacoes.jsx # Aba Operações — vendas + estoque ao vivo
│   │   ├── RoiPanel.jsx           # Painel de ROI em tempo real
│   │   └── SimuladorPedidos.jsx   # Simulador de vendas por marketplace
│   ├── App.jsx           # Aplicação principal com roteamento e estado global
│   ├── index.css         # Sistema de design (tokens, tema claro/escuro)
│   └── main.jsx          # Ponto de entrada React
├── index.html
├── vite.config.js
└── package.json
```

---

## ✨ Funcionalidades

### Módulos Principais
- **ERP** — Integração com Shopee, Mercado Livre, Amazon e Site Próprio; emissão automática de NF-e
- **WMS** — Rota otimizada de picking; validação por QR Code; pesagem integrada; **Modo Temporário** (onboarding em 15 min para Black Friday)
- **TMS** — Multi-cotação de frete entre 7+ transportadoras; rastreio white-label; **Escudo Black Friday**

### Painéis Dinâmicos
- **Painel de ROI ao Vivo** — economia de frete e erros de picking evitados em tempo real
- **Aba Operações** — feed de vendas com filtros por status + controle de estoque com alertas de nível crítico

### UX/UI
- Tema **Escuro Premium** (glassmorphism) e **Claro Corporativo** com alternância em tempo real
- Design responsivo com sidebar fixa, topbar sticky e animações suaves
- Tipografia: **Inter** + **JetBrains Mono**

---

## 🛠️ Tecnologias

- [React 19](https://react.dev/) — Interface de usuário
- [Vite 8](https://vitejs.dev/) — Bundler e servidor de desenvolvimento
- **CSS Vanilla** com variáveis customizadas — Sistema de design e temas

---

## 📄 Licença

Projeto acadêmico — todos os direitos reservados à equipe 2GL Business.
