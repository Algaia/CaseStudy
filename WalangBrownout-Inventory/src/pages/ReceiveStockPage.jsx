import { useEffect, useState } from 'react';
import { formatNumber } from '../data';
import { Button, Icon, PageTitle, SectionCard } from '../components/ui';

const today = () => new Date().toISOString().slice(0, 10);

export default function ReceiveStockPage({ products, lots, onReceive }) {
  const [productId, setProductId] = useState(products[0]?.id ?? '');
  const [quantity, setQuantity] = useState('');
  const [lot, setLot] = useState('');
  const [received, setReceived] = useState(today());
  const [expires, setExpires] = useState('');
  const [location, setLocation] = useState(products[0]?.location ?? '');
  const [justReceived, setJustReceived] = useState(null);

  const product = products.find((item) => item.id === productId) || products[0];

  useEffect(() => {
    if (!justReceived) return undefined;
    const timeout = window.setTimeout(() => setJustReceived(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [justReceived]);

  function selectProduct(id) {
    setProductId(id);
    const next = products.find((item) => item.id === id);
    if (next) setLocation(next.location);
  }

  function submit(event) {
    event.preventDefault();
    if (!product || !quantity || !lot.trim() || !received) return;
    const receipt = { product, quantity: Number(quantity), lot: lot.trim(), received, expires: expires || null, location };
    onReceive(receipt);
    setJustReceived({ lot: receipt.lot, quantity: receipt.quantity });
    setQuantity('');
    setLot('');
    setExpires('');
  }

  const recentLots = lots.slice(0, 4);
  const loggedToday = lots.filter((item) => item.received === today());
  const unitsToday = loggedToday.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <PageTitle eyebrow="RECEIVING" title="Receive stock" description="Log every incoming shipment the moment it arrives so live inventory stays accurate." />
      <div className="receive-layout">
        <SectionCard title="Log new shipment" subtitle="Batch number and arrival date are required for FEFO and expiry tracking.">
          <form className="receive-form" onSubmit={submit}>
            <div className="form-grid two">
              <div>
                <label htmlFor="product">Product</label>
                <div className="select-wrap">
                  <select id="product" value={productId} onChange={(event) => selectProduct(event.target.value)}>
                    {products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                  <Icon name="down" size={16} />
                </div>
              </div>
              <div>
                <label htmlFor="quantity">Quantity received</label>
                <input id="quantity" type="number" min="1" required value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="e.g. 48" />
              </div>
              <div>
                <label htmlFor="lot">Lot / batch number</label>
                <input id="lot" type="text" required value={lot} onChange={(event) => setLot(event.target.value)} placeholder="e.g. F-0715" />
                <span className="field-help">Printed on the shipment's packing slip.</span>
              </div>
              <div>
                <label htmlFor="location">Storage location</label>
                <div className="location-input">
                  <Icon name="location" size={16} />
                  <input id="location" type="text" required value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. A-04-12" />
                </div>
              </div>
              <div>
                <label htmlFor="received">Date received</label>
                <input id="received" type="date" required value={received} onChange={(event) => setReceived(event.target.value)} />
              </div>
              <div>
                <label htmlFor="expires">Expiry date</label>
                <input id="expires" type="date" value={expires} onChange={(event) => setExpires(event.target.value)} />
                <span className="field-help">Leave blank for items with no expiration, like AC units or thermostats.</span>
              </div>
              <div className="full-width">
                <label htmlFor="supplier">Supplier</label>
                <input id="supplier" className="read-only" type="text" readOnly value={product?.supplier ?? ''} />
              </div>
            </div>
            <div className="form-actions">
              <Button type="button" variant="secondary" onClick={() => { setQuantity(''); setLot(''); setExpires(''); }}>Clear</Button>
              <Button type="submit" icon="check">Log shipment</Button>
            </div>
            {justReceived && <div className="form-success"><Icon name="check" size={16} />{justReceived.quantity} units logged to lot {justReceived.lot}. Live inventory has been updated.</div>}
          </form>
        </SectionCard>
        <div className="receive-side">
          {product && <SectionCard>
            <div className="product-preview">
              <span className="product-preview-icon"><Icon name="boxes" size={22} /></span>
              <div>
                <p>{product.id}</p>
                <h3>{product.name}</h3>
              </div>
            </div>
            <dl className="preview-list">
              <div><dt>On hand</dt><dd>{formatNumber(product.onHand)}</dd></div>
              <div><dt>Available</dt><dd>{formatNumber(product.available)}</dd></div>
              <div><dt>Reorder point</dt><dd>{formatNumber(product.reorderPoint)}</dd></div>
              <div><dt>Logged today</dt><dd className="positive">+{formatNumber(unitsToday)} units</dd></div>
            </dl>
          </SectionCard>}
          <SectionCard title="Recent shipments" subtitle="Latest lots added to inventory.">
            <div className="mini-lot-list">
              {recentLots.map((item) => (
                <div key={item.id}>
                  <span className="mini-lot-icon"><Icon name="inbox" size={14} /></span>
                  <p><strong>{item.id}</strong><small>{item.quantity} units - {item.location}</small></p>
                  <time>{item.received}</time>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  );
}
