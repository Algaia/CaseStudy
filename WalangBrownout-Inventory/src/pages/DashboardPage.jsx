import { formatNumber } from '../data';
import { Button, Icon, MetricCard, PageTitle, SectionCard, StatusPill } from '../components/ui';

const statusTone = { 'Reorder now': 'danger', 'Expiry watch': 'warning', Critical: 'danger', Healthy: 'success' };

export default function DashboardPage({ user, products, alerts, activity, tasks, setCurrentPage, onRefresh }) {
  const totalUnits = products.reduce((total, product) => total + product.onHand, 0);
  const healthy = products.filter((product) => product.status === 'Healthy').length;
  const alerting = alerts.filter((alert) => !alert.read);
  const riskProducts = products.filter((product) => product.status !== 'Healthy');
  const fefoTasks = tasks.filter((task) => task.priority === 'FEFO priority').length;

  return <>
    <PageTitle
      eyebrow="OVERVIEW"
      title={`Good morning, ${user.name.split(' ')[0]}`}
      description="Here is a live view of WalangBrownout warehouse operations."
      action={<Button variant="secondary" icon="refresh" onClick={onRefresh}>Refresh view</Button>}
    />
    <section className="metrics-grid">
      <MetricCard label="Units on hand" value={formatNumber(totalUnits)} helper={`across ${products.length} active products`} icon="boxes" trend={{ direction: 'neutral', text: 'Live total' }} />
      <MetricCard label="Needs attention" value={riskProducts.length} helper="reorder, expiry, or count review" tone="amber" icon="warning" trend={{ direction: 'down', text: `${alerting.length} unresolved alerts` }} />
      <MetricCard label="Inventory health" value={`${Math.round((healthy / products.length) * 100)}%`} helper="products within target levels" tone="green" icon="check" trend={{ direction: 'up', text: '3% from last week' }} />
      <MetricCard label="Open pick tasks" value={tasks.length} helper={`${fefoTasks} with FEFO priority`} tone="violet" icon="checklist" trend={{ direction: 'neutral', text: 'Next due in 18 min' }} />
    </section>
    <section className="dashboard-grid top-grid">
      <SectionCard title="Attention needed" subtitle="Prioritize these live operational signals" action={<Button variant="text" onClick={() => setCurrentPage('alerts')}>View all <Icon name="arrow" size={15} /></Button>}>
        <div className="attention-list">
          {alerting.slice(0, 3).map((alert) => <button className={`attention-item ${alert.type}`} key={alert.id} onClick={() => setCurrentPage(alert.actionTarget)}>
            <span className="attention-icon"><Icon name={alert.type === 'seasonal' ? 'trend' : alert.type === 'expiry' ? 'calendar' : 'warning'} size={18} /></span>
            <span><strong>{alert.title}</strong><small>{alert.detail}</small></span>
            <Icon name="chevron" size={18} />
          </button>)}
        </div>
      </SectionCard>
      <SectionCard title="Stock health" subtitle="Coverage against reorder thresholds" action={<Button variant="text" onClick={() => setCurrentPage('inventory')}>Open inventory <Icon name="arrow" size={15} /></Button>}>
        <div className="stock-health-list">
          {products.slice(0, 4).map((product) => {
            const percent = Math.min(100, Math.round((product.available / product.maxStock) * 100));
            return <div className="stock-health-row" key={product.id}>
              <div><strong>{product.name}</strong><small>{product.id} - {product.available} available</small></div>
              <div className="stock-progress"><div className="progress-track"><span className={product.status === 'Healthy' ? 'good' : 'at-risk'} style={{ width: `${percent}%` }} /></div><small>{percent}% target</small></div>
            </div>;
          })}
        </div>
      </SectionCard>
    </section>
    <section className="dashboard-grid bottom-grid">
      <SectionCard title="Products requiring review" subtitle="Live quantities and smart status" action={<Button variant="text" onClick={() => setCurrentPage('inventory')}>Manage inventory <Icon name="arrow" size={15} /></Button>}>
        <div className="table-scroll"><table className="data-table compact-table"><thead><tr><th>Product</th><th>Available</th><th>Location</th><th>Status</th></tr></thead><tbody>{riskProducts.map((product) => <tr key={product.id}><td><strong>{product.name}</strong><small>{product.id}</small></td><td><strong>{formatNumber(product.available)}</strong><small>ROP {product.reorderPoint}</small></td><td><span className="location-cell"><Icon name="location" size={14} />{product.location}</span></td><td><StatusPill tone={statusTone[product.status]}>{product.status}</StatusPill></td></tr>)}</tbody></table></div>
      </SectionCard>
      <SectionCard title="Recent activity" subtitle="Immutable warehouse activity log" action={<Button variant="text" onClick={() => setCurrentPage('activity')}>View log <Icon name="arrow" size={15} /></Button>}>
        <div className="timeline">{activity.slice(0, 4).map((entry) => <div className="timeline-item" key={entry.id}><span className={`timeline-icon ${entry.kind}`}><Icon name={entry.kind === 'pick' ? 'check' : entry.kind === 'receive' ? 'inbox' : entry.kind === 'warning' ? 'warning' : 'clock'} size={15} /></span><div><strong>{entry.event}</strong><p>{entry.reference} <span>by {entry.person}</span></p></div><time>{entry.time.replace('Today, ', '')}</time></div>)}</div>
      </SectionCard>
    </section>
  </>;
}
