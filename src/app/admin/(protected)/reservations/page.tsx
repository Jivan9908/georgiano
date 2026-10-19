import { AdminPageHeader } from "@/components/admin/admin-ui";
import { OperationalRecords } from "@/components/admin/operational-records";
import { getPrisma } from "@/lib/server/database";

export default async function ReservationsAdminPage() {
  const reservations = await getPrisma().reservation.findMany({ orderBy: { reservationAt: "desc" }, take: 100 });
  const records = reservations.map((item) => ({ id: item.id, title: item.guestName, subtitle: `${item.partySize} guests · ${item.reservationAt.toLocaleString("en-US", { timeZone: item.timezone })}`, status: item.status, details: [item.email, item.phone, item.specialOccasion || "No occasion specified", item.specialRequests || "No special requests"], internalNotes: item.internalNotes }));
  return <><AdminPageHeader eyebrow="Operations" title="Reservations" description="Database records only. Availability and conflict handling begin in Stage 7." /><OperationalRecords records={records} type="reservation" statuses={["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]} emptyTitle="No reservations yet" emptyDescription="The Stage 4 demonstration form does not create reservation records." /></>;
}
