import "server-only";
import { getPrisma } from "../database";
import { executeDatabaseOperation } from "../data-access-error";
import { contactInquiryInputSchema, privateDiningInquiryInputSchema, type ContactInquiryInput, type PrivateDiningInquiryInput } from "@/lib/validation";

export function createPrivateDiningInquiry(input: PrivateDiningInquiryInput) {
  const validated = privateDiningInquiryInputSchema.parse(input);
  return executeDatabaseOperation("private-dining-inquiry.create", () => getPrisma().privateDiningInquiry.create({
    data: {
      ...validated,
      preferredDate: validated.preferredDate ? new Date(`${validated.preferredDate}T00:00:00.000Z`) : null,
      status: "NEW",
    },
  }));
}

export function createContactInquiry(input: ContactInquiryInput) {
  const validated = contactInquiryInputSchema.parse(input);
  return executeDatabaseOperation("contact-inquiry.create", () => getPrisma().contactInquiry.create({
    data: { ...validated, status: "NEW" },
  }));
}
