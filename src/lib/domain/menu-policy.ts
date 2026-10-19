export type PublicMenuCandidate = { status: "AVAILABLE" | "SOLD_OUT" | "HIDDEN" };

export function isPublicMenuItem(item: PublicMenuCandidate) {
  return item.status !== "HIDDEN";
}
