import React, { useState } from 'react';

const MARKETPLACES = [
  { name: 'Shopee',        icon: '🟠', color: 'var(--brand-amber)' },
  { name: 'Mercado Livre', icon: '🟡', color: '#f59e0b' },
  { name: 'Amazon',        icon: '🔵', color: 'var(--brand-cyan)' },
  { name: 'Site Próprio',  icon: '🟢', color: 'var(--brand-emerald)' },
];

const PRODUTOS = [
  { name: 'Sofá Retrátil Velvet',         price: 1200.00, weight: 45 },
  { name: 'Vaso Decorativo Moderno',       price:   89.90, weight:  2 },
  { name: 'Smart TV 55" 4K',              price: 2499.00, weight: 15 },
  { name: 'Lâmpada Inteligente RGB',       price:   79.90, weight:  0.2 },
  { name: 'Quadro Abstrato Sala',          price:  150.00, weight:  3 },
  { name: 'Cafeteira Espresso Automática', price:  499.00, weight:  5 },
];

const STATUS_MAP = {
  erp_recebido:  { label: 'ERP: Recebido',  color: 'var(--brand-violet)',  dot: 'var(--brand-violet)' },
  wms_separando: { label: 'WMS: Separando', color: 'var(--brand-amber)',   dot: 'var(--brand-amber)'  },
  wms_conferido: { label: 'WMS: Embalado',  color: 'var(--brand-cyan)',    dot: 'var(--brand-cyan)'   },
  tms_cotado:    { label: 'TMS: Cotado',    color: 'var(--brand-emerald)', dot: 'var(--brand-emerald)'},
  tms_enviado:   { label: 'Despachado',     color: 'var(--brand-emerald)', dot: 'var(--brand-emerald)'},
};

export default function SimuladorPedidos({ addOrder, orders, activeOrder, setActiveOrder }) {
  const [selectedMarketplace, setSelectedMarketplace] = useState(MARKETPLACES[0].name);

  const generateOrder = () => {
    const items = [];
    let totalValue = 0, totalWeight = 0;
    const picked = new Set();
    const count = Math.floor(Math.random() * 2) + 1;

    while (items.length < count) {
      const p = PRODUTOS[Math.floor(Math.random() * PRODUTOS.length)];
      if (picked.has(p.name)) continue;
      picked.add(p.name);
      const qty = Math.floor(Math.random() * 2) + 1;
      items.push({ ...p, qty });
      totalValue  += p.price  * qty;
      totalWeight += p.weight * qty;
    }

    const id = `SM-${Math.floor(10000 + Math.random() * 90000)}`;
    const order = {
      id, marketplace: selectedMarketplace,
      items, totalValue, totalWeight,
      status: 'erp_recebido',
      nfe: null, pickingRoute: null, pickingOperator: null,
      carrier: null, freightCost: null,
      originalFreight: Math.round(30 + Math.random() * 40),
      deliveryTime: null, trackingCode: null,
      logs: [`[${new Date().toLocaleTimeString()}] Pedido importado via API — ${selectedMarketplace}`],
    };

    addOrder(order);
    setActiveOrder(order);
  };

  const currentMkt = MARKETPLACES.find(m => m.name === selectedMarketplace);

  return (
    <div style={{
      width: 280, flexShrink: 0,
      display: 'flex', flexDirection: 'column', gap: '16px',
      maxHeight: 'calc(100vh - 220px)',
    }}>
      {/* New Order Card */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div className="section-label" style={{ marginBottom: '12px' }}>Simular Novo Pedido</div>

        {/* Marketplace selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
          {MARKETPLACES.map(m => (
            <button
              key={m.name}
              onClick={() => setSelectedMarketplace(m.name)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${selectedMarketplace === m.name ? `${m.color}50` : 'var(--glass-border)'}`,
                background: selectedMarketplace === m.name ? `${m.color}12` : 'transparent',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.82rem', fontWeight: selectedMarketplace === m.name ? 600 : 400,
                color: selectedMarketplace === m.name ? m.color : 'var(--text-secondary)',
                transition: 'all var(--transition-fast)',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '1rem' }}>{m.icon}</span>
              {m.name}
              {selectedMarketplace === m.name && (
                <span style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>✓</span>
              )}
            </button>
          ))}
        </div>

        <button className="btn-primary" style={{ width: '100%' }} onClick={generateOrder}>
          <span style={{ fontSize: '0.9rem' }}>⚡</span>
          Receber Pedido
        </button>
      </div>

      {/* Queue */}
      <div className="glass-card" style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div className="section-label">Fila de Pedidos</div>
          {orders.length > 0 && (
            <span style={{ fontSize: '0.7rem', fontWeight: 700, background: 'var(--brand-cyan-dim)', color: 'var(--brand-cyan)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
              {orders.length}
            </span>
          )}
        </div>

        {orders.length === 0 ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '24px 12px',
            border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-md)',
            color: 'var(--text-muted)', fontSize: '0.8rem', gap: '8px',
          }}>
            <span style={{ fontSize: '1.6rem' }}>📭</span>
            Nenhum pedido.<br/>Clique acima para simular.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', flex: 1, paddingRight: '2px' }}>
            {orders.map(order => {
              const s = STATUS_MAP[order.status] ?? STATUS_MAP.erp_recebido;
              const isActive = activeOrder?.id === order.id;
              return (
                <button
                  key={order.id}
                  onClick={() => setActiveOrder(order)}
                  style={{
                    display: 'flex', flexDirection: 'column', gap: '4px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: `1px solid ${isActive ? `${s.color}60` : 'var(--glass-border)'}`,
                    background: isActive ? `${s.color}0d` : 'transparent',
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
                      {order.id}
                    </span>
                    <span style={{
                      fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em',
                      textTransform: 'uppercase', color: s.color,
                      background: `${s.color}18`, padding: '2px 6px',
                      borderRadius: 'var(--radius-full)',
                    }}>
                      {order.status === 'tms_enviado' ? '✓' : '●'} {s.label.split(': ')[1] ?? s.label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.73rem', color: 'var(--text-muted)' }}>
                    <span>{order.marketplace}</span>
                    <span>R$ {order.totalValue.toFixed(2)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
