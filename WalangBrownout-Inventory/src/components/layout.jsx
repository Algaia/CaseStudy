import { NavLink } from 'react-router-dom';
import { navigation, roleAccess } from '../data';
import { Icon } from './ui';

export function Sidebar({ user, isOpen, close, unreadAlerts }) {
  const permitted = roleAccess[user.role] || [];
  return (
    <>
      {isOpen && <button className="sidebar-scrim" aria-label="Close menu" onClick={close} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><span>WB</span></div>
          <div><strong>WalangBrownout</strong><small>Inventory Control</small></div>
          <button className="mobile-close" aria-label="Close menu" onClick={close}><Icon name="close" /></button>
        </div>
        <nav aria-label="Main navigation">
          <p className="nav-heading">WORKSPACE</p>
          {navigation.filter((item) => permitted.includes(item.id)).map((item) => (
            <NavLink
              key={item.id}
              to={`/${item.id}`}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={close}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
              {item.id === 'alerts' && unreadAlerts > 0 && <b>{unreadAlerts}</b>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-help">
          <span className="help-icon">?</span>
          <div><strong>Need a hand?</strong><small>View warehouse guide</small></div>
          <Icon name="chevron" size={16} />
        </div>
      </aside>
    </>
  );
}

export function Header({ user, onMenu, onLogout, alerts, setCurrentPage }) {
  const unread = alerts.filter((alert) => !alert.read).length;
  return (
    <header className="topbar">
      <button className="menu-toggle" aria-label="Open menu" onClick={onMenu}><Icon name="menu" /></button>
      <div className="live-status"><span /> Live data <small>Updated just now</small></div>
      <div className="topbar-actions">
        <button className="notification-button" onClick={() => setCurrentPage('alerts')} aria-label={`${unread} unread alerts`}>
          <Icon name="bell" size={20} />{unread > 0 && <b>{unread}</b>}
        </button>
        <div className="user-menu">
          <span className="avatar">{user.initials}</span>
          <div><strong>{user.name}</strong><small>{user.role}</small></div>
          <button className="logout-link" onClick={onLogout}>Sign out</button>
        </div>
      </div>
    </header>
  );
}

export function AppLayout({ children, setCurrentPage, user, onLogout, alerts, menuOpen, setMenuOpen }) {
  const unreadAlerts = alerts.filter((alert) => !alert.read).length;
  return (
    <div className="app-shell">
      <Sidebar user={user} isOpen={menuOpen} close={() => setMenuOpen(false)} unreadAlerts={unreadAlerts} />
      <div className="main-area">
        <Header user={user} onMenu={() => setMenuOpen(true)} onLogout={onLogout} alerts={alerts} setCurrentPage={setCurrentPage} />
        <main>{children}</main>
      </div>
    </div>
  );
}
