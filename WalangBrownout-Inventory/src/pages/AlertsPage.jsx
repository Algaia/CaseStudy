import { useMemo, useState } from 'react';
import { Button, EmptyState, Icon, PageTitle, SectionCard, StatusPill } from '../components/ui';

const typeMeta = {
  critical: { label: 'Low stock', icon: 'warning', tone: 'danger' },
  expiry: { label: 'Expiring soon', icon: 'calendar', tone: 'warning' },
  seasonal: { label: 'Seasonal reorder', icon: 'trend', tone: 'violet' },
  mismatch: { label: 'Count mismatch', icon: 'boxes', tone: 'danger' },
  overstock: { label: 'Overstock', icon: 'boxes', tone: 'info' },
};

export default function AlertsPage({ alerts, onRead, onReadAll, setCurrentPage }) {
  const [filter, setFilter] = useState('All');
  const visibleAlerts = useMemo(() => alerts.filter((alert) => filter === 'All' || alert.type === filter), [alerts, filter]);
  const counts = Object.keys(typeMeta).reduce((total, type) => ({ ...total, [type]: alerts.filter((alert) => !alert.read && alert.type === type).length }), {});

  function handleAction(alert) {
    onRead(alert.id, true);
    setCurrentPage(alert.actionTarget);
  }

  return <>
    <PageTitle eyebrow="CONTROL CENTER" title="Alerts center" description="Resolve the operational signals that protect availability, accuracy, and product freshness." action={<Button variant="secondary" icon="check" onClick={onReadAll}>Mark all as read</Button>} />
    <section className="alert-summary-grid">{Object.entries(typeMeta).map(([type, meta]) => <button className={`alert-summary ${meta.tone} ${filter === type ? 'selected' : ''}`} onClick={() => setFilter(filter === type ? 'All' : type)} key={type}><span><Icon name={meta.icon} size={19} /></span><p><small>{meta.label}</small><strong>{counts[type]}</strong></p><Icon name="chevron" size={16} /></button>)}</section>
    <SectionCard title="All alerts" subtitle={`${alerts.filter((alert) => !alert.read).length} items still need review.`}>
      <div className="alert-tabs">{[['All', 'All alerts'], ['critical', 'Low stock'], ['expiry', 'Expiry (FEFO)'], ['seasonal', 'Seasonal'], ['mismatch', 'Mismatch'], ['overstock', 'Overstock']].map(([id, label]) => <button className={filter === id ? 'active' : ''} onClick={() => setFilter(id)} key={id}>{label}{id === 'All' && <span>{alerts.length}</span>}</button>)}</div>
      <div className="alerts-list">{visibleAlerts.length ? visibleAlerts.map((alert) => { const meta = typeMeta[alert.type]; return <article className={`alert-row ${alert.read ? 'read' : ''}`} key={alert.id}><button className="alert-read-toggle" aria-label={alert.read ? 'Mark as unread' : 'Mark as read'} onClick={() => onRead(alert.id)}><span /></button><span className={`alert-row-icon ${meta.tone}`}><Icon name={meta.icon} size={18} /></span><div className="alert-content"><div><StatusPill tone={meta.tone}>{meta.label}</StatusPill>{!alert.read && <span className="unread-label">New</span>}</div><h3>{alert.title}</h3><p>{alert.detail}</p></div><time>{alert.time}</time><Button variant="secondary" onClick={() => handleAction(alert)}>{alert.action}</Button></article>; }) : <EmptyState icon="check" title="No alerts in this group" detail="Everything in this category is clear for now." />}</div>
    </SectionCard>
  </>;
}
