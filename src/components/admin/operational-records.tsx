import { updateRecordStatusAction } from "@/app/admin/actions/content-actions";
import { EmptyState, StatusBadge } from "./admin-ui";

type RecordItem = { id: string; title: string; subtitle: string; status: string; details: string[]; internalNotes: string | null };

export function OperationalRecords({ records, type, statuses, emptyTitle, emptyDescription }: { records: RecordItem[]; type: "reservation" | "privateDining" | "contact"; statuses: string[]; emptyTitle: string; emptyDescription: string }) {
  if (!records.length) return <EmptyState title={emptyTitle} description={emptyDescription} />;
  return <div className="admin-list">{records.map((record) => <article className="admin-record" key={record.id}><header><div><h2>{record.title}</h2><p>{record.subtitle}</p></div><StatusBadge>{record.status}</StatusBadge></header><ul>{record.details.map((detail) => <li key={detail}>{detail}</li>)}</ul><form className="admin-form" action={updateRecordStatusAction}><input type="hidden" name="type" value={type} /><input type="hidden" name="id" value={record.id} /><label>Status<select name="status" defaultValue={record.status}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><label>Internal notes<textarea name="internalNotes" rows={3} defaultValue={record.internalNotes ?? ""} /></label><button className="admin-button admin-button--secondary" type="submit">Save record</button></form></article>)}</div>;
}
