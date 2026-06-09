import React from 'react';

// ────────────────────────────────────────────────────────────
// ROI PANEL — Barra de métricas ao vivo no topo
// ────────────────────────────────────────────────────────────

function MetricBlock({ label, value, sub, color, icon }) {
  return (
    <div style={{
      flex: 1,
      minWidth: 160,
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '16px 20px',
    }}>
      {/* Icon circle */}
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: `${color}18`,
        border: `1px solid ${color}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem', flexShrink: 0,
      }}>
        {icon}
      </div>

      {/* Data */}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '2px', whiteSpace: 'nowrap' }}>
          {label}
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color, lineHeight: 1, marginBottom: '2px', letterSpacing: '-0.02em' }}>
          {value}
        </div>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {sub}
        </div>
      </div>
    </div>
  );
}

export default function RoiPanel({ roi, ordersCount }) {
  const totalEconomy = roi.freightSavings + roi.pickingErrorsEvaded * 50;
  const investment   = 15000; // Opção B da proposta
  
  const roiX = ordersCount > 0
    ? (totalEconomy / (investment / 20000 * ordersCount)).toFixed(1)
    : '14,7';

  const divider = (
    <div style={{ width: 1, background: 'var(--glass-border)', alignSelf: 'stretch', flexShrink: 0 }} />
  );

  return (
    <div
      className="glass-card"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'stretch',
        overflow: 'hidden',
        marginBottom: '0',
        gap: '0',
        padding: '0',
        position: 'relative',
      }}
    >
      {/* Live indicator strip */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'var(--gradient-brand)',
      }} />

      <MetricBlock
        icon="💸"
        label="Economia de Frete"
        value={`R$ ${roi.freightSavings.toFixed(2)}`}
        sub="Multi-cotação TMS"
        color="var(--brand-cyan)"
      />
      {divider}
      <MetricBlock
        icon="✅"
        label="Erros de Picking Evitados"
        value={`${roi.pickingErrorsEvaded}`}
        sub={`≈ R$ ${(roi.pickingErrorsEvaded * 50).toFixed(2)} em logística reversa`}
        color="var(--brand-emerald)"
      />
      {divider}
      <MetricBlock
        icon="📈"
        label="Economia Total Acumulada"
        value={`R$ ${totalEconomy.toFixed(2)}`}
        sub="Nesta sessão de simulação"
        color="var(--text-primary)"
      />
      {divider}
      <MetricBlock
        icon="🏆"
        label="Retorno sobre Investimento"
        value={ordersCount > 0 ? `${roiX}×` : `${roiX}× proj.`}
        sub={ordersCount > 0 ? 'Volume simulado' : 'Payback no 1º mês'}
        color="var(--brand-amber)"
      />

      {/* Right: live badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '0 20px', borderLeft: '1px solid var(--glass-border)',
        flexShrink: 0,
      }}>
        <span className="live-dot" />
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--brand-emerald)' }}>
          AO VIVO
        </span>
      </div>
    </div>
  );
}
