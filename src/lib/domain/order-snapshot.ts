export type OrderSnapshotSource = { id: string; name: string; priceCents: number };

export function createOrderItemSnapshot(item: OrderSnapshotSource, quantity: number) {
  if (!Number.isInteger(item.priceCents) || item.priceCents < 0) throw new RangeError("Menu item price must be a non-negative integer.");
  if (!Number.isInteger(quantity) || quantity < 1) throw new RangeError("Order item quantity must be a positive integer.");

  return {
    menuItemId: item.id,
    itemNameSnapshot: item.name,
    itemPriceCentsSnapshot: item.priceCents,
    quantity,
    lineTotalCents: item.priceCents * quantity,
  };
}
