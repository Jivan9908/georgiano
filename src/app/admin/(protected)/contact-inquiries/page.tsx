import { AdminPageHeader } from "@/components/admin/admin-ui";
import { OperationalRecords } from "@/components/admin/operational-records";
import { getPrisma } from "@/lib/server/database";

export default async function ContactInquiriesAdminPage() {
  const inquiries = await getPrisma().contactInquiry.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  const records = inquiries.map((item) => ({ id: item.id, title: item.name, subtitle: item.subject, status: item.status, details: [item.email, item.phone || "No phone", item.message], internalNotes: item.internalNotes }));
  return <><AdminPageHeader eyebrow="Guest messages" title="Contact Inquiries" description="Public contact persistence begins in Stage 9." /><OperationalRecords records={records} type="contact" statuses={["NEW", "IN_PROGRESS", "CLOSED"]} emptyTitle="No contact inquiries" emptyDescription="The public contact form remains a local demonstration during Stage 6." /></>;
}
