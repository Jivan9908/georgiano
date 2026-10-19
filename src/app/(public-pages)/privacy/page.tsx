import type { Metadata } from "next";
import { LegalPage } from "@/components/public/legal-page";

export const metadata: Metadata = { title: "Privacy Policy", description: "Development draft of the Georgiano privacy policy." };

const sections = [
  { title: "1. About this draft", body: ["This page is placeholder legal copy prepared solely to establish the visual and editorial structure of the Georgiano website. It is not a final privacy policy and should not be relied upon as legal guidance."] },
  { title: "2. Information you provide", body: ["Future website experiences may allow guests to provide contact, reservation, event inquiry, or ordering information. During Stage 4, forms are interface demonstrations only: entries are not transmitted to a server or stored by Georgiano.", "The final policy should identify each category of information collected, the purpose for collection, and whether providing that information is optional or required."] },
  { title: "3. How information may be used", body: ["A final policy may explain uses such as responding to inquiries, managing reservations, providing requested services, improving the guest experience, meeting legal obligations, and protecting the website. These purposes remain unconfirmed until the related systems and business practices are implemented."] },
  { title: "4. Sharing and service providers", body: ["The production policy should name or describe relevant service-provider categories only after vendors are selected. No claims about reservation, payment, analytics, marketing, hosting, or communications providers are made in this development draft."] },
  { title: "5. Cookies and analytics", body: ["Cookie and analytics disclosures will be added after the production website’s actual technologies and consent requirements are confirmed. This placeholder does not state that any specific tracking technology is in use."] },
  { title: "6. Choices, retention, and security", body: ["The final policy should describe applicable privacy choices, retention practices, and reasonable safeguards in terms that accurately match production operations. No retention period or security guarantee is represented here."] },
  { title: "7. Contact and updates", body: ["Confirmed privacy contact information, an effective date, and a process for policy updates must be added following legal review and before public launch."] },
];

export default function PrivacyPage() { return <LegalPage eyebrow="Legal · Development draft" title="Privacy Policy" introduction="A clear framework for the future Georgiano privacy notice, awaiting confirmed systems, business practices, and legal review." sections={sections} />; }
