import React, { useState, useEffect } from 'react';
import './index.css';

import RoiPanel from './components/RoiPanel';
import SimuladorPedidos from './components/SimuladorPedidos';
import DashboardERP from './components/DashboardERP';
import DashboardWMS from './components/DashboardWMS';
import DashboardTMS from './components/DashboardTMS';
import DashboardOperacoes, { INITIAL_STOCK } from './components/DashboardOperacoes';

// ────────────────────────────────────────────────────────────
// ICONS (SVG inline para evitar dependência extra)
// ────────────────────────────────────────────────────────────
const Icon = {
  Sun: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  Moon: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  ),
  Grid: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Briefcase: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    </svg>
  ),
  Package: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  Truck: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  ),
  BarChart: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Zap: () => (
    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
  ),
  ShoppingBag: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
};

// ────────────────────────────────────────────────────────────
// NAV ITEM
// ────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'overview',     label: 'Visão Geral',    IconComp: Icon.Grid,        accent: 'var(--brand-cyan)' },
  { id: 'erp',          label: 'ERP',             IconComp: Icon.Briefcase,   accent: 'var(--brand-violet)' },
  { id: 'wms',          label: 'WMS',             IconComp: Icon.Package,     accent: 'var(--brand-amber)' },
  { id: 'tms',          label: 'TMS',             IconComp: Icon.Truck,       accent: 'var(--brand-emerald)' },
  { id: 'operacoes',    label: 'Operações',        IconComp: Icon.ShoppingBag, accent: 'var(--brand-cyan)' },
  { id: 'comparative',  label: 'Antes × Depois',  IconComp: Icon.BarChart,    accent: 'var(--brand-rose)' },
];

