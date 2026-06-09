import React from 'react';

// ────────────────────────────────────────────────────────────
// ERP DASHBOARD
// ────────────────────────────────────────────────────────────

function EmptyState({ icon, message }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '60px 24px', textAlign: 'center', gap: '12px',
      border: '1px dashed var(--glass-border)', borderRadius: 'var(--radius-lg)',
      color: 'var(--text-muted)',
    }}>
      <span style={{ fontSize: '2.5rem' }}>{icon}</span>
      <span style={{ fontSize: '0.85rem', maxWidth: 240, lineHeight: 1.6 }}>{message}</span>
    </div>
  );
}

export default function DashboardERP({ activeOrder, updateOrderStatus, orders }) {
  const totalRevenue  = orders.reduce((a, o) => a + o.totalValue, 0);
  const totalInvoices = orders.filter(o => o.nfe).length;
  const dispatched    = orders.filter(o => o.status === 'tms_enviado').length;
  const pending       = orders.filter(o => o.status === 'erp_recebido').length;

  const handleGenerateInvoice = () => {
    if (!activeOrder || activeOrder.status !== 'erp_recebido') return;

    const nfeKey = `3526 0612 3456 7800 0190 5500 1000 ${Math.floor(100000 + Math.random() * 900000)} ${Math.floor(1e9 + Math.random() * 9e9)}`;
    updateOrderStatus(activeOrder.id, 'wms_separando', {
      nfe: nfeKey,
      logs: [
        ...activeOrder.logs,
        `[${new Date().toLocaleTimeString()}] NF-e emitida automaticamente via motor de regras fiscal.`,
        `[${new Date().toLocaleTimeString()}] Chave: ${nfeKey}`,
        `[${new Date().toLocaleTimeString()}] Ordem de separação criada no WMS.`,
      ],
    });
  };

  const isInvoiced = activeOrder && activeOrder.status !== 'erp_recebido';

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Faturamento',    value: `R$ ${(totalRevenue/1000).toFixed(1)}k`, color: 'var(--brand-emerald)', icon: '💰' },
          { label: 'Pedidos',        value: orders.length,                            color: 'var(--brand-cyan)',    icon: '📦' },
          { label: 'NF-e Emitidas',  value: totalInvoices,                            color: 'var(--brand-violet)', icon: '🧾' },
          { label: 'Na Fila ERP',    value: pending,                                  color: 'var(--brand-amber)',  icon: '⏳' },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className="metric-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div className="section-label">{label}</div>
              <span style={{ fontSize: '1rem' }}>{icon}</span>
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color, letterSpacing: '-0.02em' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Integration badges */}
      <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span className="section-label" style={{ marginBottom: 0 }}>Integrações API</span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['Shopee', 'Mercado Livre', 'Amazon', 'Site Próprio'].map(m => (
            <span key={m} style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              padding: '4px 10px', borderRadius: 'var(--radius-full)',
              background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.2)',
              fontSize: '0.72rem', fontWeight: 600, color: 'var(--brand-emerald)',
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--brand-emerald)', display: 'inline-block' }} />
              {m}
            </span>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '0.73rem', color: 'var(--text-muted)' }}>
          Sincronização em tempo real · {orders.length} pedidos importados
        </div>
      </div>

      {/* Selected order detail */}
      {!activeOrder ? (
        <EmptyState icon="📋" message="Selecione ou gere um pedido no simulador para ver o painel do ERP." />
      ) : (
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div className="section-label">Pedido Selecionado</div>
              <div style={{ fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                {activeOrder.id}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="tag tag-violet">{activeOrder.marketplace}</span>
              <span className="tag" style={{
                background: 'var(--brand-emerald-dim)', color: 'var(--brand-emerald)',
              }}>
                R$ {activeOrder.totalValue.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="divider" />

          {/* Items table */}
          <div>
            <div className="section-label" style={{ marginBottom: '10px' }}>Itens do Pedido</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {activeOrder.items.map((item, i) => (
                <div
                  key={i}
                  className="glass-card-inset"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: 6,
                      background: 'var(--bg-overlay)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)',
                    }}>
                      {item.qty}×
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {item.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.weight * item.qty} kg</span>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      R$ {(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action or status */}
          {!isInvoiced ? (
            <div style={{
              padding: '20px',
              background: 'var(--brand-violet-dim)',
              border: '1px dashed rgba(124,58,237,0.4)',
              borderRadius: 'var(--radius-md)',
              display: 'flex', flexDirection: 'column', gap: '12px',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--brand-violet)', marginBottom: '4px' }}>
                  Aguardando Faturamento
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  O motor fiscal da 2GL emite e vincula a NF-e automaticamente, sem digitação manual. O processo leva menos de 2 segundos.
                </p>
              </div>
              <button className="btn-primary" style={{ alignSelf: 'flex-start' }} onClick={handleGenerateInvoice}>
                🧾 Emitir NF-e Automaticamente
              </button>
            </div>
          ) : (
            <div style={{
              padding: '16px 20px',
              background: 'var(--brand-emerald-dim)',
              border: '1px solid rgba(0,229,160,0.25)',
              borderRadius: 'var(--radius-md)',
              display: 'flex', flexDirection: 'column', gap: '8px',
            }}>
              <div style={{ display: 'flex', align: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--brand-emerald)' }}>
                  ✓ NF-e Emitida e Vinculada
                </span>
                <span className="tag" style={{ background: 'rgba(0,229,160,0.1)', color: 'var(--brand-emerald)', marginLeft: 'auto' }}>DANFE OK</span>
              </div>
              <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>
                Chave: {activeOrder.nfe}
              </div>
            </div>
          )}

          {/* Logs */}
          <div>
            <div className="section-label" style={{ marginBottom: '8px' }}>Log de Processamento</div>
            <div className="glass-card-inset mono" style={{
              padding: '12px 14px', maxHeight: '110px', overflowY: 'auto',
              fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.8,
            }}>
              {activeOrder.logs.map((l, i) => (
                <div key={i} style={{ borderBottom: i < activeOrder.logs.length - 1 ? '1px solid var(--glass-border)' : 'none', paddingBottom: '2px', marginBottom: '2px' }}>
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
