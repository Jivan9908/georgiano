export function AdminPageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return <header className="admin-page-header"><div><p>{eyebrow}</p><h1>{title}</h1>{description ? <span>{description}</span> : null}</div>{action}</header>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="admin-empty"><span aria-hidden="true">◇</span><h2>{title}</h2><p>{description}</p></div>;
}

export function StatusBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warning" | "danger" }) {
  return <span className={`admin-badge admin-badge--${tone}`}>{children}</span>;
}

export function AdminNotice({ children, tone = "success" }: { children: React.ReactNode; tone?: "success" | "error" }) {
  return <p className={`admin-notice admin-notice--${tone}`} role="status">{children}</p>;
}
