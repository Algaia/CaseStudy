import { useState } from 'react';
import { formatNumber } from '../data';
import { Button, EmptyState, Icon, PageTitle, SectionCard, StatusPill } from '../components/ui';

export default function PickingPage({ tasks, products, onCompletePick, onReportPickIssue }) {
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id ?? null);
  const selectedTask = tasks.find((task) => task.id === selectedTaskId);
  const product = products.find((item) => item.id === selectedTask?.productId);
  const nextDue = tasks.length ? Math.min(...tasks.map((task) => task.dueInMinutes)) : null;

  function complete() {
    if (selectedTask) {
      onCompletePick(selectedTask);
      setSelectedTaskId(tasks.find((task) => task.id !== selectedTask.id)?.id ?? null);
    }
  }

  return <>
    <PageTitle eyebrow="FULFILLMENT" title="Pick items" description="Follow the guided pick list. FEFO assignments are automatically ordered by the earliest expiry date." />
    <section className="picking-stats"><div><span className="picking-stat-icon"><Icon name="checklist" /></span><p><strong>{tasks.length}</strong><small>Open pick tasks</small></p></div><div><span className="picking-stat-icon warning"><Icon name="calendar" /></span><p><strong>{tasks.filter((task) => task.priority === 'FEFO priority').length}</strong><small>FEFO priority</small></p></div><div><span className="picking-stat-icon success"><Icon name="clock" /></span><p><strong>{nextDue !== null ? `${nextDue} min` : '—'}</strong><small>Next task deadline</small></p></div></section>
    <div className="pick-layout">
      <SectionCard title="Active pick queue" subtitle="Choose a task to see its exact location and lot assignment.">
        <div className="pick-queue">{tasks.length ? tasks.map((task) => <button key={task.id} onClick={() => setSelectedTaskId(task.id)} className={`pick-task ${selectedTaskId === task.id ? 'selected' : ''}`}><span className={`pick-priority ${task.priority === 'FEFO priority' ? 'fefo' : task.priority === 'Count check' ? 'count' : ''}`}><Icon name={task.priority === 'FEFO priority' ? 'calendar' : task.priority === 'Count check' ? 'warning' : 'checklist'} size={17} /></span><span className="pick-task-main"><strong>{task.order}</strong><small>{products.find((item) => item.id === task.productId)?.name}</small><em>{task.priority}</em></span><span className="pick-quantity">{task.quantity}<small>units</small></span><Icon name="chevron" size={17} /></button>) : <EmptyState icon="check" title="All picks are complete" detail="There are no open picking tasks right now." />}</div>
      </SectionCard>
      {selectedTask && product ? <SectionCard title="Pick instructions" subtitle={`${selectedTask.id} - ${selectedTask.customer}`}>
        <div className="pick-instructions"><div className="instruction-hero"><span className="instruction-number">1</span><div><p>Go to warehouse location</p><h2><Icon name="location" size={22} /> {selectedTask.location}</h2><small>Aisle and bin are verified against the current lot location.</small></div></div><div className="instruction-hero"><span className="instruction-number">2</span><div><p>Pick this exact lot</p><h2>{selectedTask.lot}</h2><small>{selectedTask.priority === 'FEFO priority' ? `Earliest expiry: ${selectedTask.expiry}` : 'Assigned current lot'} </small></div><StatusPill tone={selectedTask.priority === 'FEFO priority' ? 'warning' : 'neutral'}>{selectedTask.priority}</StatusPill></div></div>
        <div className="pick-product"><div className="product-preview-icon"><Icon name="boxes" size={24} /></div><div><p>{product.id}</p><h3>{product.name}</h3><small>{formatNumber(product.available)} units currently available</small></div><div className="pick-amount"><span>Quantity to pick</span><strong>{selectedTask.quantity}</strong><small>units</small></div></div>
        {selectedTask.priority === 'Count check' && <div className="count-warning"><Icon name="warning" size={18} /><span><strong>Physical count required</strong> Confirm the shelf quantity before completing this pick because this product has an open mismatch alert.</span></div>}
        <div className="form-actions"><Button variant="secondary" icon="external" onClick={() => onReportPickIssue(selectedTask)}>Report issue</Button><Button icon="check" onClick={complete}>Complete pick</Button></div>
      </SectionCard> : <SectionCard><EmptyState icon="check" title="Pick queue cleared" detail="New orders will appear here as they are released." /></SectionCard>}
    </div>
  </>;
}
