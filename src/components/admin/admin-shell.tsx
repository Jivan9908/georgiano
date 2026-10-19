import Link from "next/link";
import { logoutAction } from "@/app/admin/actions/auth-actions";

const navigation = [
  ["Dashboard", "/admin"], ["Menu", "/admin/menu"], ["Categories", "/admin/categories"],
  ["Homepage", "/admin/homepage"], ["Gallery", "/admin/gallery"], ["Restaurant Settings", "/admin/settings"],
  ["Reservations", "/admin/reservations"], ["Orders", "/admin/orders"], ["Private Dining", "/admin/private-dining"],
  ["Contact Inquiries", "/admin/contact-inquiries"], ["Audit Log", "/admin/audit-log"], ["Account", "/admin/account"],
] as const;

function AdminNavigation() {
  return <nav aria-label="Admin navigation">{navigation.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}<form action={logoutAction}><button type="submit">Log Out</button></form></nav>;
}

export function AdminShell({ adminName, children }: { adminName: string; children: React.ReactNode }) {
  return <div className="admin-shell"><aside className="admin-sidebar"><Link className="admin-brand" href="/admin"><span>G</span><div><strong>GEORGIANO</strong><small>Administration</small></div></Link><AdminNavigation /><p className="admin-user">Signed in as<br /><strong>{adminName}</strong></p></aside><header className="admin-mobile-header"><Link className="admin-brand" href="/admin"><span>G</span><strong>GEORGIANO</strong></Link><details><summary>Menu</summary><AdminNavigation /></details></header><main className="admin-main">{children}</main></div>;
}
