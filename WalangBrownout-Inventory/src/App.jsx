import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { roleAccess } from './data';
import * as api from './api/realApi';
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
import { Button, Icon } from './components/ui';

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

/** Loading state while the fake API "request" is in flight — see src/api/fakeApi.js. */
function WorkspaceLoading() {
  return (
    <div className="workspace-status">
      <div className="spinner" aria-hidden="true" />
      <p>Loading live inventory workspace…</p>
    </div>
  );
}

/** Error state if the fake API "request" rejects. Try loading the app with ?apiError=1. */
function WorkspaceError({ message, onRetry }) {
  return (
    <div className="workspace-status">
      <Icon name="warning" size={28} />
      <p>{message}</p>
      <Button icon="refresh" onClick={onRetry}>Try again</Button>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestId, setRequestId] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname.replace('/', '') || 'dashboard';

  // Fetch the workspace data the same way a real REST call would be
  // consumed: useEffect on mount, loading state while it's pending, error
  // state if it fails. See src/api/fakeApi.js for what's actually happening
  // under the hood for this frontend-only midterm scope.
  useEffect(() => {
    let cancelled = false;
    fetchInventoryWorkspace()
      .then((data) => { if (!cancelled) setWorkspace(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [requestId]);

  function retryFetch() {
    setLoading(true);
    setError(null);
    setRequestId((id) => id + 1);
  }

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 3800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  // Guard against a role-restricted URL being typed directly, bookmarked, or
  // reached via browser back/forward, since routing now lives in the URL.
  useEffect(() => {
    if (!user || !workspace) return;
    if (!roleAccess[user.role].includes(currentPage)) {
      navigate('/dashboard', { replace: true });
      showToast('That workspace is not available for the current role.', 'warning');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, workspace, currentPage]);

  function showToast(message, tone = 'success') {
    setToast({ message, tone });
  }

  function login(nextUser) {
    setUser(nextUser);
    navigate('/dashboard');
    showToast(`Signed in as ${nextUser.role}.`);
  }

  function logout() {
    setUser(null);
    setMenuOpen(false);
    setToast(null);
  }

  function changePage(page) {
    if (user && roleAccess[user.role].includes(page)) navigate(`/${page}`);
    else if (user) {
      navigate('/dashboard');
      showToast('That workspace is not available for the current role.', 'warning');
    }
  }

  function updateWorkspace(updater) {
    setWorkspace((current) => ({ ...current, ...updater(current) }));
  }

  function receiveStock(receipt) {
    const { product, quantity, lot, received, expires, location: loc } = receipt;
    updateWorkspace((current) => ({
      products: current.products.map((item) => item.id === product.id ? { ...item, onHand: item.onHand + quantity, available: item.available + quantity, lastUpdated: 'Just now', status: item.available + quantity >= item.reorderPoint ? (item.status === 'Critical' || item.status === 'Reorder now' ? 'Healthy' : item.status) : item.status } : item),
      lots: [{ id: lot, productId: product.id, received, expires: expires || null, quantity, location: loc, state: 'Available' }, ...current.lots],
      activity: [createEvent('Shipment received', `${lot} - ${quantity} units`, user, 'receive'), ...current.activity],
    }));
    showToast(`${quantity} units of ${product.id} received and recorded.`);
  }

  function completePick(task) {
    updateWorkspace((current) => ({
      tasks: current.tasks.filter((item) => item.id !== task.id),
      products: current.products.map((item) => item.id === task.productId ? { ...item, onHand: Math.max(0, item.onHand - task.quantity), available: Math.max(0, item.available - task.quantity), lastUpdated: 'Just now' } : item),
      lots: current.lots.map((lot) => lot.id === task.lot ? { ...lot, quantity: Math.max(0, lot.quantity - task.quantity) } : lot),
      activity: [createEvent('FEFO pick completed', `${task.lot} - ${task.quantity} units`, user, 'pick'), ...current.activity],
      alerts: task.priority === 'FEFO priority' ? current.alerts.map((alert) => alert.type === 'expiry' && alert.productId === task.productId ? { ...alert, read: true } : alert) : current.alerts,
    }));
    showToast(`${task.order} marked complete. Live inventory has been updated.`);
  }

  function createPurchaseOrder(id) {
    const recommendation = workspace.recommendations.find((item) => item.id === id);
    if (!recommendation || recommendation.created) return;
    const poNumber = `PO-2026-${String(149 + workspace.activity.length).padStart(4, '0')}`;
    updateWorkspace((current) => ({
      recommendations: current.recommendations.map((item) => item.id === id ? { ...item, created: true } : item),
      activity: [createEvent('Purchase order created', `${poNumber} - ${recommendation.suggestedOrder} ${recommendation.id} units`, user, 'order'), ...current.activity],
      alerts: current.alerts.map((alert) => alert.productId === recommendation.id ? { ...alert, read: true } : alert),
    }));
    showToast(`${poNumber} created for ${recommendation.suggestedOrder} units.`);
  }

  function writeOffLot(lot, product, reason) {
    if (!lot.quantity) return;
    updateWorkspace((current) => ({
      products: current.products.map((item) => item.id === product.id ? { ...item, onHand: Math.max(0, item.onHand - lot.quantity), available: Math.max(0, item.available - lot.quantity), lastUpdated: 'Just now' } : item),
      lots: current.lots.filter((item) => item.id !== lot.id),
      writeoffs: [{ id: `WO-${Date.now()}`, lotId: lot.id, productId: product.id, quantity: lot.quantity, reason, date: new Date().toISOString().slice(0, 10), person: user.name }, ...current.writeoffs],
      activity: [createEvent('Stock written off', `${lot.id} - ${lot.quantity} units (${reason})`, user, 'warning'), ...current.activity],
    }));
    showToast(`${lot.quantity} units from lot ${lot.id} were written off.`);
  }

  function reportPickIssue(task) {
    updateWorkspace((current) => ({ activity: [createEvent('Pick issue reported', task.order, user, 'warning'), ...current.activity] }));
    showToast(`An issue for ${task.order} was added to the activity log.`);
  }

  function toggleAlertRead(id, markRead) {
    updateWorkspace((current) => ({
      alerts: current.alerts.map((alert) => alert.id === id ? { ...alert, read: typeof markRead === 'boolean' ? markRead : !alert.read } : alert),
    }));
  }

  function markAllRead() {
    updateWorkspace((current) => ({ alerts: current.alerts.map((alert) => ({ ...alert, read: true })) }));
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
  if (loading) return <WorkspaceLoading />;
  if (error) return <WorkspaceError message={error} onRetry={retryFetch} />;

  const pageProps = {
    user,
    products: workspace.products,
    lots: workspace.lots,
    alerts: workspace.alerts,
    activity: workspace.activity,
    tasks: workspace.tasks,
    recommendations: workspace.recommendations,
    writeoffs: workspace.writeoffs,
    setCurrentPage: changePage,
    onReceive: receiveStock,
    onCompletePick: completePick,
    onCreatePO: createPurchaseOrder,
    onWriteOff: writeOffLot,
    onReportPickIssue: reportPickIssue,
    onRead: toggleAlertRead,
    onReadAll: markAllRead,
    onExport: exportCsv,
    onRefresh: () => showToast('Live inventory is already synchronized.'),
  };

  return (
    <AppLayout setCurrentPage={changePage} user={user} onLogout={logout} alerts={workspace.alerts} menuOpen={menuOpen} setMenuOpen={setMenuOpen}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {Object.entries(pageComponents).map(([path, Page]) => (
          <Route key={path} path={`/${path}`} element={<Page {...pageProps} />} />
        ))}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      {toast && <div className={`toast ${toast.tone}`} role="status"><Icon name={toast.tone === 'warning' ? 'warning' : 'check'} size={18} />{toast.message}</div>}
    </AppLayout>
  );
}
