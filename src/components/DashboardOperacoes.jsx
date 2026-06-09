import React, { useState } from 'react';

// ────────────────────────────────────────────────────────────
// DADOS INICIAIS DE ESTOQUE
// ────────────────────────────────────────────────────────────
export const INITIAL_STOCK = [
  { id: 'SKU-001', name: 'Sofá Retrátil Velvet',          category: 'Mobiliário',  price: 1200.00, qty: 18, minQty: 5,  location: 'A-1-1', icon: '🛋️' },
  { id: 'SKU-002', name: 'Vaso Decorativo Moderno',        category: 'Decoração',   price:   89.90, qty: 42, minQty: 10, location: 'A-1-3', icon: '🏺' },
  { id: 'SKU-003', name: 'Smart TV 55" 4K',               category: 'Eletrônicos', price: 2499.00, qty:  7, minQty: 5,  location: 'B-2-1', icon: '📺' },
  { id: 'SKU-004', name: 'Lâmpada Inteligente RGB',        category: 'Eletrônicos', price:   79.90, qty:  3, minQty: 15, location: 'B-3-2', icon: '💡' },
  { id: 'SKU-005', name: 'Quadro Abstrato Sala',           category: 'Decoração',   price:  150.00, qty: 25, minQty: 5,  location: 'C-1-2', icon: '🖼️' },
  { id: 'SKU-006', name: 'Cafeteira Espresso Automática', category: 'Domésticos',  price:  499.00, qty: 11, minQty: 5,  location: 'C-4-1', icon: '☕' },
];

// ────────────────────────────────────────────────────────────
// STATUS CONFIG
// ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  erp_recebido:  { label: 'Recebido',  color: 'var(--brand-violet)', bg: 'var(--brand-violet-dim)', step: 1 },
  wms_separando: { label: 'Separando', color: 'var(--brand-amber)',  bg: 'var(--brand-amber-dim)',  step: 2 },
  wms_conferido: { label: 'Embalado',  color: 'var(--brand-cyan)',   bg: 'var(--brand-cyan-dim)',   step: 3 },
  tms_cotado:    { label: 'Cotado',    color: 'var(--brand-emerald)',bg: 'var(--brand-emerald-dim)',step: 4 },
  tms_enviado:   { label: 'Enviado',   color: 'var(--brand-emerald)',bg: 'var(--brand-emerald-dim)',step: 5 },
};

const MKT_ICONS = {
  'Shopee':        '🟠',
  'Mercado Livre': '🟡',
  'Amazon':        '🔵',
  'Site Próprio':  '🟢',
};

