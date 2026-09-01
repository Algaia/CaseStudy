import { useState } from 'react';
import { formatNumber } from '../data';
import { Button, Icon, MetricCard, PageTitle, SectionCard, StatusPill } from '../components/ui';

export default function ReorderPage({ recommendations, onCreatePO }) {
  const [selectedId, setSelectedId] = useState(recommendations[0].id);
  const selected = recommendations.find((item) => item.id === selectedId) || recommendations[0];
  const created = selected?.created;
  return <>
    <PageTitle eyebrow="PROCUREMENT" title="Reorder recommendations" description="Recommendations combine live stock, supplier lead time, safety stock, and seasonality." action={<Button variant="secondary" icon="download">Export plan</Button>} />
    <section className="metrics-grid reorder-metrics"><MetricCard label="Recommendations" value={recommendations.filter((item) => item.suggestedOrder > 0).length} helper="require procurement action" tone="amber" icon="warning" /><MetricCard label="Peak season" value="6 weeks" helper="until portable AC demand rises" tone="violet" icon="calendar" /><MetricCard label="Projected coverage" value="92%" helper="after suggested purchase orders" tone="green" icon="trend" /></section>
    <div className="reorder-layout">
      <SectionCard title="Suggested actions" subtitle="Review a product to see the calculation behind its recommendation.">
        <div className="reorder-list">{recommendations.map((item) => <button className={`reorder-item ${selectedId === item.id ? 'selected' : ''}`} key={item.id} onClick={() => setSelectedId(item.id)}><div><span className="reorder-product-icon"><Icon name={item.id.startsWith('PAC') ? 'trend' : 'boxes'} size={19} /></span><p><strong>{item.product}</strong><small>{item.rule}</small></p></div><div className="reorder-units"><strong>{item.suggestedOrder || '—'}</strong><small>suggested units</small></div><StatusPill tone={item.status === 'Act now' ? 'danger' : 'neutral'}>{item.created ? 'PO created' : item.status}</StatusPill><Icon name="chevron" size={17} /></button>)}</div>
      </SectionCard>
      <SectionCard title="Recommendation details" subtitle={selected.rule}>
        <div className="recommendation-detail"><div className="recommendation-heading"><div className="product-preview-icon"><Icon name={selected.id.startsWith('PAC') ? 'trend' : 'boxes'} size={24} /></div><div><p>{selected.id}</p><h3>{selected.product}</h3><small>Supplier lead time: {selected.leadTime}</small></div><StatusPill tone={selected.status === 'Act now' ? 'danger' : 'neutral'}>{created ? 'PO created' : selected.status}</StatusPill></div><div className="calculation-grid"><div><span>Available now</span><strong>{formatNumber(selected.onHand)}</strong></div><div><span>Reorder point</span><strong>{formatNumber(selected.reorderPoint)}</strong></div><div><span>Lead-time forecast</span><strong>{formatNumber(selected.forecast)}</strong></div><div className="highlight"><span>Suggested order</span><strong>{formatNumber(selected.suggestedOrder)}</strong></div></div><div className="formula-card"><p><Icon name="trend" size={17} /> Calculation logic</p><strong>{selected.id.startsWith('PAC') ? 'Forecasted peak demand + season-adjusted safety stock - available inventory' : 'Expected lead-time demand + safety stock - available inventory'}</strong><small>{selected.id.startsWith('PAC') ? 'The seasonal factor is active because the June AC demand window is approaching.' : 'A steady demand rule is applied because this product has no seasonal peak.'}</small></div><div className="form-actions"><Button variant="secondary" icon="external">Adjust rule</Button><Button icon="plus" disabled={!selected.suggestedOrder || created} onClick={() => onCreatePO(selected.id)}>{created ? 'Purchase order created' : `Create PO for ${formatNumber(selected.suggestedOrder)} units`}</Button></div></div>
      </SectionCard>
    </div>
  </>;
}
