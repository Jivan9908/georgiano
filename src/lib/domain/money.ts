export function dollarsToCents(value: string) {
  const normalized = value.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) throw new RangeError("Enter a valid dollar amount with no more than two decimal places.");
  const [dollars, fraction = ""] = normalized.split(".");
  const cents = BigInt(dollars) * BigInt(100) + BigInt(fraction.padEnd(2, "0"));
  if (cents > BigInt(Number.MAX_SAFE_INTEGER)) throw new RangeError("Price is too large.");
  return Number(cents);
}

export function centsToDollars(cents: number) {
  if (!Number.isSafeInteger(cents) || cents < 0) throw new RangeError("Cents must be a non-negative safe integer.");
  return `${Math.floor(cents / 100)}.${String(cents % 100).padStart(2, "0")}`;
}
