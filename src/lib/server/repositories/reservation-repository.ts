import "server-only";
import { getPrisma } from "../database";
import { executeDatabaseOperation } from "../data-access-error";
import { reservationInputSchema, type ReservationInput } from "@/lib/validation";

export function createPendingReservation(input: ReservationInput) {
  const validated = reservationInputSchema.parse(input);
  return executeDatabaseOperation("reservation.create", () => getPrisma().reservation.create({
    data: { ...validated, status: "PENDING", timezone: "America/Los_Angeles" },
  }));
}
