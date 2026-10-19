import Link from "next/link";
import { AdminPageHeader, EmptyState } from "@/components/admin/admin-ui";
import { getPrisma } from "@/lib/server/database";

export default async function AdminDashboardPage() {
  const prisma = getPrisma();
  const [items, categories, featured, soldOut, reservations, privateDining, contacts, orders] = await Promise.all([
    prisma.menuItem.count(), prisma.menuCategory.count(), prisma.menuItem.count({ where: { featured: true } }), prisma.menuItem.count({ where: { status: "SOLD_OUT" } }),
    prisma.reservation.count(), prisma.privateDiningInquiry.count({ where: { status: "NEW" } }), prisma.contactInquiry.count({ where: { status: "NEW" } }), prisma.order.count(),
  ]);
  const cards = [["Menu Items", items, "/admin/menu"], ["Categories", categories, "/admin/categories"], ["Featured Dishes", featured, "/admin/menu?featured=true"], ["Sold Out Items", soldOut, "/admin/menu?status=SOLD_OUT"], ["Reservations", reservations, "/admin/reservations"], ["New Private Dining", privateDining, "/admin/private-dining"], ["New Contact Inquiries", contacts, "/admin/contact-inquiries"], ["Orders", orders, "/admin/orders"]] as const;
  return <><AdminPageHeader eyebrow="Operations overview" title="Dashboard" description="Real database counts for Georgiano." /><section className="admin-card-grid">{cards.map(([label, count, href]) => <Link href={href} className="admin-stat" key={label}><span>{label}</span><strong>{count}</strong><small>View records →</small></Link>)}</section>{reservations + privateDining + contacts + orders === 0 ? <EmptyState title="No operational activity yet" description="Reservations, orders, and inquiries will appear here when their public workflows become active in later stages." /> : null}</>;
}
