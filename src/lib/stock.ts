import stockData from "@/data/stock.json";

const stock = stockData as Record<string, number>;

export function getStock(productId: string): number {
  return stock[productId] ?? 99;
}

export function isLowStock(productId: string): boolean {
  const qty = getStock(productId);
  return qty > 0 && qty < 5;
}

export function isOutOfStock(productId: string): boolean {
  return getStock(productId) <= 0;
}

export function getStockLabel(productId: string): string | null {
  const qty = getStock(productId);
  if (qty <= 0) return "Out of Stock";
  if (qty < 5) return `Only ${qty} left`;
  return null;
}
