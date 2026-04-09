// Promo codes — validated on both client (for UX) and server (for security).
// Never trust the client-side discount alone; the API re-validates.

export type PromoCode = {
  code: string;
  discountPercent: number;
  label: string;
};

const PROMO_CODES: PromoCode[] = [
  { code: "TIKTOK10",  discountPercent: 10, label: "TikTok 10% off" },
  { code: "WELCOME15", discountPercent: 15, label: "Welcome 15% off" },
  { code: "DROP20",    discountPercent: 20, label: "Limited drop 20% off" },
  { code: "CART10",    discountPercent: 10, label: "Cart recovery 10% off" },
];

export function validatePromoCode(code: string): PromoCode | null {
  return PROMO_CODES.find((p) => p.code === code.trim().toUpperCase()) ?? null;
}
