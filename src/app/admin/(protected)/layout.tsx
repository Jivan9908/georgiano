import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/server/auth/session";
import "../admin.css";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return <AdminShell adminName={admin.name}>{children}</AdminShell>;
}
