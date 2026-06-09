import React, { useState, useEffect, useRef } from 'react';

const CARRIERS = [
  { name: 'Loggi Express',   logo: '🛵', basePrice: 18.50, days: 1 },
  { name: 'J&T Express',     logo: '🚛', basePrice: 20.90, days: 2 },
  { name: 'Jadlog Premium',  logo: '📦', basePrice: 22.80, days: 2 },
  { name: 'Correios SEDEX',  logo: '📯', basePrice: 35.50, days: 3 },
  { name: 'Correios PAC',    logo: '📮', basePrice: 22.00, days: 6 },
  { name: 'DHL Express',     logo: '✈️', basePrice: 48.00, days: 1 },
  { name: 'Total Express',   logo: '🚀', basePrice: 24.10, days: 2 },
];

function EmptyState({ icon, message }) {
  return (
    <div style={{
      border:'1px dashed var(--glass-border)', borderRadius:'var(--radius-lg)',
      padding:'60px 24px', textAlign:'center', color:'var(--text-muted)',
      display:'flex', flexDirection:'column', gap:'12px', alignItems:'center',
    }}>
      <span style={{ fontSize:'2.5rem' }}>{icon}</span>
      <span style={{ fontSize:'0.85rem', maxWidth:280, lineHeight:1.6 }}>{message}</span>
    </div>
  );
}

