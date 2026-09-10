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

function toCsv(rows) {
  if (!rows.length) return 'No records available\n';
  const headers = Object.keys(rows[0]);
  const escape = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return [headers.map(escape).join(','), ...rows.map((row) => headers.map((header) => escape(row[header])).join(','))].join('\n');
}

function WorkspaceLoading() {
  return (
    <div className="workspace-status">
      <div className="spinner" aria-hidden="true" />
      <p>Loading live inventory workspace…</p>
    </div>
  );
}

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

  useEffect(() => {
    if (!user) { setLoading(false); return undefined; }
    let cancelled = false;
    setLoading(true);
    api.fetchInventoryWorkspace()
      .then((data) => { if (!cancelled) setWorkspace(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user, requestId]);

  function retryFetch() {
    setLoading(true);
    setError(null);
    setRequestId((id) => id + 1);
  }

  function refreshWorkspace() {
    return api.fetchInventoryWorkspace().then(setWorkspace).catch((err) => setError(err.message));
  }

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 3800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

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

  function login(email, password) {
    api.login(email, password)
      .then((nextUser) => {
        setUser(nextUser);
        navigate('/dashboard');
        showToast(`Signed in as ${nextUser.role}.`);
      })
      .catch((err) => showToast(err.message, 'warning'));
  }

  function logout() {
    api.logout().catch(() => {});
    setUser(null);
    setWorkspace(null);
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

  function receiveStock(receipt) {
    api.receiveStock(receipt)
      .then(() => {
        refreshWorkspace();
        showToast(`${receipt.quantity} units of ${receipt.product.id} received and recorded.`);
      })
      .catch((err) => showToast(err.message, 'warning'));
  }

  function completePick(task) {
    api.completePick(task.id)
      .then(() => {
        refreshWorkspace();
        showToast(`${task.order} marked complete. Live inventory has been updated.`);
      })
      .catch((err) => showToast(err.message, 'warning'));
  }

  function createPurchaseOrder(id) {
    api.createPurchaseOrder(id)
      .then((data) => {
        refreshWorkspace();
        showToast(`${data.poNumber} created.`);
      })
      .catch((err) => showToast(err.message, 'warning'));
  }

  function writeOffLot(lot, product, reason) {
    api.writeOffLot(lot.id, reason)
      .then(() => {
        refreshWorkspace();
        showToast(`${lot.quantity} units from lot ${lot.id} were written off.`);
      })
      .catch((err) => showToast(err.message, 'warning'));
  }

  function reportPickIssue(task) {
    api.reportPickIssue(task.id)
      .then(() => {
        refreshWorkspace();
        showToast(`An issue for ${task.order} was added to the activity log.`);
      })
      .catch((err) => showToast(err.message, 'warning'));
  }

  function toggleAlertRead(id, markRead) {
    api.toggleAlertRead(id, markRead).then(refreshWorkspace).catch(() => {});
  }

  function markAllRead() {
    api.markAllRead()
      .then(() => {
        refreshWorkspace();
        showToast('All alerts marked as read.');
      })
      .catch((err) => showToast(err.message, 'warning'));
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
    onRefresh: () => { refreshWorkspace(); showToast('Live inventory refreshed.'); },
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
