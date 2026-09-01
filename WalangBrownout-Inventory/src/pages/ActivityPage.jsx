import { useMemo, useState } from 'react';
import { Button, Icon, PageTitle, SectionCard, StatusPill } from '../components/ui';

const eventTone = { warning: 'danger', receive: 'success', pick: 'blue', settings: 'violet', order: 'amber' };
const eventIcon = { warning: 'warning', receive: 'inbox', pick: 'check', settings: 'trend', order: 'report' };

export default function ActivityPage({ activity, onExport }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All activities');
  const visible = useMemo(() => activity.filter((entry) => `${entry.event} ${entry.reference} ${entry.person}`.toLowerCase().includes(query.toLowerCase()) && (filter === 'All activities' || entry.kind === filter)), [activity, query, filter]);
  return <>
    <PageTitle eyebrow="ACCOUNTABILITY" title="Activity log" description="Every stock movement, adjustment, and purchasing action is retained with its user and timestamp." action={<Button icon="download" onClick={() => onExport('activity', activity)}>Export audit log</Button>} />
    <SectionCard title="Immutable event history" subtitle="Records are displayed newest first and cannot be edited from the client.">
      <div className="toolbar"><div className="search-field"><Icon name="search" size={18} /><input value={query} placeholder="Search event, reference, or team member" onChange={(event) => setQuery(event.target.value)} /></div><div className="filter-select"><Icon name="filter" size={16} /><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All activities</option><option value="receive">receive</option><option value="pick">pick</option><option value="warning">warning</option><option value="order">order</option><option value="settings">settings</option></select><Icon name="down" size={15} /></div></div>
      <div className="table-scroll"><table className="data-table activity-table"><thead><tr><th>Event</th><th>Reference</th><th>Performed by</th><th>Timestamp</th><th>Record state</th></tr></thead><tbody>{visible.map((entry) => <tr key={entry.id}><td><span className={`activity-event-icon ${eventTone[entry.kind]}`}><Icon name={eventIcon[entry.kind]} size={16} /></span><strong>{entry.event}</strong></td><td>{entry.reference}</td><td><div className="staff-cell"><span>{entry.person.split(' ').map((part) => part[0]).join('')}</span><div><strong>{entry.person}</strong><small>{entry.role}</small></div></div></td><td>{entry.time}</td><td><StatusPill tone="success">Recorded</StatusPill></td></tr>)}</tbody></table></div>
    </SectionCard>
  </>;
}