export default function DashboardTMS({ activeOrder, updateOrderStatus, blackFridayShield, setBlackFridayShield, incrementRoiMetric }) {
  const [quotes, setQuotes]       = useState([]);
  const [selected, setSelected]   = useState(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const prevOrderId = useRef(null);

  // Gerar cotações ao entrar no status certo
  useEffect(() => {
    if (!activeOrder || activeOrder.status !== 'wms_conferido') return;
    if (prevOrderId.current === activeOrder.id) return;
    prevOrderId.current = activeOrder.id;

    const w = activeOrder.totalWeight ?? 1;
    const generated = CARRIERS.map(c => ({
      ...c,
      price: Math.round((c.basePrice + w * 1.2 + Math.random() * 4) * 100) / 100,
    })).sort((a, b) => a.price - b.price);

    setQuotes(generated);
    setSelected(generated[0]);
  }, [activeOrder]);

  const handleDispatch = async () => {
    if (!activeOrder || !selected) return;
    setIsDispatching(true);
    await new Promise(r => setTimeout(r, 800)); // simula latência

    const saving = Math.max(0, activeOrder.originalFreight - selected.price);
    incrementRoiMetric('freightSavings', saving);

    const code = `2GL${selected.name.slice(0,3).toUpperCase()}${Math.floor(1e7 + Math.random() * 9e7)}`;

    updateOrderStatus(activeOrder.id, 'tms_enviado', {
      carrier: selected.name,
      freightCost: selected.price,
      trackingCode: code,
      deliveryTime: `${selected.days} dia(s)`,
      logs: [
        ...activeOrder.logs,
        `[${new Date().toLocaleTimeString()}] Cotação realizada entre ${CARRIERS.length} transportadoras.`,
        `[${new Date().toLocaleTimeString()}] Selecionada: ${selected.name} — R$ ${selected.price.toFixed(2)} / ${selected.days} dia(s).`,
        `[${new Date().toLocaleTimeString()}] Etiqueta gerada automaticamente.`,
        `[${new Date().toLocaleTimeString()}] Código de rastreio: ${code}`,
        `[${new Date().toLocaleTimeString()}] Pedido despachado. Manifesto eletrônico enviado.`,
      ],
    });
    setIsDispatching(false);
  };

  const isShipped  = activeOrder?.status === 'tms_enviado';
  const canQuote   = activeOrder?.status === 'wms_conferido';
  const notReady   = !activeOrder || ['erp_recebido','wms_separando'].includes(activeOrder?.status);

  return (
    <div className="animate-in" style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

      {/* Control bar */}
      <div className="glass-card" style={{ padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <div style={{ fontWeight:700, fontSize:'1rem' }}>Gestão de Transportes (TMS)</div>
          <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>
            Multi-cotação inteligente · Rastreio white-label · Conciliação de faturas
          </div>
        </div>

        {/* Shield toggle */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:'0.75rem', fontWeight:600, color: blackFridayShield ? 'var(--brand-violet)' : 'var(--text-secondary)' }}>
              {blackFridayShield ? '🛡️ Escudo Ativado' : '🛡️ Escudo Black Friday'}
            </div>
            <div style={{ fontSize:'0.68rem', color:'var(--text-muted)' }}>
              {blackFridayShield ? 'Infra elástica — pico seguro' : 'Inactive — processamento padrão'}
            </div>
          </div>
          <label className="toggle-wrap">
            <div
              className={`toggle-track violet ${blackFridayShield ? 'on' : ''}`}
              onClick={() => setBlackFridayShield(p => !p)}
            >
              <div className="toggle-thumb" />
            </div>
          </label>
        </div>
      </div>

      {/* States */}
      {notReady && (
        <EmptyState icon="🚚" message="Aguardando finalização da separação no WMS para liberar a cotação de frete." />
      )}

      {canQuote && quotes.length > 0 && (
        <div className="glass-card" style={{ padding:'24px', display:'flex', flexDirection:'column', gap:'20px' }}>
          <div>
            <div style={{ fontWeight:700, fontSize:'1rem', marginBottom:'4px' }}>
              Cotação em Tempo Real — {quotes.length} Transportadoras
            </div>
            <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>
              A opção mais econômica foi pré-selecionada. Clique para selecionar outra.
            </div>
          </div>

          <div className="divider" />

          {/* Quotes */}
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {quotes.map((q, i) => {
              const isBest = i === 0;
              const isSel  = selected?.name === q.name;
              const saving = (activeOrder.originalFreight - q.price).toFixed(2);

              return (
                <button
                  key={q.name}
                  onClick={() => setSelected(q)}
                  style={{
                    display:'flex', alignItems:'center', gap:'14px',
                    padding:'14px 16px',
                    borderRadius:'var(--radius-md)',
                    border:`1px solid ${isSel ? 'var(--brand-cyan)' : 'var(--glass-border)'}`,
                    background: isSel ? 'var(--brand-cyan-dim)' : 'var(--glass-bg)',
                    cursor:'pointer', fontFamily:'Inter,sans-serif',
                    transition:'all var(--transition-fast)',
                    textAlign:'left',
                  }}
                >
                  {/* Selection indicator */}
                  <div style={{
                    width:18, height:18, borderRadius:'50%', flexShrink:0,
                    border:`2px solid ${isSel ? 'var(--brand-cyan)' : 'var(--glass-border-strong)'}`,
                    background: isSel ? 'var(--brand-cyan)' : 'transparent',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    {isSel && <span style={{ width:6, height:6, borderRadius:'50%', background:'#fff', display:'block' }} />}
                  </div>

                  {/* Logo */}
                  <span style={{ fontSize:'1.3rem', flexShrink:0 }}>{q.logo}</span>

                  {/* Name + delivery */}
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <span style={{ fontWeight:600, fontSize:'0.875rem', color:'var(--text-primary)' }}>{q.name}</span>
                      {isBest && <span className="tag tag-emerald">Mais Barato</span>}
                    </div>
                    <div style={{ fontSize:'0.73rem', color:'var(--text-muted)', marginTop:'2px' }}>
                      Entrega em {q.days} dia{q.days > 1 ? 's' : ''} útil{q.days > 1 ? 'is' : ''}
                    </div>
                  </div>

                  {/* Price */}
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontWeight:800, fontSize:'1rem', color: isBest ? 'var(--brand-emerald)' : 'var(--text-primary)' }}>
                      R$ {q.price.toFixed(2)}
                    </div>
                    {parseFloat(saving) > 0 && (
                      <div style={{ fontSize:'0.68rem', color:'var(--brand-emerald)' }}>
                        Economiza R$ {saving}
                      </div>
                    )}
                    {parseFloat(saving) <= 0 && (
                      <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', textDecoration:'line-through' }}>
                        Antes: R$ {activeOrder.originalFreight.toFixed(2)}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dispatch button */}
          <button
            className="btn-secondary"
            style={{ width:'100%', padding:'14px', fontSize:'1rem', opacity: isDispatching ? 0.7 : 1 }}
            onClick={handleDispatch}
            disabled={isDispatching}
          >
            {isDispatching ? '⏳ Processando...' : '🚀 Confirmar Despacho e Gerar Etiqueta'}
          </button>
        </div>
      )}

      {isShipped && (
        <div className="glass-card" style={{ padding:'24px', display:'flex', flexDirection:'column', gap:'18px' }}>
          {/* Success header */}
          <div style={{
            padding:'16px', borderRadius:'var(--radius-md)',
            background:'var(--brand-emerald-dim)', border:'1px solid rgba(0,229,160,0.2)',
            display:'flex', alignItems:'center', gap:'12px',
          }}>
            <div style={{ fontSize:'1.5rem' }}>✅</div>
            <div>
              <div style={{ fontWeight:700, color:'var(--brand-emerald)', fontSize:'0.95rem' }}>Pedido Despachado com Sucesso</div>
              <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Fatura conciliada · Manifesto eletrônico enviado</div>
            </div>
          </div>

          {/* Detail grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'12px' }}>
            {[
              { label:'Transportadora',    value: activeOrder.carrier },
              { label:'Frete Cotado',      value: `R$ ${activeOrder.freightCost?.toFixed(2)}`, color:'var(--brand-emerald)' },
              { label:'Previsão de Entrega', value: activeOrder.deliveryTime },
              { label:'Economia no Frete', value:`R$ ${(activeOrder.originalFreight - activeOrder.freightCost).toFixed(2)}`, color:'var(--brand-cyan)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="glass-card-inset" style={{ padding:'14px' }}>
                <div className="section-label">{label}</div>
                <div style={{ fontWeight:700, marginTop:'4px', color: color ?? 'var(--text-primary)' }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Tracking */}
          <div style={{ padding:'14px 16px', background:'var(--brand-cyan-dim)', border:'1px solid rgba(0,212,255,0.2)', borderRadius:'var(--radius-md)' }}>
            <div className="section-label">Rastreio White-Label ShopMax</div>
            <div className="mono" style={{ fontWeight:700, color:'var(--brand-cyan)', marginTop:'4px', fontSize:'0.875rem' }}>
              {activeOrder.trackingCode}
            </div>
            <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:'4px' }}>
              Link enviado automaticamente por e-mail e WhatsApp ao cliente.
            </div>
          </div>
        </div>
      )}

      {/* Shield info */}
      <div className="metric-card" style={{ borderLeft:`3px solid ${blackFridayShield ? 'var(--brand-violet)' : 'var(--glass-border-strong)'}` }}>
        <div style={{ fontWeight:600, fontSize:'0.85rem', color: blackFridayShield ? 'var(--brand-violet)' : 'var(--text-secondary)', marginBottom:'4px' }}>
          🛡️ Escudo Black Friday — {blackFridayShield ? 'ATIVADO' : 'Inativo'}
        </div>
        <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', lineHeight:1.7 }}>
          {blackFridayShield
            ? 'Modo de alta disponibilidade ativo. Processamento elástico de cotações — sem timeout de API, sem falha na emissão de etiquetas, sem colapso de integrações.'
            : 'Ative o Escudo Black Friday antes dos picos de novembro para garantir que nenhum pedido fique preso por timeout de API ou falha de integração.'}
        </p>
      </div>
    </div>
  );
}
