import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ─── MOCK DATA ────────────────────────────────────────────────
const MOCK_PEDIDOS = [
  { id: "#TRP182341", cliente: "Cristiano Silva", telefone: "45991234567", itens: [{ nome: "Marmita Tradicional", qtd: 2, total: 40 }], entrega: "Delivery", endereco: "Av. Brasil, 2222 - Centro", pagamento: "Pix", total: 40, status: "aguardando_pagamento", hora: "17:04" },
  { id: "#TRP182290", cliente: "Ana Souza", telefone: "45998765432", itens: [{ nome: "Executiva Picanha", qtd: 1, total: 38 }, { nome: "Arroz Grande", qtd: 1, total: 34.90 }], entrega: "Retirada", endereco: "", pagamento: "Cartão", total: 72.90, status: "em_preparo", hora: "16:51" },
  { id: "#TRP182201", cliente: "Roberto Lima", telefone: "45997654321", itens: [{ nome: "Combo Família Alcatra", qtd: 1, total: 101.90 }], entrega: "Delivery", endereco: "Rua Mato Grosso, 450 - Morumbi", pagamento: "Dinheiro", total: 101.90, status: "saiu_entrega", hora: "16:30" },
  { id: "#TRP182150", cliente: "Fernanda Costa", telefone: "45996543210", itens: [{ nome: "Marmita Tradicional", qtd: 3, total: 60 }], entrega: "Delivery", endereco: "Rua Rio Branco, 88 - Jardim Central", pagamento: "Pix", total: 60, status: "entregue", hora: "15:55" },
  { id: "#TRP182090", cliente: "Marcos Oliveira", telefone: "45995432109", itens: [{ nome: "Executiva Contra Filé", qtd: 2, total: 68 }], entrega: "Retirada", endereco: "", pagamento: "Pix", total: 68, status: "entregue", hora: "15:20" },
  { id: "#TRP182010", cliente: "Juliana Pereira", telefone: "45994321098", itens: [{ nome: "Promo 2 Tradicionais", qtd: 1, total: 38 }], entrega: "Delivery", endereco: "Av. Paraná, 1100 - Vila Portes", pagamento: "Cartão", total: 38, status: "cancelado", hora: "14:45" },
];

const MOCK_CONVERSAS = [
  { id: "c001", cliente: "Cristiano Silva", telefone: "45991234567", inicio: "17:02", fim: "17:05", status: "finalizado", mensagens: 12, intent: "marmita", msgs: [
    { de: "cliente", texto: "Boa tarde", hora: "17:02" },
    { de: "bot", texto: "Olá! Bem-vindo à Churrascaria Tropicana 😊🥩\n\nPosso te ajudar com:\n• Informações sobre o salão\n• Pedido de marmitas via WhatsApp\n• Cardápio digital\n\nComo posso ajudar?", hora: "17:02" },
    { de: "cliente", texto: "quero uma marmita", hora: "17:02" },
    { de: "bot", texto: "Temos as seguintes marmitas:\n• Marmita Tradicional — R$ 20,00\n• Promo 2 Tradicionais — R$ 38,00\n• Executiva Frango — R$ 17,00\n• Executiva Picanha — R$ 38,00\n\nQual você deseja?", hora: "17:02" },
    { de: "cliente", texto: "a de 20", hora: "17:03" },
    { de: "bot", texto: "Marmita Tradicional — R$ 20,00 ✅\nQuantas unidades?", hora: "17:03" },
    { de: "cliente", texto: "1", hora: "17:03" },
    { de: "bot", texto: "Retirada ou delivery?", hora: "17:03" },
    { de: "cliente", texto: "entrega", hora: "17:03" },
    { de: "bot", texto: "Me informa:\n• Rua + número\n• Bairro\n• Complemento (se tiver)", hora: "17:03" },
    { de: "cliente", texto: "avenida brasil, centro numero 2222", hora: "17:04" },
    { de: "bot", texto: "✅ Resumo do pedido\n🔖 Pedido: #TRP182341\n\n• Marmita Tradicional x1 — R$ 20,00\n\n🚚 Entrega\nEndereço: Av. Brasil, 2222 - Centro\n\n💳 Pix\nChave: tropicanafoz01@gmail.com\n\nTotal: R$ 20,00\n\nConfirma?", hora: "17:04" },
    { de: "cliente", texto: "sim", hora: "17:05" },
    { de: "bot", texto: "Pedido confirmado! ⏳ Aguardando confirmação do pagamento para entrar em preparo.", hora: "17:05" },
  ]},
  { id: "c002", cliente: "Ana Souza", telefone: "45998765432", inicio: "16:48", fim: "16:53", status: "finalizado", mensagens: 9, intent: "marmita", msgs: [] },
  { id: "c003", cliente: "Pedro Alves", telefone: "45993210987", inicio: "16:40", fim: null, status: "escalado", mensagens: 5, intent: "reclamacao", msgs: [] },
  { id: "c004", cliente: "Carla Mendes", telefone: "45992109876", inicio: "16:15", fim: "16:22", status: "finalizado", mensagens: 7, intent: "salao", msgs: [] },
  { id: "c005", cliente: "Diego Santos", telefone: "45991098765", inicio: "15:50", fim: "15:58", status: "finalizado", mensagens: 11, intent: "combo", msgs: [] },
];

