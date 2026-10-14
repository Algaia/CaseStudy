export function Icon({ name, size = 20, stroke = 1.8 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    inbox: <><path d="M4 4h16v13H4z" /><path d="M4 13h5l2 3h2l2-3h5" /></>,
    boxes: <><path d="m12 2 8 4.5v11L12 22l-8-4.5v-11z" /><path d="m4 6.5 8 4.5 8-4.5M12 11v11" /></>,
    checklist: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="m3 6 1.5 1.5L7 4.5M3 12l1.5 1.5L7 10.5M3 18l1.5 1.5L7 16.5" /></>,
    trend: <><path d="m3 17 6-6 4 4 8-9" /><path d="M16 6h5v5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    report: <><path d="M6 3h9l3 3v15H6z" /><path d="M15 3v4h4M9 12h6M9 16h6" /></>,
    search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    down: <path d="m6 9 6 6 6-6" />,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    filter: <path d="M4 5h16l-6 7v5l-4 2v-7z" />,
    download: <><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    warning: <><path d="M12 3 2 20h20z" /><path d="M12 9v4M12 17h.01" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    refresh: <><path d="M20 11a8 8 0 0 0-14.5-4.5L3 9" /><path d="M3 4v5h5M4 13a8 8 0 0 0 14.5 4.5L21 15" /><path d="M21 20v-5h-5" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
    location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0" /><circle cx="12" cy="10" r="2.5" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    external: <><path d="M14 4h6v6M20 4l-9 9" /><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></>,
  };
  return <svg {...common}>{paths[name] || paths.grid}</svg>;
}

export function StatusPill({ children, tone = 'neutral' }) {
  return <span className={`status-pill ${tone}`}>{children}</span>;
}

export function PageTitle({ eyebrow, title, description, action }) {
  return (
    <div className="page-title">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action && <div className="page-action">{action}</div>}
    </div>
  );
}

export function MetricCard({ label, value, helper, tone = 'blue', icon, trend }) {
  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-topline">
        <span>{label}</span>
        {icon && <span className="metric-icon"><Icon name={icon} size={18} /></span>}
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-footer">
        {trend && <span className={`metric-trend ${trend.direction}`}>{trend.text}</span>}
        <span>{helper}</span>
      </div>
    </article>
  );
}

export function SectionCard({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`section-card ${className}`}>
      {(title || action) && <div className="section-heading">
        <div>
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>}
      {children}
    </section>
  );
}

export function Button({ children, variant = 'primary', icon, className = '', ...props }) {
  return (
    <button className={`button ${variant} ${className}`} {...props}>
      {icon && <Icon name={icon} size={17} />}
      {children}
    </button>
  );
}

export function EmptyState({ icon = 'boxes', title, detail, action }) {
  return <div className="empty-state"><Icon name={icon} size={28} /><h3>{title}</h3><p>{detail}</p>{action}</div>;
}
