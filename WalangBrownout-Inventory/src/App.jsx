import { useEffect, useState } from 'react';
import {
  initialActivity,
  initialAlerts,
  initialLots,
  initialProducts,
  pickTasks,
  reorderRecommendations,
  roleAccess,
} from './data';
import { AppLayout } from './components/layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ReceiveStockPage from './pages/ReceiveStockPage';
import InventoryPage from './pages/InventoryPage';
import PickingPage from './pages/PickingPage';
import ReorderPage from './pages/ReorderPage';
import AlertsPage from './pages/AlertsPage';
import ActivityPage from './pages/ActivityPage';
import ReportsPage from './pages/ReportsPage';
import { Icon } from './components/ui';

const pageComponents = {
  dashboard: DashboardPage,
  receive: ReceiveStockPage,
  inventory: InventoryPage,
  picking: PickingPage,
  reorder: ReorderPage,
  alerts: AlertsPage,
  activity: ActivityPage,
  reports: ReportsPage,
};

function createEvent(event, reference, user, kind) {
  return { id: `${Date.now()}-${event}`, event, reference, person: user.name, role: user.role, time: 'Just now', kind };
}

function toCsv(rows) {
  if (!rows.length) return 'No records available\n';
  const headers = Object.keys(rows[0]);
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return [headers.map(escape).join(','), ...rows.map((row) => headers.map((header) => escape(row[header])).join(','))].join('\n');
}

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [products, setProducts] = useState(initialProducts);
  const [lots, setLots] = useState(initialLots);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [activity, setActivity] = useState(initialActivity);
  const [tasks, setTasks] = useState(pickTasks);
  const [recommendations, setRecommendations] = useState(reorderRecommendations);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 3800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function showToast(message, tone = 'success') {
    setToast({ message, tone });
  }

  function login(nextUser) {
    setUser(nextUser);
    setCurrentPage('dashboard');
    showToast(`Signed in as ${nextUser.role}.`);
  }

  function logout() {
    setUser(null);
    setMenuOpen(false);
    setToast(null);
  }

  function changePage(page) {
    if (user && roleAccess[user.role].includes(page)) setCurrentPage(page);
    else if (user) {
      setCurrentPage('dashboard');
      showToast('That workspace is not available for the current role.', 'warning');
    }
  }

  function receiveStock(receipt) {
    const { product, quantity, lot, received, expires, location } = receipt;
    setProducts((current) => current.map((item) => item.id === product.id ? { ...item, onHand: item.onHand + quantity, available: item.available + quantity, lastUpdated: 'Just now', status: item.available + quantity >= item.reorderPoint ? (item.status === 'Critical' || item.status === 'Reorder now' ? 'Healthy' : item.status) : item.status } : item));
    setLots((current) => [{ id: lot, productId: product.id, received, expires: expires || null, quantity, location, state: expires ? 'Available' : 'Available' }, ...current]);
    setActivity((current) => [createEvent('Shipment received', `${lot} - ${quantity} units`, user, 'receive'), ...current]);
    showToast(`${quantity} units of ${product.id} received and recorded.`);
  }

  function completePick(task) {
    setTasks((current) => current.filter((item) => item.id !== task.id));
    setProducts((current) => current.map((item) => item.id === task.productId ? { ...item, onHand: Math.max(0, item.onHand - task.quantity), available: Math.max(0, item.available - task.quantity), lastUpdated: 'Just now' } : item));
    setLots((current) => current.map((lot) => lot.id === task.lot ? { ...lot, quantity: Math.max(0, lot.quantity - task.quantity) } : lot));
    setActivity((current) => [createEvent('FEFO pick completed', `${task.lot} - ${task.quantity} units`, user, 'pick'), ...current]);
    setAlerts((current) => task.priority === 'FEFO priority' ? current.map((alert) => alert.type === 'expiry' ? { ...alert, read: true } : alert) : current);
    showToast(`${task.order} marked complete. Live inventory has been updated.`);
  }

  function createPurchaseOrder(id) {
    const recommendation = recommendations.find((item) => item.id === id);
    if (!recommendation || recommendation.created) return;
    const poNumber = `PO-2026-${String(149 + activity.length).padStart(4, '0')}`;
    setRecommendations((current) => current.map((item) => item.id === id ? { ...item, created: true } : item));
    setActivity((current) => [createEvent('Purchase order created', `${poNumber} - ${recommendation.suggestedOrder} ${recommendation.id} units`, user, 'order'), ...current]);
    setAlerts((current) => current.map((alert) => alert.actionTarget === 'reorder' && alert.title.includes(recommendation.id.startsWith('PAC') ? 'Portable AC' : 'ThermoLink') ? { ...alert, read: true } : alert));
    showToast(`${poNumber} created for ${recommendation.suggestedOrder} units.`);
  }

  function toggleAlertRead(id, markRead) {
    setAlerts((current) => current.map((alert) => alert.id === id ? { ...alert, read: typeof markRead === 'boolean' ? markRead : !alert.read } : alert));
  }

  function markAllRead() {
    setAlerts((current) => current.map((alert) => ({ ...alert, read: true })));
    showToast('All alerts marked as read.');
  }

  function exportCsv(name, rows) {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = `walangbrownout-${name}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(href);
    showToast(`${name.replaceAll('-', ' ')} export downloaded.`);
  }

  if (!user) return <LoginPage onLogin={login} />;

  const Page = pageComponents[currentPage] || DashboardPage;
  const pageProps = {
    user,
    products,
    lots,
    alerts,
    activity,
    tasks,
    recommendations,
    setCurrentPage: changePage,
    onReceive: receiveStock,
    onCompletePick: completePick,
    onCreatePO: createPurchaseOrder,
    onRead: toggleAlertRead,
    onReadAll: markAllRead,
    onExport: exportCsv,
    onRefresh: () => showToast('Live inventory is already synchronized.'),
  };

  return <AppLayout currentPage={currentPage} setCurrentPage={changePage} user={user} onLogout={logout} alerts={alerts} menuOpen={menuOpen} setMenuOpen={setMenuOpen}>
    <Page {...pageProps} />
    {toast && <div className={`toast ${toast.tone}`} role="status"><Icon name={toast.tone === 'warning' ? 'warning' : 'check'} size={18} />{toast.message}</div>}
  </AppLayout>;
}
