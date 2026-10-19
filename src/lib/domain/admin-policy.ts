export function canDeleteMenuCategory(itemCount: number) {
  return Number.isInteger(itemCount) && itemCount === 0;
}