const MOCK_CLIENTES = [
  { id: "cl001", nome: "Cristiano Silva", telefone: "45991234567", pedidos: 4, totalGasto: 182.50, ultimoPedido: "Hoje 17:05", favorito: "Marmita Tradicional" },
  { id: "cl002", nome: "Ana Souza", telefone: "45998765432", pedidos: 7, totalGasto: 431.20, ultimoPedido: "Hoje 16:53", favorito: "Executiva Picanha" },
  { id: "cl003", nome: "Roberto Lima", telefone: "45997654321", pedidos: 2, totalGasto: 203.80, ultimoPedido: "Hoje 16:30", favorito: "Combo Família Alcatra" },
  { id: "cl004", nome: "Fernanda Costa", telefone: "45996543210", pedidos: 9, totalGasto: 540.00, ultimoPedido: "Hoje 15:55", favorito: "Marmita Tradicional" },
  { id: "cl005", nome: "Marcos Oliveira", telefone: "45995432109", pedidos: 3, totalGasto: 204.00, ultimoPedido: "Hoje 15:20", favorito: "Executiva Contra Filé" },
  { id: "cl006", nome: "Juliana Pereira", telefone: "45994321098", pedidos: 1, totalGasto: 38.00, ultimoPedido: "Hoje 14:45", favorito: "Promo 2 Tradicionais" },
];

const MOCK_ESCALACOES = [
  { id: "e001", cliente: "Pedro Alves", telefone: "45993210987", motivo: "Reclamação sobre atraso na entrega", hora: "16:40", status: "pendente", msgs: [
    { de: "cliente", texto: "meu pedido tá atrasado já faz 1 hora", hora: "16:40" },
    { de: "bot", texto: "Entendo sua preocupação! Vou encaminhar para o atendimento humano agora. 😊", hora: "16:40" },
  ]},
  { id: "e002", cliente: "Lucas Ferreira", telefone: "45992098765", motivo: "Pergunta sobre taxa de entrega", hora: "15:10", status: "resolvido", msgs: [] },
  { id: "e003", cliente: "Bianca Rocha", telefone: "45991987654", motivo: "Parcelamento no cartão", hora: "14:22", status: "resolvido", msgs: [] },
];

const MOCK_GRAFICO_DIA = [
  { hora: "11h", pedidos: 2, faturamento: 58 },
  { hora: "12h", pedidos: 8, faturamento: 284 },
  { hora: "13h", pedidos: 12, faturamento: 456 },
  { hora: "14h", pedidos: 6, faturamento: 198 },
  { hora: "15h", pedidos: 4, faturamento: 142 },
  { hora: "16h", pedidos: 7, faturamento: 312 },
  { hora: "17h", pedidos: 3, faturamento: 98 },
];

const MOCK_GRAFICO_SEMANA = [
  { dia: "Seg", pedidos: 28, faturamento: 1240 },
  { dia: "Ter", pedidos: 35, faturamento: 1580 },
  { dia: "Qua", pedidos: 42, faturamento: 1920 },
  { dia: "Qui", pedidos: 38, faturamento: 1740 },
  { dia: "Sex", pedidos: 56, faturamento: 2480 },
  { dia: "Sáb", pedidos: 72, faturamento: 3240 },
  { dia: "Dom", pedidos: 64, faturamento: 2880 },
];

const MOCK_PIZZA = [
  { name: "Marmitas", value: 48, color: "#f97316" },
  { name: "Combos", value: 22, color: "#fb923c" },
  { name: "A la Carte", value: 18, color: "#fdba74" },
  { name: "Guarnições", value: 12, color: "#fed7aa" },
];