// ────────────────────────────────────────────────────────────
// SIDEBAR
// ────────────────────────────────────────────────────────────
function Sidebar({ activeTab, setActiveTab, theme, toggleTheme, orders, roi, stock }) {
  const completed  = orders.filter(o => o.status === 'tms_enviado').length;
  const total      = orders.length;
  const critStock  = (stock ?? []).filter(s => s.qty === 0 || s.qty / s.minQty <= 1).length;
  const alertStock = (stock ?? []).filter(s => s.qty > 0 && s.qty / s.minQty <= 2).length;

  return (
    <aside style={{
      width: 'var(--sidebar-w)',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      height: '100vh',
      position: 'sticky',
      top: 0,
      padding: '20px 16px',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--glass-border)',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 4px', marginBottom: '8px' }}>
        <div style={{
          width: 36, height: 36,
          background: 'var(--gradient-brand)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', fontWeight: 800, color: '#fff',
          boxShadow: 'var(--shadow-cyan)',
          flexShrink: 0,
        }}>2GL</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>2GL Business</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ShopMax · Logística</div>
        </div>
      </div>

      {/* Live status pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '8px 12px',
        background: 'var(--brand-emerald-dim)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid rgba(0,229,160,0.2)',
        marginBottom: '8px',
      }}>
        <span className="live-dot" />
        <span style={{ fontSize: '0.75rem', color: 'var(--brand-emerald)', fontWeight: 600 }}>Sistema Online</span>
        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{total} pedidos</span>
      </div>

      {/* Nav */}
      <div className="section-label" style={{ padding: '0 4px' }}>Módulos</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV_ITEMS.map(({ id, label, IconComp, accent }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: isActive ? `${accent}18` : 'transparent',
                color: isActive ? accent : 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.875rem',
                textAlign: 'left',
                transition: 'all var(--transition-fast)',
                borderLeft: isActive ? `2px solid ${accent}` : '2px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'var(--glass-bg)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
            >
              <IconComp />
              {label}
              {id === 'wms' && <span className="tag tag-amber" style={{ marginLeft: 'auto', padding: '1px 6px' }}>WMS</span>}
              {id === 'erp' && total > 0 && (
                <span style={{ marginLeft: 'auto', fontSize: '0.7rem', background: 'var(--brand-violet-dim)', color: 'var(--brand-violet)', borderRadius: 4, padding: '1px 6px', fontWeight: 600 }}>
                  {total}
                </span>
              )}
              {id === 'operacoes' && critStock > 0 && (
                <span style={{ marginLeft: 'auto', fontSize: '0.7rem', background: 'var(--brand-rose-dim)', color: 'var(--brand-rose)', borderRadius: 4, padding: '1px 6px', fontWeight: 700 }}>
                  {critStock} ⚠
                </span>
              )}
              {id === 'operacoes' && critStock === 0 && alertStock > 0 && (
                <span style={{ marginLeft: 'auto', fontSize: '0.7rem', background: 'var(--brand-amber-dim)', color: 'var(--brand-amber)', borderRadius: 4, padding: '1px 6px', fontWeight: 700 }}>
                  {alertStock} !
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick metrics */}
      {total > 0 && (
        <>
          <div className="divider" />
          <div className="section-label" style={{ padding: '0 4px' }}>Resumo Rápido</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0 4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Despachados</span>
              <span style={{ fontWeight: 600, color: 'var(--brand-emerald)' }}>{completed}/{total}</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '0 4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Economia Frete</span>
              <span style={{ fontWeight: 600, color: 'var(--brand-cyan)' }}>R$ {roi.freightSavings.toFixed(2)}</span>
            </div>
            {critStock > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '4px 8px', background: 'var(--brand-rose-dim)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(244,63,94,0.2)' }}>
                <span style={{ color: 'var(--brand-rose)' }}>⚠ Estoque crítico</span>
                <span style={{ fontWeight: 700, color: 'var(--brand-rose)' }}>{critStock} SKU{critStock > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Bottom: Theme toggle */}
      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
        <button
          onClick={toggleTheme}
          className="btn-ghost"
          style={{ width: '100%', justifyContent: 'flex-start', gap: '10px' }}
        >
          {theme === 'dark' ? <Icon.Sun /> : <Icon.Moon />}
          <span style={{ fontSize: '0.8rem' }}>{theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}</span>
        </button>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center' }}>
          v2.0 · Entrega2 · SENAI Ourinhos
        </div>
      </div>
    </aside>
  );
}

// ────────────────────────────────────────────────────────────
// OVERVIEW TAB
// ────────────────────────────────────────────────────────────
function OverviewTab({ orders, setActiveTab }) {
  const completed  = orders.filter(o => o.status === 'tms_enviado').length;
  const pendingWms = orders.filter(o => o.status === 'wms_separando').length;
  const pendingTms = orders.filter(o => o.status === 'wms_conferido').length;
  const pendingErp = orders.filter(o => o.status === 'erp_recebido').length;

  const metrics = [
    { label: 'Na Fila ERP',       value: pendingErp,  color: 'var(--brand-violet)', tab: 'erp' },
    { label: 'Separando (WMS)',   value: pendingWms,  color: 'var(--brand-amber)',  tab: 'wms' },
    { label: 'Aguardando TMS',    value: pendingTms,  color: 'var(--brand-cyan)',   tab: 'tms' },
    { label: 'Despachados',       value: completed,   color: 'var(--brand-emerald)',tab: 'tms' },
  ];

  const diferenciais = [
    { icon: '⚡', title: 'Modo Temporário',   desc: 'Onboarding de operadores em 15 min. Interface mobile intuitiva para pick guiado.',   color: 'var(--brand-amber)',   tab: 'wms' },
    { icon: '📊', title: 'ROI ao Vivo',       desc: 'Painel em tempo real calculando economia de frete e redução de erros de picking.',    color: 'var(--brand-cyan)',   tab: null },
    { icon: '🛡️', title: 'Escudo Black Friday', desc: 'Processamento escalável de APIs. Zero colapso nos picos de novembro.',             color: 'var(--brand-violet)', tab: 'tms' },
    { icon: '🤖', title: 'NF-e Automática',   desc: 'Faturamento automático vinculado ao pedido. Sem digitação, sem erros humanos.',      color: 'var(--brand-emerald)', tab: 'erp' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-in">
      {/* Hero */}
      <div className="glass-card" style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(0,229,160,0.04))', border: '1px solid rgba(0,212,255,0.15)' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brand-cyan)', marginBottom: '12px' }}>
          Torre de Controle Integrada
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '12px', letterSpacing: '-0.02em' }}>
          Do pedido ao despacho,<br/>
          <span className="gradient-text">em tempo real.</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 500, lineHeight: 1.7, marginBottom: '24px' }}>
          O sistema da 2GL Business une ERP, WMS e TMS em um único fluxo de dados contínuo. Cada ação alimenta o próximo módulo automaticamente — eliminando retrabalho e gargalos.
        </p>

        {/* Flow visualization */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', flexWrap: 'wrap', gap: '4px' }}>
          {[
            { label: '1 · ERP', sub: 'Integração & NF-e', color: 'var(--brand-violet)', tab: 'erp' },
            { label: '2 · WMS', sub: 'Picking & Pesagem', color: 'var(--brand-amber)',  tab: 'wms' },
            { label: '3 · TMS', sub: 'Frete & Rastreio',  color: 'var(--brand-emerald)', tab: 'tms' },
          ].map(({ label, sub, color, tab }, i) => (
            <React.Fragment key={i}>
              <button
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 20px',
                  background: `${color}18`,
                  border: `1px solid ${color}40`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)',
                  fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${color}28`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.transform = ''; }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color }}>{label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub}</div>
              </button>
              {i < 2 && <Icon.ArrowRight />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {metrics.map(({ label, value, color, tab }) => (
          <button
            key={label}
            className="metric-card"
            onClick={() => setActiveTab(tab)}
            style={{ cursor: 'pointer', background: 'var(--glass-bg)', border: `1px solid var(--glass-border)`, textAlign: 'left', fontFamily: 'Inter, sans-serif' }}
          >
            <div className="section-label">{label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1.2, marginTop: '4px' }}>{value}</div>
          </button>
        ))}
      </div>

      {/* Diferenciais */}
      <div>
        <div className="section-label" style={{ marginBottom: '12px' }}>Diferenciais Inovadores</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {diferenciais.map(({ icon, title, desc, color, tab }) => (
            <div
              key={title}
              className="metric-card"
              style={{ cursor: tab ? 'pointer' : 'default' }}
              onClick={() => tab && setActiveTab(tab)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>{icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color, marginBottom: '4px' }}>{title}</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// COMPARATIVE TAB
// ────────────────────────────────────────────────────────────
function ComparativeTab() {
  const rows = [
    { etapa: 'Recebimento do Pedido',  antes: 'Exportação manual para Excel e impressão de folhas.', depois: 'API automática importa pedidos em segundos e cria a ordem no WMS.' },
    { etapa: 'Separação no Estoque',   antes: 'Operador caminha sem rota; alto índice de erro de produto.', depois: 'WMS guia pelo celular com rota otimizada e valida por QR Code.' },
    { etapa: 'Faturamento (NF-e)',      antes: 'Digitação manual em emissor simples — lento e sujeito a erros.', depois: 'NF-e emitida e DANFE vinculada automaticamente ao confirmar separação.' },
    { etapa: 'Expedição',               antes: 'Conferência manual com divergências no carregamento.', depois: 'WMS confirma volumes por peso; TMS gera manifesto eletrônico.' },
    { etapa: 'Cotação de Frete',        antes: 'Aceitação do valor sem comparação. Custo alto com 1 transportadora.', depois: 'Multi-cotação instantânea entre 20 parceiras. Melhor custo×prazo automático.' },
    { etapa: 'Rastreio para Cliente',   antes: 'Sem rastreio ou só via app da transportadora.', depois: 'Link white-label ShopMax em todos os canais — cliente rastreia em tempo real.' },
    { etapa: 'Black Friday',            antes: 'Colapso operacional; temporários perdidos no estoque.', depois: 'Modo Temporário (15 min onboarding) + Escudo Black Friday (infra elástica).' },
    { etapa: 'Visibilidade de Custos',  antes: '"Conta de padaria" mensal; custo oculto entre 15–18%.', depois: 'Painel de ROI ao vivo — custo real por pedido visível a qualquer momento.' },
  ];

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <span style={{ fontSize: '1.4rem' }}>📊</span>
          <h2 style={{ fontWeight: 700, fontSize: '1.2rem' }}>Diagnóstico de Operação — ShopMax</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
          Mapeamento dos 8 gargalos identificados na proposta comercial da 2GL Business e como cada um é resolvido pela plataforma.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 180 }}>Etapa</th>
                <th style={{ color: 'var(--brand-rose)' }}>⚠ Situação Atual</th>
                <th style={{ color: 'var(--brand-emerald)' }}>✓ Com a 2GL Business</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ etapa, antes, depois }) => (
                <tr key={etapa}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.8rem' }}>{etapa}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{antes}</td>
                  <td>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>{depois}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KPI summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {[
          { label: 'Redução de Custo Logístico', value: '~31%', desc: 'De 16% para 11% do faturamento', color: 'var(--brand-emerald)' },
          { label: 'Payback Estimado', value: '< 1 mês', desc: 'Garantido no primeiro mês de uso', color: 'var(--brand-cyan)' },
          { label: 'ROI Projetado', value: '14,7×', desc: 'Retorno sobre investimento anualizado', color: 'var(--brand-violet)' },
        ].map(({ label, value, desc, color }) => (
          <div key={label} className="metric-card" style={{ textAlign: 'center' }}>
            <div className="section-label">{label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color, margin: '8px 0 4px' }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// APP ROOT
// ────────────────────────────────────────────────────────────
export default function App() {
  const [orders, setOrders]             = useState([]);
  const [activeOrder, setActiveOrder]   = useState(null);
  const [theme, setTheme]               = useState('dark');
  const [isTemporaryMode, setIsTemporaryMode] = useState(false);
  const [blackFridayShield, setBlackFridayShield] = useState(false);
  const [activeTab, setActiveTab]       = useState('overview');
  const [roi, setRoi]                   = useState({ freightSavings: 0, pickingErrorsEvaded: 0 });
  const [stock, setStock]               = useState(INITIAL_STOCK);

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const addOrder = (newOrder) => setOrders(prev => [newOrder, ...prev]);

  // Desconta estoque quando o pedido muda para 'tms_enviado'
  const decrementStock = (orderItems) => {
    setStock(prev => prev.map(stockItem => {
      const sold = orderItems.find(i => i.name === stockItem.name);
      if (!sold) return stockItem;
      return { ...stockItem, qty: Math.max(0, stockItem.qty - sold.qty) };
    }));
  };

  const updateOrderStatus = (orderId, newStatus, extraData = {}) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;
      const updated = { ...order, status: newStatus, ...extraData };
      if (activeOrder?.id === orderId) setTimeout(() => setActiveOrder(updated), 0);
      // Desconta estoque ao despachar
      if (newStatus === 'tms_enviado') decrementStock(order.items);
      return updated;
    }));
  };

  const incrementRoiMetric = (metric, amount) =>
    setRoi(prev => ({ ...prev, [metric]: prev[metric] + amount }));

  const SHARED = { activeOrder, updateOrderStatus, orders, incrementRoiMetric };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        orders={orders}
        roi={roi}
        stock={stock}
      />

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        
        {/* Top bar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          padding: '14px 28px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backdropFilter: 'blur(12px)',
        }}>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
              {NAV_ITEMS.find(n => n.id === activeTab)?.label ?? 'Dashboard'}
            </h1>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              ShopMax · Protótipo 2GL Business · Entrega 2
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {activeOrder && (
              <div style={{
                padding: '6px 14px',
                background: 'var(--brand-cyan-dim)',
                border: '1px solid rgba(0,212,255,0.2)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem', fontWeight: 600, color: 'var(--brand-cyan)',
              }}>
                Selecionado: {activeOrder.id}
              </div>
            )}
          </div>
        </div>

        {/* ROI Banner */}
        <div style={{ padding: '20px 28px 0' }}>
          <RoiPanel roi={roi} ordersCount={orders.length} />
        </div>

        {/* Main layout */}
        <div style={{ display: 'flex', gap: '20px', padding: '20px 28px 40px', flex: 1, alignItems: 'flex-start' }}>
          
          {/* Simulador sidebar */}
          <SimuladorPedidos
            addOrder={addOrder}
            orders={orders}
            activeOrder={activeOrder}
            setActiveOrder={setActiveOrder}
          />

          {/* Tab content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {activeTab === 'overview'    && <OverviewTab orders={orders} setActiveTab={setActiveTab} />}
            {activeTab === 'erp'         && <DashboardERP {...SHARED} />}
            {activeTab === 'wms'         && (
              <DashboardWMS
                {...SHARED}
                isTemporaryMode={isTemporaryMode}
                setIsTemporaryMode={setIsTemporaryMode}
              />
            )}
            {activeTab === 'tms'         && (
              <DashboardTMS
                {...SHARED}
                blackFridayShield={blackFridayShield}
                setBlackFridayShield={setBlackFridayShield}
              />
            )}
            {activeTab === 'operacoes'   && <DashboardOperacoes orders={orders} stock={stock} />}
            {activeTab === 'comparative' && <ComparativeTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
