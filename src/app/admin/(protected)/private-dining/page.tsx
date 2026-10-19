import { AdminPageHeader } from "@/components/admin/admin-ui";
import { OperationalRecords } from "@/components/admin/operational-records";
import { getPrisma } from "@/lib/server/database";

export default async function PrivateDiningAdminPage() {
  const inquiries = await getPrisma().privateDiningInquiry.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  const records = inquiries.map((item) => ({ id: item.id, title: item.fullName, subtitle: item.eventType, status: item.status, details: [item.email, item.phone, item.preferredDate?.toISOString().slice(0, 10) || "No preferred date", item.guestCount ? `${item.guestCount} guests` : "Guest count not provided", item.eventDetails || "No additional details"], internalNotes: item.internalNotes }));
  return <><AdminPageHeader eyebrow="Guest relations" title="Private Dining" description="Public inquiry persistence begins in Stage 9." /><OperationalRecords records={records} type="privateDining" statuses={["NEW", "CONTACTED", "QUALIFIED", "CLOSED", "DECLINED"]} emptyTitle="No private dining inquiries" emptyDescription="The public form remains a local demonstration during Stage 6." /></>;
}