// ─── STATUS CONFIG ────────────────────────────────────────────
const STATUS_CONFIG = {
  aguardando_pagamento: { label: "Aguard. Pagamento", color: "#eab308", bg: "rgba(234,179,8,0.15)" },
  em_preparo: { label: "Em Preparo", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
  saiu_entrega: { label: "Saiu p/ Entrega", color: "#8b5cf6", bg: "rgba(139,92,246,0.15)" },
  entregue: { label: "Entregue", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
  cancelado: { label: "Cancelado", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
};

const NEXT_STATUS = {
  aguardando_pagamento: "em_preparo",
  em_preparo: "saiu_entrega",
  saiu_entrega: "entregue",
};

// ─── ICONS ────────────────────────────────────────────────────
const Icon = ({ name, size = 20 }) => {
  const icons = {
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    orders: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/><path d="M9 12h6M9 16h4"/></svg>,
    chat: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    clients: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
    escalation: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    reports: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    fire: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10 0-3.5-1.8-6.585-4.5-8.39C17.5 5.5 17 8 15 9c0-2.5-1.5-5-4-6.5C11 4 10.5 6.5 9 8 7.5 9.5 7 11.5 7 13c0 2.761 2.239 5 5 5z"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    refresh: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  };
  return icons[name] || null;
};

// ─── STYLES ──────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  :root {
    --bg: #0a0a0a;
    --bg2: #111111;
    --bg3: #1a1a1a;
    --border: #252525;
    --border2: #2e2e2e;
    --text: #f0ece4;
    --text2: #8a8680;
    --text3: #5a5652;
    --amber: #f97316;
    --amber2: #fb923c;
    --amber-dim: rgba(249,115,22,0.12);
    --amber-glow: rgba(249,115,22,0.06);
    --red: #ef4444;
    --green: #22c55e;
    --blue: #3b82f6;
  }

  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }
  
  .app { display: flex; height: 100vh; overflow: hidden; }
  
  /* SIDEBAR */
  .sidebar {
    width: 240px; min-width: 240px; background: var(--bg2);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    padding: 0;
  }
  .sidebar-logo {
    padding: 28px 24px 24px;
    border-bottom: 1px solid var(--border);
  }
  .logo-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: var(--text); letter-spacing: -0.3px; }
  .logo-sub { font-size: 11px; color: var(--text3); letter-spacing: 0.5px; text-transform: uppercase; margin-top: 2px; }
  .logo-dot { color: var(--amber); }
  
  .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
  
  .nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: 8px;
    cursor: pointer; transition: all 0.15s;
    font-size: 14px; font-weight: 500; color: var(--text2);
    position: relative;
  }
  .nav-item:hover { background: var(--bg3); color: var(--text); }
  .nav-item.active { background: var(--amber-dim); color: var(--amber); }
  .nav-item.active::before {
    content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    width: 3px; height: 20px; background: var(--amber); border-radius: 0 2px 2px 0;
  }
  .nav-badge {
    margin-left: auto; background: var(--red); color: white;
    font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 10px;
    min-width: 18px; text-align: center;
  }
  
  .sidebar-footer { padding: 16px 12px; border-top: 1px solid var(--border); }
  .user-info { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; }
  .user-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--amber-dim); border: 1px solid var(--amber);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: var(--amber);
  }
  .user-name { font-size: 13px; font-weight: 500; }
  .user-role { font-size: 11px; color: var(--text3); }
  .logout-btn {
    margin-left: auto; cursor: pointer; color: var(--text3);
    transition: color 0.15s; padding: 4px;
  }
  .logout-btn:hover { color: var(--red); }

  /* MAIN */
  .main { flex: 1; overflow-y: auto; background: var(--bg); }
  
  .page-header {
    padding: 28px 32px 20px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; background: var(--bg); z-index: 10;
  }
  .page-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
  .page-sub { font-size: 13px; color: var(--text3); margin-top: 2px; }
  
  .page-content { padding: 28px 32px; }

  /* CARDS */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  
  .stat-card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 12px; padding: 20px 22px;
    position: relative; overflow: hidden;
    transition: border-color 0.2s;
  }
  .stat-card:hover { border-color: var(--border2); }
  .stat-card.highlight { border-color: rgba(249,115,22,0.3); background: var(--amber-glow); }
  .stat-label { font-size: 12px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800; margin: 6px 0 4px; letter-spacing: -1px; }
  .stat-value.amber { color: var(--amber); }
  .stat-delta { font-size: 12px; color: var(--green); }
  .stat-icon { position: absolute; right: 18px; top: 18px; color: var(--text3); opacity: 0.4; }

  /* TABLES */
  .table-card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 12px; overflow: hidden;
  }
  .table-header {
    padding: 18px 22px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .table-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 600; }
  
  table { width: 100%; border-collapse: collapse; }
  th { 
    padding: 12px 22px; text-align: left; font-size: 11px; 
    color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px;
    font-weight: 600; border-bottom: 1px solid var(--border);
    background: var(--bg);
  }
  td { padding: 14px 22px; font-size: 13.5px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.02); }
  
  .status-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600;
  }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; }

  /* SEARCH */
  .search-bar {
    display: flex; align-items: center; gap: 10px;
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: 8px; padding: 8px 14px;
    font-size: 13px; color: var(--text2); width: 220px;
    transition: border-color 0.15s;
  }
  .search-bar:focus-within { border-color: var(--amber); color: var(--text); }
  .search-bar input { background: none; border: none; outline: none; color: var(--text); font-size: 13px; font-family: 'DM Sans', sans-serif; width: 100%; }
  .search-bar input::placeholder { color: var(--text3); }

  /* BUTTONS */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.15s; border: none; font-family: 'DM Sans', sans-serif;
  }
  .btn-primary { background: var(--amber); color: #0a0a0a; }
  .btn-primary:hover { background: var(--amber2); }
  .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--bg3); color: var(--text); }
  .btn-sm { padding: 5px 10px; font-size: 12px; }
  .btn-danger { background: rgba(239,68,68,0.15); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }

  /* GRID 2 COL */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }

  /* CHAT */
  .chat-bubble {
    max-width: 75%; padding: 10px 14px; border-radius: 12px;
    font-size: 13px; line-height: 1.5; white-space: pre-wrap;
    margin-bottom: 8px;
  }
  .chat-bubble.bot { background: var(--bg3); border: 1px solid var(--border); border-radius: 4px 12px 12px 12px; }
  .chat-bubble.cliente { background: var(--amber-dim); border: 1px solid rgba(249,115,22,0.2); border-radius: 12px 4px 12px 12px; margin-left: auto; }
  .chat-hora { font-size: 10px; color: var(--text3); margin-bottom: 2px; }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center; z-index: 100;
    backdrop-filter: blur(4px);
  }
  .modal {
    background: var(--bg2); border: 1px solid var(--border2);
    border-radius: 16px; width: 520px; max-height: 80vh;
    display: flex; flex-direction: column; overflow: hidden;
  }
  .modal-header {
    padding: 20px 24px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .modal-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; }
  .modal-body { padding: 20px 24px; overflow-y: auto; flex: 1; }
  .modal-close { cursor: pointer; color: var(--text3); transition: color 0.15s; padding: 4px; }
  .modal-close:hover { color: var(--text); }

  /* LOGIN */
  .login-screen {
    min-height: 100vh; background: var(--bg);
    display: flex; align-items: center; justify-content: center;
  }
  .login-card {
    width: 400px; background: var(--bg2);
    border: 1px solid var(--border); border-radius: 20px;
    padding: 48px 40px;
  }
  .login-logo { margin-bottom: 36px; text-align: center; }
  .login-logo-icon {
    width: 56px; height: 56px; border-radius: 16px;
    background: var(--amber-dim); border: 1px solid rgba(249,115,22,0.3);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
  }
  .login-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; text-align: center; }
  .login-sub { font-size: 13px; color: var(--text3); text-align: center; margin-top: 6px; }
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 12px; color: var(--text2); font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: block; }
  .form-input {
    width: 100%; background: var(--bg3); border: 1px solid var(--border);
    border-radius: 8px; padding: 11px 14px; font-size: 14px; color: var(--text);
    outline: none; font-family: 'DM Sans', sans-serif; transition: border-color 0.15s;
  }
  .form-input:focus { border-color: var(--amber); }
  .login-btn {
    width: 100%; background: var(--amber); color: #0a0a0a;
    border: none; border-radius: 8px; padding: 12px;
    font-size: 15px; font-weight: 700; cursor: pointer; margin-top: 8px;
    font-family: 'Syne', sans-serif; letter-spacing: 0.3px;
    transition: background 0.15s;
  }
  .login-btn:hover { background: var(--amber2); }
  .login-error { color: var(--red); font-size: 12px; text-align: center; margin-top: 10px; }

  /* MISC */
  .section-gap { margin-bottom: 24px; }
  .text-amber { color: var(--amber); }
  .text-muted { color: var(--text3); font-size: 12px; }
  .flex { display: flex; align-items: center; }
  .flex-between { display: flex; align-items: center; justify-content: space-between; }
  .gap-8 { gap: 8px; }
  .gap-12 { gap: 12px; }
  .fw-600 { font-weight: 600; }
  .divider { height: 1px; background: var(--border); margin: 16px 0; }
  .empty-state { text-align: center; padding: 48px; color: var(--text3); }
  .empty-state svg { margin: 0 auto 12px; display: block; opacity: 0.3; }
  .pill { display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .pill-green { background: rgba(34,197,94,0.12); color: var(--green); }
  .pill-amber { background: var(--amber-dim); color: var(--amber); }
  .pill-red { background: rgba(239,68,68,0.12); color: var(--red); }
  .live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
  
  .action-btn {
    padding: 5px 12px; border-radius: 6px; font-size: 12px; font-weight: 600;
    cursor: pointer; border: none; font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .action-btn-blue { background: rgba(59,130,246,0.15); color: #60a5fa; }
  .action-btn-blue:hover { background: rgba(59,130,246,0.25); }
  .action-btn-amber { background: var(--amber-dim); color: var(--amber); }
  .action-btn-amber:hover { background: rgba(249,115,22,0.2); }
  
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }
`;

// ─── COMPONENTS ──────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: "#8a8680", bg: "rgba(138,134,128,0.15)" };
  return (
    <span className="status-badge" style={{ color: cfg.color, background: cfg.bg }}>
      <span className="status-dot" style={{ background: cfg.color }} />
      {cfg.label}
    </span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <span className="modal-close" onClick={onClose}><Icon name="close" size={18} /></span>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

// ─── PAGES ───────────────────────────────────────────────────

function Dashboard() {
  const total = MOCK_PEDIDOS.filter(p => p.status !== "cancelado").reduce((a, p) => a + p.total, 0);
  const pendentes = MOCK_PEDIDOS.filter(p => ["aguardando_pagamento", "em_preparo", "saiu_entrega"].includes(p.status)).length;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card highlight">
          <div className="stat-label">Faturamento Hoje</div>
          <div className="stat-value amber">R$ {total.toFixed(2).replace(".", ",")}</div>
          <div className="stat-delta">↑ 12% vs ontem</div>
          <div className="stat-icon"><Icon name="reports" size={28} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pedidos Hoje</div>
          <div className="stat-value">{MOCK_PEDIDOS.length}</div>
          <div className="stat-delta" style={{ color: "var(--text3)" }}>{pendentes} em andamento</div>
          <div className="stat-icon"><Icon name="orders" size={28} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Atendimentos</div>
          <div className="stat-value">{MOCK_CONVERSAS.length}</div>
          <div className="stat-delta" style={{ color: "var(--text3)" }}>{MOCK_CONVERSAS.filter(c => c.status === "finalizado").length} finalizados</div>
          <div className="stat-icon"><Icon name="chat" size={28} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Escalações</div>
          <div className="stat-value" style={{ color: MOCK_ESCALACOES.filter(e => e.status === "pendente").length > 0 ? "var(--red)" : "var(--text)" }}>
            {MOCK_ESCALACOES.filter(e => e.status === "pendente").length}
          </div>
          <div className="stat-delta" style={{ color: "var(--text3)" }}>pendentes agora</div>
          <div className="stat-icon"><Icon name="escalation" size={28} /></div>
        </div>
      </div>

      <div className="grid-2 section-gap">
        <div className="table-card">
          <div className="table-header">
            <span className="table-title">Pedidos do Dia</span>
            <div className="flex gap-8"><div className="live-dot" /><span style={{ fontSize: 12, color: "var(--green)" }}>Ao vivo</span></div>
          </div>
          <table>
            <thead><tr><th>Código</th><th>Cliente</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {MOCK_PEDIDOS.slice(0, 5).map(p => (
                <tr key={p.id}>
                  <td><span className="text-amber" style={{ fontFamily: "monospace", fontSize: 12 }}>{p.id}</span></td>
                  <td><span className="fw-600">{p.cliente}</span></td>
                  <td>R$ {p.total.toFixed(2).replace(".", ",")}</td>
                  <td><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-card">
          <div className="table-header">
            <span className="table-title">Vendas por Hora</span>
            <span className="text-muted">Hoje</span>
          </div>
          <div style={{ padding: "20px 16px" }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MOCK_GRAFICO_DIA} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252525" vertical={false} />
                <XAxis dataKey="hora" tick={{ fill: "#5a5652", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#5a5652", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="pedidos" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="table-card">
          <div className="table-header"><span className="table-title">Últimas Escalações</span></div>
          {MOCK_ESCALACOES.filter(e => e.status === "pendente").length === 0 ? (
            <div className="empty-state"><Icon name="check" size={32} /><div style={{ marginTop: 8 }}>Nenhuma escalação pendente</div></div>
          ) : (
            MOCK_ESCALACOES.filter(e => e.status === "pendente").map(e => (
              <div key={e.id} style={{ padding: "14px 22px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="fw-600" style={{ fontSize: 14 }}>{e.cliente}</div>
                  <div className="text-muted">{e.motivo}</div>
                </div>
                <span className="pill pill-red">{e.hora}</span>
              </div>
            ))
          )}
        </div>

        <div className="table-card">
          <div className="table-header"><span className="table-title">Categorias Mais Pedidas</span></div>
          <div style={{ padding: "20px", display: "flex", alignItems: "center", gap: 24 }}>
            <PieChart width={160} height={160}>
              <Pie data={MOCK_PIZZA} cx={75} cy={75} innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                {MOCK_PIZZA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
            </PieChart>
            <div style={{ flex: 1 }}>
              {MOCK_PIZZA.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, flex: 1 }}>{item.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text2)" }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pedidos() {
  const [pedidos, setPedidos] = useState(MOCK_PEDIDOS);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [selected, setSelected] = useState(null);

  const filtrados = pedidos.filter(p => {
    const matchSearch = p.cliente.toLowerCase().includes(search.toLowerCase()) || p.id.includes(search);
    const matchFiltro = filtro === "todos" || p.status === filtro;
    return matchSearch && matchFiltro;
  });

  const avancarStatus = (id) => {
    setPedidos(prev => prev.map(p => {
      if (p.id !== id) return p;
      const next = NEXT_STATUS[p.status];
      return next ? { ...p, status: next } : p;
    }));
  };

  return (
    <div>
      <div className="flex-between section-gap">
        <div className="flex gap-8" style={{ flexWrap: "wrap" }}>
          {["todos", "aguardando_pagamento", "em_preparo", "saiu_entrega", "entregue"].map(f => (
            <button key={f} className={`btn btn-sm ${filtro === f ? "btn-primary" : "btn-ghost"}`} onClick={() => setFiltro(f)}>
              {f === "todos" ? "Todos" : STATUS_CONFIG[f]?.label}
            </button>
          ))}
        </div>
        <div className="search-bar">
          <Icon name="search" size={14} />
          <input placeholder="Buscar pedido..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <span className="table-title">Pedidos ({filtrados.length})</span>
          <div className="flex gap-8"><div className="live-dot" /><span style={{ fontSize: 12, color: "var(--green)" }}>Ao vivo</span></div>
        </div>
        <table>
          <thead><tr><th>Código</th><th>Hora</th><th>Cliente</th><th>Itens</th><th>Entrega</th><th>Pagamento</th><th>Total</th><th>Status</th><th>Ação</th></tr></thead>
          <tbody>
            {filtrados.map(p => (
              <tr key={p.id}>
                <td><span className="text-amber" style={{ fontFamily: "monospace", fontSize: 12, cursor: "pointer" }} onClick={() => setSelected(p)}>{p.id}</span></td>
                <td className="text-muted">{p.hora}</td>
                <td>
                  <div className="fw-600" style={{ fontSize: 14 }}>{p.cliente}</div>
                  <div className="text-muted">{p.telefone}</div>
                </td>
                <td><span className="text-muted">{p.itens.map(i => `${i.nome} x${i.qtd}`).join(", ")}</span></td>
                <td><span className={`pill ${p.entrega === "Delivery" ? "pill-amber" : "pill-green"}`}>{p.entrega}</span></td>
                <td style={{ fontSize: 13 }}>{p.pagamento}</td>
                <td><span className="fw-600">R$ {p.total.toFixed(2).replace(".", ",")}</span></td>
                <td><StatusBadge status={p.status} /></td>
                <td>
                  {NEXT_STATUS[p.status] ? (
                    <button className="action-btn action-btn-blue" onClick={() => avancarStatus(p.id)}>
                      → {STATUS_CONFIG[NEXT_STATUS[p.status]]?.label}
                    </button>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <Modal title={`Pedido ${selected.id}`} onClose={() => setSelected(null)}>
          <div style={{ marginBottom: 16 }}>
            <div className="fw-600" style={{ marginBottom: 4 }}>{selected.cliente}</div>
            <div className="flex gap-8"><Icon name="phone" size={13} /><span className="text-muted">{selected.telefone}</span></div>
          </div>
          <div className="divider" />
          <div style={{ marginBottom: 12 }}>
            <div className="text-muted" style={{ marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px", fontSize: 11 }}>Itens</div>
            {selected.itens.map((i, idx) => (
              <div key={idx} className="flex-between" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 14 }}>{i.nome} x{i.qtd}</span>
                <span className="fw-600">R$ {i.total.toFixed(2).replace(".", ",")}</span>
              </div>
            ))}
          </div>
          <div className="divider" />
          <div style={{ fontSize: 13 }}>
            <div className="flex-between" style={{ marginBottom: 8 }}><span className="text-muted">Tipo</span><span className={`pill ${selected.entrega === "Delivery" ? "pill-amber" : "pill-green"}`}>{selected.entrega}</span></div>
            {selected.endereco && <div className="flex-between" style={{ marginBottom: 8 }}><span className="text-muted">Endereço</span><span>{selected.endereco}</span></div>}
            <div className="flex-between" style={{ marginBottom: 8 }}><span className="text-muted">Pagamento</span><span>{selected.pagamento}</span></div>
            <div className="flex-between"><span className="text-muted">Status</span><StatusBadge status={selected.status} /></div>
          </div>
          <div className="divider" />
          <div className="flex-between">
            <span style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16 }}>Total</span>
            <span className="text-amber" style={{ fontFamily: "Syne", fontWeight: 800, fontSize: 20 }}>R$ {selected.total.toFixed(2).replace(".", ",")}</span>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Conversas() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtradas = MOCK_CONVERSAS.filter(c =>
    c.cliente.toLowerCase().includes(search.toLowerCase()) || c.telefone.includes(search)
  );

  return (
    <div>
      <div className="flex-between section-gap">
        <div className="search-bar">
          <Icon name="search" size={14} />
          <input placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="table-card">
        <div className="table-header"><span className="table-title">Histórico de Conversas</span></div>
        <table>
          <thead><tr><th>Cliente</th><th>Telefone</th><th>Início</th><th>Duração</th><th>Mensagens</th><th>Intenção</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {filtradas.map(c => (
              <tr key={c.id}>
                <td><span className="fw-600">{c.cliente}</span></td>
                <td className="text-muted">{c.telefone}</td>
                <td className="text-muted">{c.inicio}</td>
                <td className="text-muted">{c.fim ? `${parseInt(c.fim) - parseInt(c.inicio)} min` : "—"}</td>
                <td>{c.mensagens}</td>
                <td><span className="pill pill-amber">{c.intent}</span></td>
                <td>
                  <span className={`pill ${c.status === "finalizado" ? "pill-green" : "pill-red"}`}>
                    {c.status === "finalizado" ? "Finalizado" : "Escalado"}
                  </span>
                </td>
                <td>{c.msgs.length > 0 && <button className="action-btn action-btn-amber" onClick={() => setSelected(c)}>Ver Chat</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <Modal title={`Chat — ${selected.cliente}`} onClose={() => setSelected(null)}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {selected.msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.de === "cliente" ? "flex-end" : "flex-start" }}>
                <div className="chat-hora">{m.hora} · {m.de === "bot" ? "🤖 Bot" : "👤 Cliente"}</div>
                <div className={`chat-bubble ${m.de}`}>{m.texto}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

function Clientes() {
  const [search, setSearch] = useState("");

  const filtrados = MOCK_CLIENTES.filter(c =>
    c.nome.toLowerCase().includes(search.toLowerCase()) || c.telefone.includes(search)
  );

  return (
    <div>
      <div className="flex-between section-gap">
        <div className="search-bar">
          <Icon name="search" size={14} />
          <input placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="table-card">
        <div className="table-header"><span className="table-title">Clientes ({filtrados.length})</span></div>
        <table>
          <thead><tr><th>Cliente</th><th>Telefone</th><th>Pedidos</th><th>Total Gasto</th><th>Favorito</th><th>Último Pedido</th></tr></thead>
          <tbody>
            {filtrados.map(c => (
              <tr key={c.id}>
                <td>
                  <div className="flex gap-8">
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--amber-dim)", border: "1px solid rgba(249,115,22,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "var(--amber)", flexShrink: 0 }}>
                      {c.nome.split(" ").map(n => n[0]).slice(0, 2).join("")}
                    </div>
                    <span className="fw-600">{c.nome}</span>
                  </div>
                </td>
                <td className="text-muted">{c.telefone}</td>
                <td><span className="fw-600">{c.pedidos}</span></td>
                <td><span className="fw-600 text-amber">R$ {c.totalGasto.toFixed(2).replace(".", ",")}</span></td>
                <td><span className="text-muted" style={{ fontSize: 12 }}>{c.favorito}</span></td>
                <td className="text-muted">{c.ultimoPedido}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Escalacoes() {
  const [escalacoes, setEscalacoes] = useState(MOCK_ESCALACOES);
  const [selected, setSelected] = useState(null);

  const resolver = (id) => setEscalacoes(prev => prev.map(e => e.id === id ? { ...e, status: "resolvido" } : e));

  return (
    <div>
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", maxWidth: 400, marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Pendentes</div>
          <div className="stat-value" style={{ color: "var(--red)" }}>{escalacoes.filter(e => e.status === "pendente").length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Resolvidas Hoje</div>
          <div className="stat-value" style={{ color: "var(--green)" }}>{escalacoes.filter(e => e.status === "resolvido").length}</div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header"><span className="table-title">Escalações</span></div>
        <table>
          <thead><tr><th>Cliente</th><th>Telefone</th><th>Motivo</th><th>Hora</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {escalacoes.map(e => (
              <tr key={e.id}>
                <td><span className="fw-600">{e.cliente}</span></td>
                <td className="text-muted">{e.telefone}</td>
                <td style={{ fontSize: 13, maxWidth: 220 }}>{e.motivo}</td>
                <td className="text-muted">{e.hora}</td>
                <td>
                  <span className={`pill ${e.status === "pendente" ? "pill-red" : "pill-green"}`}>
                    {e.status === "pendente" ? "⚠ Pendente" : "✓ Resolvido"}
                  </span>
                </td>
                <td>
                  <div className="flex gap-8">
                    {e.msgs.length > 0 && <button className="action-btn action-btn-amber" onClick={() => setSelected(e)}>Ver Chat</button>}
                    {e.status === "pendente" && <button className="action-btn action-btn-blue" onClick={() => resolver(e.id)}>Resolver</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <Modal title={`Escalação — ${selected.cliente}`} onClose={() => setSelected(null)}>
          <div style={{ marginBottom: 12 }}>
            <span className="pill pill-red">⚠ {selected.motivo}</span>
          </div>
          <div className="divider" />
          {selected.msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.de === "cliente" ? "flex-end" : "flex-start" }}>
              <div className="chat-hora">{m.hora} · {m.de === "bot" ? "🤖 Bot" : "👤 Cliente"}</div>
              <div className={`chat-bubble ${m.de}`}>{m.texto}</div>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
}

function Relatorios() {
  const [periodo, setPeriodo] = useState("semana");

  const data = periodo === "dia" ? MOCK_GRAFICO_DIA : MOCK_GRAFICO_SEMANA;
  const xKey = periodo === "dia" ? "hora" : "dia";
  const totalFat = data.reduce((a, d) => a + d.faturamento, 0);
  const totalPed = data.reduce((a, d) => a + d.pedidos, 0);

  return (
    <div>
      <div className="flex gap-8 section-gap">
        {["dia", "semana"].map(p => (
          <button key={p} className={`btn btn-sm ${periodo === p ? "btn-primary" : "btn-ghost"}`} onClick={() => setPeriodo(p)}>
            {p === "dia" ? "Hoje" : "Esta Semana"}
          </button>
        ))}
      </div>

      <div className="stats-grid section-gap">
        <div className="stat-card highlight">
          <div className="stat-label">Faturamento</div>
          <div className="stat-value amber">R$ {totalFat.toLocaleString("pt-BR")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pedidos</div>
          <div className="stat-value">{totalPed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Ticket Médio</div>
          <div className="stat-value">R$ {(totalFat / totalPed).toFixed(2).replace(".", ",")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Clientes Ativos</div>
          <div className="stat-value">{MOCK_CLIENTES.length}</div>
        </div>
      </div>

      <div className="grid-2 section-gap">
        <div className="table-card">
          <div className="table-header"><span className="table-title">Pedidos por {periodo === "dia" ? "Hora" : "Dia"}</span></div>
          <div style={{ padding: "20px 16px" }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252525" vertical={false} />
                <XAxis dataKey={xKey} tick={{ fill: "#5a5652", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#5a5652", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="pedidos" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="table-card">
          <div className="table-header"><span className="table-title">Faturamento por {periodo === "dia" ? "Hora" : "Dia"}</span></div>
          <div style={{ padding: "20px 16px" }}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252525" vertical={false} />
                <XAxis dataKey={xKey} tick={{ fill: "#5a5652", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#5a5652", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 8, fontSize: 12 }} formatter={v => [`R$ ${v}`, "Faturamento"]} />
                <Line type="monotone" dataKey="faturamento" stroke="#f97316" strokeWidth={2.5} dot={{ fill: "#f97316", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="table-card">
          <div className="table-header"><span className="table-title">Categorias Mais Vendidas</span></div>
          <div style={{ padding: "16px 22px" }}>
            {MOCK_PIZZA.map((item, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div className="flex-between" style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 13 }}>{item.name}</span>
                  <span className="fw-600" style={{ fontSize: 13 }}>{item.value}%</span>
                </div>
                <div style={{ height: 6, background: "var(--bg3)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.value}%`, background: item.color, borderRadius: 3, transition: "width 0.8s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="table-card">
          <div className="table-header"><span className="table-title">Top Clientes</span></div>
          <table>
            <thead><tr><th>#</th><th>Cliente</th><th>Pedidos</th><th>Total</th></tr></thead>
            <tbody>
              {MOCK_CLIENTES.sort((a, b) => b.totalGasto - a.totalGasto).slice(0, 5).map((c, i) => (
                <tr key={c.id}>
                  <td><span style={{ color: i === 0 ? "#f97316" : i === 1 ? "#9ca3af" : i === 2 ? "#b45309" : "var(--text3)", fontWeight: 700 }}>#{i + 1}</span></td>
                  <td className="fw-600">{c.nome}</td>
                  <td>{c.pedidos}</td>
                  <td className="text-amber fw-600">R$ {c.totalGasto.toFixed(2).replace(".", ",")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────
export default function App() {
  const [logado, setLogado] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [pagina, setPagina] = useState("dashboard");

  const login = () => {
    if (usuario === "admin" && senha === "tropicana2024") {
      setLogado(true); setErro("");
    } else {
      setErro("Usuário ou senha incorretos.");
    }
  };

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "pedidos", label: "Pedidos", icon: "orders", badge: MOCK_PEDIDOS.filter(p => ["aguardando_pagamento", "em_preparo"].includes(p.status)).length },
    { id: "conversas", label: "Conversas", icon: "chat" },
    { id: "clientes", label: "Clientes", icon: "clients" },
    { id: "escalacoes", label: "Escalações", icon: "escalation", badge: MOCK_ESCALACOES.filter(e => e.status === "pendente").length },
    { id: "relatorios", label: "Relatórios", icon: "reports" },
  ];

  const pageTitle = { dashboard: "Dashboard", pedidos: "Pedidos", conversas: "Conversas", clientes: "Clientes", escalacoes: "Escalações", relatorios: "Relatórios" };
  const pageSub = { dashboard: "Visão geral do dia", pedidos: "Gerencie e atualize o status dos pedidos", conversas: "Histórico de atendimentos do bot", clientes: "Base de clientes ativos", escalacoes: "Atendimentos transferidos para humano", relatorios: "Métricas e gráficos de desempenho" };

  if (!logado) return (
    <>
      <style>{styles}</style>
      <div className="login-screen">
        <div className="login-card">
          <div className="login-logo">
            <div className="login-logo-icon"><Icon name="fire" size={28} style={{ color: "var(--amber)" }} /></div>
            <div className="login-title">Tropicana<span className="logo-dot">.</span></div>
            <div className="login-sub">Painel Administrativo</div>
          </div>
          <div className="form-group">
            <label className="form-label">Usuário</label>
            <input className="form-input" value={usuario} onChange={e => setUsuario(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} placeholder="admin" />
          </div>
          <div className="form-group">
            <label className="form-label">Senha</label>
            <input className="form-input" type="password" value={senha} onChange={e => setSenha(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} placeholder="••••••••" />
          </div>
          {erro && <div className="login-error">{erro}</div>}
          <button className="login-btn" onClick={login}>Entrar</button>
          <div style={{ marginTop: 20, textAlign: "center", fontSize: 12, color: "var(--text3)" }}>
            usuário: <b style={{ color: "var(--text2)" }}>admin</b> · senha: <b style={{ color: "var(--text2)" }}>tropicana2024</b>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-title">Tropicana<span className="logo-dot">.</span></div>
            <div className="logo-sub">Painel Admin</div>
          </div>
          <nav className="sidebar-nav">
            {nav.map(item => (
              <div key={item.id} className={`nav-item ${pagina === item.id ? "active" : ""}`} onClick={() => setPagina(item.id)}>
                <Icon name={item.icon} size={17} />
                {item.label}
                {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">AD</div>
              <div>
                <div className="user-name">Admin</div>
                <div className="user-role">Proprietário</div>
              </div>
              <div className="logout-btn" onClick={() => setLogado(false)} title="Sair"><Icon name="logout" size={16} /></div>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="page-header">
            <div>
              <div className="page-title">{pageTitle[pagina]}</div>
              <div className="page-sub">{pageSub[pagina]}</div>
            </div>
            <div className="flex gap-8">
              <div className="live-dot" />
              <span style={{ fontSize: 12, color: "var(--green)" }}>Sistema ativo</span>
            </div>
          </div>
          <div className="page-content">
            {pagina === "dashboard" && <Dashboard />}
            {pagina === "pedidos" && <Pedidos />}
            {pagina === "conversas" && <Conversas />}
            {pagina === "clientes" && <Clientes />}
            {pagina === "escalacoes" && <Escalacoes />}
            {pagina === "relatorios" && <Relatorios />}
          </div>
        </main>
      </div>
    </>
  );
}
