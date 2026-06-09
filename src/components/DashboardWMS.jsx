import React, { useState } from 'react';

const STOCK_MAP = {
  'Sofá Retrátil Velvet':         { corridor: 'A', shelf: '1-1', zone: 'Volumosos' },
  'Vaso Decorativo Moderno':      { corridor: 'A', shelf: '1-3', zone: 'Frágeis'   },
  'Smart TV 55" 4K':             { corridor: 'B', shelf: '2-1', zone: 'Eletrônicos'},
  'Lâmpada Inteligente RGB':      { corridor: 'B', shelf: '3-2', zone: 'Eletrônicos'},
  'Quadro Abstrato Sala':         { corridor: 'C', shelf: '1-2', zone: 'Decoração'  },
  'Cafeteira Espresso Automática':{ corridor: 'C', shelf: '4-1', zone: 'Domésticos' },
};

function EmptyState({ icon, message }) {
  return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      padding:'60px 24px', textAlign:'center', gap:'12px',
      border:'1px dashed var(--glass-border)', borderRadius:'var(--radius-lg)',
      color:'var(--text-muted)',
    }}>
      <span style={{ fontSize:'2.5rem' }}>{icon}</span>
      <span style={{ fontSize:'0.85rem', maxWidth:260, lineHeight:1.6 }}>{message}</span>
    </div>
  );
}

