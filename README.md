# 🥩 Tropicana — Painel Administrativo

Painel de controle para acompanhamento de pedidos, atendimentos e relatórios da Churrascaria Tropicana.

## Acesso (dados de demonstração)

| Campo | Valor |
|-------|-------|
| Usuário | `admin` |
| Senha | `tropicana2024` |

> ⚠️ Altere a senha antes de colocar em produção.

## Tecnologias

- React 18
- Vite
- Recharts (gráficos)

## Como rodar localmente

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Gerar build de produção
npm run build
```

## Como publicar no GitHub Pages

```bash
# 1. Instalar o plugin de deploy
npm install --save-dev gh-pages

# 2. Adicionar ao package.json em "scripts":
#    "deploy": "gh-pages -d dist"

# 3. Gerar build e publicar
npm run build
npm run deploy
```

## Telas disponíveis

- **Dashboard** — Resumo do dia, faturamento, pedidos ativos
- **Pedidos** — Lista em tempo real com atualização de status
- **Conversas** — Histórico de atendimentos do bot
- **Clientes** — Base de clientes com histórico
- **Escalações** — Atendimentos transferidos para humano
- **Relatórios** — Gráficos de vendas e desempenho

## Próximos passos (integração real)

1. Configurar banco de dados (PostgreSQL / Supabase)
2. Adicionar nós de gravação no n8n
3. Substituir dados `MOCK_*` em `App.jsx` pela API real
