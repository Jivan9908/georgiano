import "server-only";
import { getPrisma } from "../database";
import { executeDatabaseOperation } from "../data-access-error";

export function getRestaurantSettings() {
  return executeDatabaseOperation("settings.public.read", () => getPrisma().restaurantSettings.findUnique({
    where: { key: "primary" },
    include: {
      businessServiceWindows: { where: { isVisible: true }, orderBy: [{ dayOfWeek: "asc" }, { sortOrder: "asc" }] },
      specialBusinessHours: { orderBy: { localDate: "asc" } },
    },
  }));
}

export function getReservationConfiguration() {
  return executeDatabaseOperation("settings.reservation.read", () => getPrisma().reservationSettings.findFirst({
    include: {
      serviceWindows: { where: { isEnabled: true }, orderBy: [{ dayOfWeek: "asc" }, { sortOrder: "asc" }] },
      closures: { orderBy: { startDate: "asc" } },
      capacityRules: true,
      restaurantSettings: true,
    },
  }));
}
