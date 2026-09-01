import { useMemo, useState } from 'react';
import { formatNumber } from '../data';
import { Button, EmptyState, Icon, PageTitle, SectionCard, StatusPill } from '../components/ui';

const toneForStatus = (status) => ({ Healthy: 'success', 'Expiry watch': 'warning', 'Reorder now': 'danger', Critical: 'danger' }[status] || 'neutral');

export default function InventoryPage({ products, lots, setCurrentPage }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [selected, setSelected] = useState(products[0]);
  const filtered = useMemo(() => products.filter((product) => {
    const matchSearch = `${product.name} ${product.id} ${product.category}`.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (status === 'All' || product.status === status);
  }), [products, search, status]);
  const productLots = lots.filter((lot) => lot.productId === selected?.id);

  return (
    <div className="page-stack">
      <PageTitle
        eyebrow="LIVE INVENTORY"
        title="Inventory"
        description="Search current product balances, batch locations, and operational status."
        action={<Button icon="plus" onClick={() => setCurrentPage('receive')}>Receive stock</Button>}
      />

      <SectionCard className="inventory-card">
        <div className="toolbar">
          <div className="search-field"><Icon name="search" size={18} /><input value={search} placeholder="Search product name, SKU, or category" onChange={(event) => setSearch(event.target.value)} /></div>
          <div className="filter-select"><Icon name="filter" size={16} /><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option><option>Healthy</option><option>Expiry watch</option><option>Reorder now</option><option>Critical</option></select><Icon name="down" size={15} /></div>
        </div>
        <div className="inventory-summary"><span><strong>{filtered.length}</strong> products shown</span><span className="summary-dot" /><span>Live quantities include received, picked, and adjusted stock.</span></div>
        <div className="table-scroll">
          <table className="data-table inventory-table">
            <thead><tr><th>Product</th><th>On hand</th><th>Available</th><th>Reorder point</th><th>Location</th><th>Type</th><th>Status</th><th aria-label="View product" /></tr></thead>
            <tbody>{filtered.map((product) => (
              <tr key={product.id} className={selected?.id === product.id ? 'selected-row' : ''}>
                <td><button className="product-cell" onClick={() => setSelected(product)}><span className="sku-box">{product.id.slice(0, 2)}</span><span><strong>{product.name}</strong><small>{product.id} - {product.category}</small></span></button></td>
                <td>{formatNumber(product.onHand)}</td><td><strong>{formatNumber(product.available)}</strong></td><td>{formatNumber(product.reorderPoint)}</td>
                <td><span className="location-cell"><Icon name="location" size={14} />{product.location}</span></td>
                <td><StatusPill tone={product.velocity === 'Seasonal' ? 'violet' : 'neutral'}>{product.velocity}</StatusPill></td>
                <td><StatusPill tone={toneForStatus(product.status)}>{product.status}</StatusPill></td>
                <td><button className="icon-button" onClick={() => setSelected(product)} aria-label={`View ${product.name}`}><Icon name="chevron" size={17} /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {!filtered.length && <EmptyState icon="search" title="No products found" detail="Try a different keyword or remove the status filter." />}
      </SectionCard>

      {selected ? (
        <SectionCard
          title={`${selected.name} - batch details`}
          subtitle={`SKU ${selected.id} - ${selected.location}`}
          action={<Button variant="text" onClick={() => setCurrentPage(selected.status === 'Expiry watch' ? 'picking' : 'reorder')}>{selected.status === 'Expiry watch' ? 'Open pick queue' : 'Open reorder plan'}<Icon name="arrow" size={15} /></Button>}
        >
          <div className="product-detail-grid">
            <div className="detail-stats"><div><span>On hand</span><strong>{formatNumber(selected.onHand)}</strong></div><div><span>Available</span><strong>{formatNumber(selected.available)}</strong></div><div><span>Reorder point</span><strong>{formatNumber(selected.reorderPoint)}</strong></div><div><span>Supplier</span><strong>{selected.supplier}</strong></div></div>
            <div className="lots-panel">
              <h3>Lots at this location</h3>
              {productLots.length ? <div className="table-scroll"><table className="data-table compact-table"><thead><tr><th>Lot</th><th>Quantity</th><th>Expires</th><th>Pick state</th></tr></thead><tbody>{productLots.map((lot) => <tr key={lot.id}><td><strong>{lot.id}</strong></td><td>{lot.quantity}</td><td>{lot.expires || 'Not applicable'}</td><td><StatusPill tone={lot.state === 'Pick first' ? 'warning' : 'neutral'}>{lot.state}</StatusPill></td></tr>)}</tbody></table></div> : <p className="no-lots">No lot-level records are available for this product.</p>}
            </div>
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
