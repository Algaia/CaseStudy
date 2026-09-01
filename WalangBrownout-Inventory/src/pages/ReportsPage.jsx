import { Button, Icon, PageTitle, SectionCard, StatusPill } from '../components/ui';

const reports = [
  { id: 'inventory', title: 'Inventory balance report', detail: 'On-hand, available, reorder points, and storage locations for all active products.', type: 'CSV', icon: 'boxes', updated: 'Updated just now' },
  { id: 'expiry', title: 'Expiry and FEFO report', detail: 'Filter lots ranked by expiry date, location, and pick priority.', type: 'CSV', icon: 'calendar', updated: 'Updated 18 min ago' },
  { id: 'writeoff', title: 'Write-off report', detail: 'Damaged or expired inventory records prepared for accounting review.', type: 'CSV', icon: 'warning', updated: 'No new write-offs' },
  { id: 'activity', title: 'Inventory activity audit', detail: 'Traceable timeline of stock, picking, and purchasing events.', type: 'CSV', icon: 'clock', updated: 'Updated just now' },
];

export default function ReportsPage({ products, lots, activity, onExport }) {
  const sourceFor = (id) => id === 'inventory' ? products : id === 'expiry' ? lots : id === 'activity' ? activity : [];
  return <>
    <PageTitle eyebrow="REPORTING" title="Reports & exports" description="Prepare clean operational exports for accounting, purchasing, and warehouse review." />
    <section className="report-highlight"><div><span className="report-highlight-icon"><Icon name="report" size={28} /></span><p className="eyebrow">SCHEDULED REPORTING</p><h2>Keep accounting in sync</h2><p>Export the latest inventory and write-off records any time. Files are generated using the live data currently displayed in this workspace.</p></div><Button icon="download" onClick={() => onExport('inventory', products)}>Export inventory</Button></section>
    <SectionCard title="Available exports" subtitle="CSV exports open in Excel, Google Sheets, or any accounting workflow.">
      <div className="report-grid">{reports.map((report) => <article className="report-card" key={report.id}><span className="report-icon"><Icon name={report.icon} size={22} /></span><div><StatusPill tone="neutral">{report.type}</StatusPill><h3>{report.title}</h3><p>{report.detail}</p></div><footer><span className={report.updated.startsWith('No') ? 'muted' : 'fresh-dot'}>{report.updated}</span><Button variant="secondary" icon="download" disabled={report.id === 'writeoff'} onClick={() => onExport(report.id, sourceFor(report.id))}>{report.id === 'writeoff' ? 'No records' : 'Download'}</Button></footer></article>)}</div>
    </SectionCard>
    <SectionCard title="Export guidance" subtitle="Use the right report for each downstream workflow.">
      <div className="guidance-grid"><div><Icon name="boxes" size={19} /><p><strong>Warehouse check</strong><small>Use Inventory balance before performing a cycle count.</small></p></div><div><Icon name="calendar" size={19} /><p><strong>FEFO planning</strong><small>Use Expiry and FEFO to clear aging filter stock first.</small></p></div><div><Icon name="report" size={19} /><p><strong>Accounting handoff</strong><small>Use Write-off records when a loss is approved.</small></p></div></div>
    </SectionCard>
  </>;
}
