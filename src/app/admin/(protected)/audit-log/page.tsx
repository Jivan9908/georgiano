import { AdminPageHeader, EmptyState } from "@/components/admin/admin-ui";
import { getPrisma } from "@/lib/server/database";

export default async function AuditLogPage() {
  const logs = await getPrisma().auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return <><AdminPageHeader eyebrow="Security & accountability" title="Audit Log" description="Important authentication and content mutations without secrets." />{logs.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Entity</th><th>Metadata</th></tr></thead><tbody>{logs.map((log) => <tr key={log.id}><td>{log.createdAt.toLocaleString("en-US")}</td><td>{log.actorIdentifier || "System"}</td><td><strong>{log.action}</strong></td><td>{log.entityType}<small>{log.entityId}</small></td><td><code>{log.metadata ? JSON.stringify(log.metadata) : "—"}</code></td></tr>)}</tbody></table></div> : <EmptyState title="No audit events" description="Audit entries will appear after administrator activity." />}</>;
}