// ────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ────────────────────────────────────────────────────────────
function StatusPill({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.erp_recebido;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: 'var(--radius-full)',
      background: cfg.bg, color: cfg.color,
      fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

function StockBadge({ qty, minQty }) {
  const ratio = qty / minQty;
  if (qty === 0)    return <span style={{ color: 'var(--brand-rose)',    fontWeight: 700, fontSize: '0.8rem' }}>⛔ Esgotado</span>;
  if (ratio <= 1)   return <span style={{ color: 'var(--brand-rose)',    fontWeight: 700, fontSize: '0.8rem' }}>🔴 Crítico</span>;
  if (ratio <= 2)   return <span style={{ color: 'var(--brand-amber)',   fontWeight: 700, fontSize: '0.8rem' }}>🟡 Baixo</span>;
  return               <span style={{ color: 'var(--brand-emerald)', fontWeight: 700, fontSize: '0.8rem' }}>🟢 OK</span>;
}

// ────────────────────────────────────────────────────────────
// SALES FEED
// ────────────────────────────────────────────────────────────
function SalesFeed({ orders }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  const filters = [
    { key: 'all',          label: 'Todos' },
    { key: 'erp_recebido', label: 'Recebidos' },
    { key: 'wms_separando',label: 'Separando' },
    { key: 'wms_conferido',label: 'Embalados' },
    { key: 'tms_enviado',  label: 'Enviados' },
  ];

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>Feed de Vendas</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {orders.length} pedidos nesta sessão
          </div>
        </div>
        {/* Quick summary */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <span style={{
            padding: '4px 10px', borderRadius: 'var(--radius-full)',
            background: 'var(--brand-emerald-dim)', color: 'var(--brand-emerald)',
            fontSize: '0.72rem', fontWeight: 700,
          }}>
            {orders.filter(o => o.status === 'tms_enviado').length} enviados
          </span>
          <span style={{
            padding: '4px 10px', borderRadius: 'var(--radius-full)',
            background: 'var(--brand-cyan-dim)', color: 'var(--brand-cyan)',
            fontSize: '0.72rem', fontWeight: 700,
          }}>
            R$ {orders.reduce((s, o) => s + o.totalValue, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '5px 12px', borderRadius: 'var(--radius-full)',
              border: `1px solid ${filter === f.key ? 'var(--brand-cyan)' : 'var(--glass-border)'}`,
              background: filter === f.key ? 'var(--brand-cyan-dim)' : 'transparent',
              color: filter === f.key ? 'var(--brand-cyan)' : 'var(--text-muted)',
              fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all var(--transition-fast)',
            }}
          >
            {f.label}
            {f.key !== 'all' && (
              <span style={{ marginLeft: 5, opacity: 0.7 }}>
                {orders.filter(o => o.status === f.key).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {orders.length === 0 ? (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: '12px', padding: '60px 24px',
          border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-lg)',
          color: 'var(--text-muted)', textAlign: 'center',
        }}>
          <span style={{ fontSize: '2.5rem' }}>📭</span>
          <span style={{ fontSize: '0.85rem' }}>Nenhuma venda ainda.<br />Gere pedidos no simulador lateral.</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: 480 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Nenhum pedido com este status.
            </div>
          ) : (
            filtered.map((order, idx) => {
              const mktIcon = MKT_ICONS[order.marketplace] ?? '🛒';
              const isNew = idx === 0 && orders[0]?.id === order.id;

              return (
                <div
                  key={order.id}
                  className="glass-card"
                  style={{
                    padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    animation: isNew ? 'fadeSlideIn 0.4s both' : 'none',
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Marketplace icon */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--glass-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', flexShrink: 0,
                  }}>
                    {mktIcon}
                  </div>

                  {/* Order ID + items */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                        {order.id}
                      </span>
                      <StatusPill status={order.status} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {order.marketplace} · {order.items.map(i => `${i.qty}× ${i.name}`).join(', ')}
                    </div>
                  </div>

                  {/* Value & freight */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      R$ {order.totalValue.toFixed(2)}
                    </div>
                    {order.freightCost && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--brand-emerald)' }}>
                        +R$ {order.freightCost.toFixed(2)} frete
                      </div>
                    )}
                    {order.trackingCode && (
                      <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {order.trackingCode}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// STOCK PANEL
// ────────────────────────────────────────────────────────────
function StockPanel({ stock }) {
  const [sortBy, setSortBy] = useState('name'); // name | qty | status

  const sorted = [...stock].sort((a, b) => {
    if (sortBy === 'qty')    return a.qty - b.qty;
    if (sortBy === 'status') return (a.qty / a.minQty) - (b.qty / b.minQty);
    return a.name.localeCompare(b.name);
  });

  const totalSKUs  = stock.length;
  const lowItems   = stock.filter(s => s.qty > 0 && s.qty / s.minQty <= 2).length;
  const critItems  = stock.filter(s => s.qty === 0 || s.qty / s.minQty <= 1).length;
  const totalValue = stock.reduce((sum, s) => sum + s.price * s.qty, 0);

  return (
    <div style={{ width: 380, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>Controle de Estoque</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {totalSKUs} SKUs · Atualizado em tempo real
          </div>
        </div>
      </div>

      {/* Mini KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {[
          { label: 'SKUs', value: totalSKUs, color: 'var(--brand-cyan)' },
          { label: 'Alertas', value: lowItems, color: 'var(--brand-amber)' },
          { label: 'Críticos', value: critItems, color: 'var(--brand-rose)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            padding: '10px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-md)', textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color, lineHeight: 1.2, marginTop: '3px' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Sort */}
      <div style={{ display: 'flex', gap: '4px' }}>
        {[
          { key: 'name',   label: 'Nome' },
          { key: 'qty',    label: 'Qtd.' },
          { key: 'status', label: 'Status' },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => setSortBy(s.key)}
            style={{
              padding: '4px 10px', fontSize: '0.72rem', fontWeight: 600,
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${sortBy === s.key ? 'var(--brand-cyan)' : 'var(--glass-border)'}`,
              background: sortBy === s.key ? 'var(--brand-cyan-dim)' : 'transparent',
              color: sortBy === s.key ? 'var(--brand-cyan)' : 'var(--text-muted)',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              transition: 'all var(--transition-fast)',
            }}
          >
            {s.label}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
          Estoque: R$ {(totalValue / 1000).toFixed(1)}k
        </div>
      </div>

      {/* Stock items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: 440 }}>
        {sorted.map(item => {
          const ratio     = item.minQty > 0 ? item.qty / item.minQty : 1;
          const barWidth  = Math.min(100, (item.qty / 50) * 100);
          const barColor  = item.qty === 0 ? 'var(--brand-rose)' : ratio <= 1 ? 'var(--brand-rose)' : ratio <= 2 ? 'var(--brand-amber)' : 'var(--brand-emerald)';

          return (
            <div
              key={item.id}
              className="glass-card"
              style={{
                padding: '12px 14px',
                borderLeft: `3px solid ${barColor}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {item.id} · {item.location} · {item.category}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '8px' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: barColor, lineHeight: 1 }}>
                    {item.qty}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    min. {item.minQty}
                  </div>
                </div>
              </div>

              {/* Stock bar */}
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${barWidth}%`, background: barColor, transition: 'width 0.6s ease' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                <StockBadge qty={item.qty} minQty={item.minQty} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  R$ {item.price.toFixed(2)} / un.
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// MAIN EXPORT
// ────────────────────────────────────────────────────────────
export default function DashboardOperacoes({ orders, stock }) {
  return (
    <div className="animate-in" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <SalesFeed orders={orders} />
      <StockPanel stock={stock} />
    </div>
  );
}