// ── Mobile-style Modo Temporário ──────────────────────────────
function ModoTemporario({ activeOrder, onComplete }) {
  const [step, setStep]           = useState(0); // 0=start, 1..n=item, n+1=weight, n+2=done
  const [scanned, setScanned]     = useState({});
  const [weighed, setWeighed]     = useState(false);
  const total = activeOrder?.items.length ?? 0;

  const scanItem = (name) => setScanned(p => ({ ...p, [name]: true }));

  const bgGrad = 'linear-gradient(160deg, #0d1420, #111927)';

  return (
    <div style={{ display:'flex', justifyContent:'center' }}>
      {/* Phone frame */}
      <div style={{
        width: 320,
        background: bgGrad,
        border: '3px solid var(--brand-amber)',
        borderRadius: 28,
        overflow: 'hidden',
        boxShadow: '0 0 60px rgba(245,158,11,0.2), var(--shadow-lg)',
      }}>
        {/* Phone status bar */}
        <div style={{
          background:'rgba(0,0,0,0.4)', padding:'8px 20px',
          display:'flex', justifyContent:'space-between', alignItems:'center',
          fontSize:'0.7rem', color:'#94a3b8',
        }}>
          <span>2GL WMS</span>
          <span style={{ color:'var(--brand-amber)', fontWeight:700, letterSpacing:'0.05em' }}>
            ⚡ MODO TEMPORÁRIO
          </span>
          <span>⚡ 94%</span>
        </div>

        {/* Content */}
        <div style={{ padding:'24px 20px', minHeight:420, display:'flex', flexDirection:'column', gap:'16px' }}>

          {/* Step 0: Start */}
          {step === 0 && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'20px', textAlign:'center' }}>
              <div style={{
                width:64, height:64, borderRadius:'50%',
                background:'var(--brand-amber-dim)', border:'2px solid var(--brand-amber)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem',
              }}>📦</div>
              <div>
                <div style={{ fontWeight:800, fontSize:'1.1rem', color:'#f0f4ff', marginBottom:'6px' }}>
                  Pedido {activeOrder?.id}
                </div>
                <div style={{ fontSize:'0.8rem', color:'#94a3b8', lineHeight:1.6 }}>
                  Siga as instruções na tela.<br/>Nenhum treinamento prévio necessário.
                </div>
              </div>
              <button
                className="btn-warning"
                style={{ width:'100%' }}
                onClick={() => setStep(1)}
              >
                Iniciar Separação ➔
              </button>
            </div>
          )}

          {/* Steps 1..total: item picking */}
          {step >= 1 && step <= total && (() => {
            const item = activeOrder.items[step - 1];
            const loc  = STOCK_MAP[item.name] ?? { corridor:'?', shelf:'?', zone:'Geral' };
            const ok   = scanned[item.name];
            return (
              <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                {/* Progress */}
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'#94a3b8', marginBottom:'6px' }}>
                    <span>Progresso</span><span>{step}/{total}</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width:`${(step/total)*100}%`, background:'var(--brand-amber)' }} />
                  </div>
                </div>

                {/* Destination */}
                <div style={{
                  background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.3)',
                  borderRadius:'var(--radius-md)', padding:'16px', textAlign:'center',
                }}>
                  <div style={{ fontSize:'0.7rem', color:'var(--brand-amber)', fontWeight:700, letterSpacing:'0.08em', marginBottom:'6px' }}>
                    VÁ ATÉ
                  </div>
                  <div style={{ fontSize:'1.6rem', fontWeight:800, color:'#f0f4ff', letterSpacing:'-0.02em' }}>
                    Corredor {loc.corridor} · {loc.shelf}
                  </div>
                  <div style={{ fontSize:'0.75rem', color:'#94a3b8', marginTop:'4px' }}>Zona: {loc.zone}</div>
                </div>

                {/* Item */}
                <div style={{
                  background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)',
                  borderRadius:'var(--radius-md)', padding:'14px',
                }}>
                  <div style={{ fontSize:'0.7rem', color:'#94a3b8', marginBottom:'4px' }}>COLETAR</div>
                  <div style={{ fontWeight:700, color:'#f0f4ff', fontSize:'0.95rem', marginBottom:'2px', textDecoration: ok ? 'line-through' : 'none' }}>
                    {item.qty}× {item.name}
                  </div>
                  <div style={{ fontSize:'0.72rem', color:'#94a3b8' }}>{item.weight * item.qty} kg</div>
                </div>

                {/* Action */}
                {!ok ? (
                  <button
                    style={{
                      width:'100%', padding:'14px', borderRadius:'var(--radius-md)',
                      background:'var(--brand-cyan)', color:'#fff', border:'none',
                      fontWeight:700, cursor:'pointer', fontSize:'0.9rem', fontFamily:'Inter,sans-serif',
                    }}
                    onClick={() => scanItem(item.name)}
                  >
                    📷 Escanear QR Code
                  </button>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                    <div style={{ textAlign:'center', fontWeight:700, color:'var(--brand-emerald)', fontSize:'0.85rem' }}>
                      ✓ Produto validado!
                    </div>
                    <button
                      style={{
                        width:'100%', padding:'12px', borderRadius:'var(--radius-md)',
                        background:'var(--brand-amber)', color:'#000', border:'none',
                        fontWeight:700, cursor:'pointer', fontFamily:'Inter,sans-serif',
                      }}
                      onClick={() => setStep(p => p + 1)}
                    >
                      {step < total ? 'Próximo ➔' : 'Finalizar Coleta ➔'}
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Step: weighing */}
          {step === total + 1 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'16px', alignItems:'center', textAlign:'center' }}>
              <div style={{ fontSize:'2rem' }}>⚖️</div>
              <div style={{ fontWeight:700, color:'#f0f4ff' }}>Balança de Expedição</div>
              <div style={{ fontSize:'0.8rem', color:'#94a3b8' }}>Coloque a caixa na balança integrada para validação automática de peso.</div>
              <div style={{
                background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                borderRadius:'var(--radius-md)', padding:'20px 32px',
              }}>
                <div style={{ fontSize:'0.7rem', color:'#94a3b8', marginBottom:'4px' }}>PESO DETECTADO</div>
                <div style={{ fontSize:'2rem', fontWeight:800, color:'#f0f4ff' }}>
                  {activeOrder?.totalWeight?.toFixed(1)} kg
                </div>
              </div>
              <button
                className="btn-secondary"
                style={{ width:'100%' }}
                onClick={() => { setWeighed(true); setStep(p => p + 1); }}
              >
                ✓ Confirmar Peso
              </button>
            </div>
          )}

          {/* Step: done */}
          {step > total + 1 && (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'20px', textAlign:'center' }}>
              <div style={{
                width:64, height:64, borderRadius:'50%',
                background:'var(--brand-emerald-dim)', border:'2px solid var(--brand-emerald)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem',
              }}>✅</div>
              <div>
                <div style={{ fontWeight:800, fontSize:'1.1rem', color:'#f0f4ff', marginBottom:'6px' }}>Separação Concluída!</div>
                <div style={{ fontSize:'0.8rem', color:'#94a3b8' }}>100% de acuracidade. Nenhum erro de picking detectado.</div>
              </div>
              <button
                style={{
                  width:'100%', padding:'14px', borderRadius:'var(--radius-md)',
                  background:'var(--brand-emerald)', color:'#fff', border:'none',
                  fontWeight:700, cursor:'pointer', fontSize:'0.9rem', fontFamily:'Inter,sans-serif',
                }}
                onClick={onComplete}
              >
                Liberar para TMS ➔
              </button>
            </div>
          )}

          {/* Advance from item scan to weight */}
          {step === total && scanned[activeOrder?.items[total-1]?.name] && step <= total && (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Normal Desktop Mode ───────────────────────────────────────
function ModoNormal({ activeOrder, onComplete }) {
  const [scanned, setScanned] = useState({});
  const [weighed, setWeighed] = useState(false);
  const allScanned = activeOrder?.items.every(i => scanned[i.name]);

  return (
    <div className="glass-card" style={{ padding:'24px', display:'flex', flexDirection:'column', gap:'18px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontWeight:700, fontSize:'1rem' }}>Rota Otimizada de Separação</div>
          <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Endereçamento inteligente por zona · Validação QR Code</div>
        </div>
        <span className="tag tag-amber">Modo Padrão</span>
      </div>

      <div className="divider" />

      {/* Item list */}
      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
        {activeOrder?.items.map((item, i) => {
          const loc  = STOCK_MAP[item.name] ?? { corridor:'?', shelf:'?', zone:'Geral' };
          const ok   = scanned[item.name];
          return (
            <div
              key={i}
              style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'14px 16px', borderRadius:'var(--radius-md)',
                background: ok ? 'rgba(0,229,160,0.05)' : 'var(--glass-bg)',
                border:`1px solid ${ok ? 'rgba(0,229,160,0.2)' : 'var(--glass-border)'}`,
                transition:'all var(--transition-normal)',
              }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div className="step-circle" style={{ width:32, height:32, fontSize:'0.78rem' }} data-state={ok ? 'done' : 'active'}>
                  <div className={`step-circle ${ok ? 'done' : 'active'}`} style={{ width:32, height:32 }}>
                    {ok ? '✓' : i+1}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight:600, fontSize:'0.875rem', color: ok ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: ok ? 'line-through' : 'none' }}>
                    {item.qty}× {item.name}
                  </div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:'2px' }}>
                    Corredor {loc.corridor} · Prateleira {loc.shelf} · Zona {loc.zone}
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{item.weight * item.qty}kg</span>
                {!ok ? (
                  <button
                    className="btn-ghost"
                    style={{ padding:'6px 12px', fontSize:'0.75rem' }}
                    onClick={() => setScanned(p => ({ ...p, [item.name]: true }))}
                  >
                    📷 Escanear
                  </button>
                ) : (
                  <span style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--brand-emerald)' }}>Validado ✓</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Weighing & completion */}
      {allScanned && (
        <div style={{
          padding:'16px 20px',
          background:'var(--brand-cyan-dim)',
          border:'1px solid rgba(0,212,255,0.2)',
          borderRadius:'var(--radius-md)',
          display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px',
        }}>
          <div>
            <div style={{ fontWeight:600, color:'var(--brand-cyan)', fontSize:'0.875rem', marginBottom:'2px' }}>
              ⚖️ Balança Integrada — {activeOrder?.totalWeight?.toFixed(1)} kg detectados
            </div>
            <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Peso validado dentro da tolerância. Pronto para embalar.</div>
          </div>
          {!weighed ? (
            <button className="btn-ghost" onClick={() => setWeighed(true)}>Confirmar Peso</button>
          ) : (
            <button className="btn-secondary" onClick={onComplete}>Enviar para TMS ➔</button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main WMS Dashboard ────────────────────────────────────────
export default function DashboardWMS({ activeOrder, updateOrderStatus, isTemporaryMode, setIsTemporaryMode, incrementRoiMetric }) {

  const handleComplete = () => {
    if (!activeOrder) return;
    incrementRoiMetric('pickingErrorsEvaded', 1);
    updateOrderStatus(activeOrder.id, 'wms_conferido', {
      pickingOperator: isTemporaryMode ? 'Operador Temporário' : 'Operador Padrão',
      logs: [
        ...activeOrder.logs,
        `[${new Date().toLocaleTimeString()}] Picking 100% acurado via ${isTemporaryMode ? 'Modo Temporário' : 'Modo Padrão'}.`,
        `[${new Date().toLocaleTimeString()}] Pesagem finalizada. Embalagem concluída.`,
        `[${new Date().toLocaleTimeString()}] Pedido pronto para expedição (TMS).`,
      ],
    });
  };

  const isWmsCompleted = activeOrder && ['wms_conferido','tms_cotado','tms_enviado'].includes(activeOrder.status);
  const canStart       = activeOrder && !['erp_recebido'].includes(activeOrder.status);

  return (
    <div className="animate-in" style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

      {/* Control bar */}
      <div className="glass-card" style={{ padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <div style={{ fontWeight:700, fontSize:'1rem' }}>Gerenciamento de Estoque (WMS)</div>
          <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>
            Picking inteligente · Rota por zona · Validação óptica
          </div>
        </div>
        
        {/* Mode toggle */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:'0.75rem', fontWeight:600, color: isTemporaryMode ? 'var(--brand-amber)' : 'var(--text-secondary)' }}>
              {isTemporaryMode ? '⚡ Modo Temporário' : 'Modo Padrão'}
            </div>
            <div style={{ fontSize:'0.68rem', color:'var(--text-muted)' }}>
              {isTemporaryMode ? 'Onboarding 15 min — Black Friday' : 'Interface completa de operação'}
            </div>
          </div>
          <label className="toggle-wrap">
            <div
              className={`toggle-track amber ${isTemporaryMode ? 'on' : ''}`}
              onClick={() => setIsTemporaryMode(p => !p)}
            >
              <div className="toggle-thumb" />
            </div>
          </label>
        </div>
      </div>

      {/* Content */}
      {!activeOrder ? (
        <div style={{ border:'1px dashed var(--glass-border)', borderRadius:'var(--radius-lg)', padding:'60px', textAlign:'center', color:'var(--text-muted)', fontSize:'0.85rem' }}>
          <span style={{ fontSize:'2rem', display:'block', marginBottom:'12px' }}>🏭</span>
          Selecione ou fature um pedido no ERP para iniciar a separação.
        </div>
      ) : !canStart ? (
        <div style={{ border:'1px dashed var(--glass-border)', borderRadius:'var(--radius-lg)', padding:'60px', textAlign:'center', color:'var(--text-muted)', fontSize:'0.85rem' }}>
          <span style={{ fontSize:'2rem', display:'block', marginBottom:'12px' }}>⏳</span>
          Aguardando faturamento no ERP antes de iniciar a separação.
        </div>
      ) : isWmsCompleted ? (
        <div className="glass-card" style={{ padding:'24px', display:'flex', flexDirection:'column', gap:'12px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--brand-emerald-dim)', border:'1px solid var(--brand-emerald)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>✓</div>
            <div>
              <div style={{ fontWeight:700, color:'var(--brand-emerald)' }}>Separação e Embalagem Concluídas</div>
              <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Operador: {activeOrder.pickingOperator} · {activeOrder.totalWeight} kg verificados</div>
            </div>
          </div>
          <div className="glass-card-inset mono" style={{ padding:'12px 14px', fontSize:'0.72rem', color:'var(--text-muted)' }}>
            {activeOrder.logs.filter(l => l.includes('Picking') || l.includes('Pesagem') || l.includes('Embalagem')).map((l,i) => <div key={i}>{l}</div>)}
          </div>
        </div>
      ) : isTemporaryMode ? (
        <ModoTemporario activeOrder={activeOrder} onComplete={handleComplete} />
      ) : (
        <ModoNormal activeOrder={activeOrder} onComplete={handleComplete} />
      )}

      {/* Info card */}
      {isTemporaryMode && !isWmsCompleted && (
        <div className="metric-card" style={{ borderLeft:'3px solid var(--brand-amber)' }}>
          <div style={{ fontWeight:600, fontSize:'0.85rem', color:'var(--brand-amber)', marginBottom:'4px' }}>
            ⚡ Por que o Modo Temporário importa?
          </div>
          <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', lineHeight:1.7 }}>
            Na Black Friday, a ShopMax contrata operadores de uma hora pra outra. Sem o Modo Temporário, cada um perde 2–3 horas de treinamento — e ainda erra. Com a 2GL, qualquer pessoa está operando corretamente em 15 minutos.
          </p>
        </div>
      )}
    </div>
  );
}
