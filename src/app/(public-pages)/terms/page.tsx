import type { Metadata } from "next";
import { LegalPage } from "@/components/public/legal-page";

export const metadata: Metadata = { title: "Terms & Conditions", description: "Development draft of the Georgiano website terms and conditions." };

const sections = [
  { title: "1. About these draft terms", body: ["These placeholder terms exist to establish a readable legal-page design for Georgiano. They are not final terms, do not create a complete agreement, and require review by qualified counsel before publication."] },
  { title: "2. Website information", body: ["The final terms may describe permitted use of the website and explain that menu items, pricing, availability, operating details, and other restaurant information can change. Development content currently shown on this website must not be treated as confirmed business information."] },
  { title: "3. Reservations and inquiries", body: ["Stage 4 reservation, private dining, and contact experiences are visual demonstrations. They do not transmit requests, create reservations, confirm availability, or form agreements with Georgiano.", "Binding reservation, cancellation, deposit, event, and guest policies should be added only when the relevant systems and restaurant practices are finalized."] },
  { title: "4. Ordering and payment", body: ["No online ordering or payment functionality is implemented in this stage. Future terms should accurately describe checkout, payment, refunds, substitutions, taxes, gratuities, and fulfillment only after those services are approved and operational."] },
  { title: "5. Intellectual property", body: ["The production terms may address ownership and permitted use of Georgiano branding, photography, writing, and website materials. The final language should reflect actual rights and licenses."] },
  { title: "6. Disclaimers and limitations", body: ["Appropriate disclaimers, limitations of liability, indemnity terms, dispute provisions, and governing-law language must be developed through legal review. No such final allocation of rights or responsibility is represented in this placeholder."] },
  { title: "7. Contact and changes", body: ["Confirmed contact details, effective dates, eligibility requirements, accessibility language, and a process for updating these terms must be added before launch."] },
];

export default function TermsPage() { return <LegalPage eyebrow="Legal · Development draft" title="Terms & Conditions" introduction="A preliminary structure for the future Georgiano website terms, awaiting operational decisions and legal review." sections={sections} />; }
