import { AdminPageHeader, EmptyState, StatusBadge } from "@/components/admin/admin-ui";
import { getPrisma } from "@/lib/server/database";

export default async function OrdersAdminPage() {
  const orders = await getPrisma().order.findMany({ orderBy: { createdAt: "desc" }, include: { items: true }, take: 100 });
  return <><AdminPageHeader eyebrow="Pickup operations" title="Orders" description="Public ordering and checkout are not active until Stage 8." />{orders.length ? <div className="admin-list">{orders.map((order) => <article className="admin-record" key={order.id}><header><div><h2>{order.orderNumber}</h2><p>{order.customerName} · {order.items.length} items</p></div><StatusBadge>{order.status}</StatusBadge></header><p>${(order.totalCents / 100).toFixed(2)} · pickup {order.pickupAt.toLocaleString("en-US", { timeZone: order.timezone })}</p></article>)}</div> : <EmptyState title="No orders yet" description="No fake orders were created. Real pickup orders will appear after Stage 8." />}</>;
}
