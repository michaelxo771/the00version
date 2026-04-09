/**
 * CJ Dropshipping API client
 * Docs: https://developers.cjdropshipping.com
 *
 * Required env vars:
 *   CJ_API_KEY    — format: CJUserNum@api@xxxxxxxx...
 *   CJ_STORAGE_ID — warehouse ID from CJ dashboard (optional, leave empty to use CJ default)
 */

const CJ_BASE = "https://developers.cjdropshipping.com/api2.0/v1";

// ─── Token cache (module-level — survives warm lambda instances) ──────────────

type TokenCache = {
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
  refreshExpiresAt: number;
  openId: string;
};

let _token: TokenCache | null = null;

async function fetchFreshToken(): Promise<TokenCache> {
  const apiKey = process.env.CJ_API_KEY;
  if (!apiKey) throw new Error("CJ_API_KEY environment variable is not set");

  const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey }),
  });

  const data = await res.json();
  if (data.code !== 200) {
    throw new Error(`CJ auth failed (${data.code}): ${data.message}`);
  }

  return {
    accessToken: data.data.accessToken,
    expiresAt: new Date(data.data.accessTokenExpiryDate).getTime(),
    refreshToken: data.data.refreshToken,
    refreshExpiresAt: new Date(data.data.refreshTokenExpiryDate).getTime(),
    openId: data.data.openId,
  };
}

async function refreshToken(t: TokenCache): Promise<TokenCache> {
  const res = await fetch(`${CJ_BASE}/authentication/refreshAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: t.refreshToken }),
  });

  const data = await res.json();
  if (data.code !== 200) {
    // Refresh failed — get a completely new token
    return fetchFreshToken();
  }

  return {
    accessToken: data.data.accessToken,
    expiresAt: new Date(data.data.accessTokenExpiryDate).getTime(),
    refreshToken: data.data.refreshToken,
    refreshExpiresAt: new Date(data.data.refreshTokenExpiryDate).getTime(),
    openId: data.data.openId,
  };
}

async function getToken(): Promise<TokenCache> {
  const BUFFER_MS = 2 * 60 * 1000; // 2-minute buffer before expiry

  if (_token) {
    if (_token.expiresAt > Date.now() + BUFFER_MS) {
      return _token; // Still valid
    }
    if (_token.refreshExpiresAt > Date.now() + BUFFER_MS) {
      _token = await refreshToken(_token); // Refresh
      return _token;
    }
  }

  _token = await fetchFreshToken();
  return _token;
}

// ─── HTTP helper ──────────────────────────────────────────────────────────────

async function cjPost<T = unknown>(path: string, body: unknown): Promise<T> {
  const { accessToken } = await getToken();
  const res = await fetch(`${CJ_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CJ-Access-Token": accessToken,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data as T;
}

async function cjGet<T = unknown>(path: string, params?: Record<string, string>): Promise<T> {
  const { accessToken } = await getToken();
  const url = new URL(`${CJ_BASE}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString(), {
    headers: { "CJ-Access-Token": accessToken },
  });

  const data = await res.json();
  return data as T;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type CJOrderItem = {
  vid: string;       // CJ variant ID — get from cj-products.json mapping
  quantity: number;
  storeLineItemId: string; // Your internal line-item reference
};

export type CJShippingAddress = {
  name: string;
  countryCode: string; // ISO 3166-1 alpha-2 e.g. "DE", "GB", "FR"
  country: string;     // Full country name
  province: string;    // State / county
  city: string;
  address: string;
  zip: string;
  phone: string;
};

export type CJOrderInput = {
  orderNumber: string;
  shipping: CJShippingAddress;
  products: CJOrderItem[];
  shippingName?: string; // Carrier override — leave blank for CJ to choose
};

export type CJOrderResponse = {
  code: number;
  message: string;
  data?: {
    orderId: string;
    orderNum: string;
    status: string;
  };
};

export type CJTrackingResponse = {
  code: number;
  message: string;
  data?: {
    orderId: string;
    logisticName: string;
    trackingNumber: string;
    trackingStatus: string;
    logisticsTrackEvents: string; // JSON string
  };
};

export type CJWebhookPayload = {
  messageId: string;
  type: "LOGISTIC" | "PRODUCT" | "STOCK" | "ORDER";
  messageType: "UPDATE" | "ADD" | "DELETE";
  openId: string;
  params: {
    orderId?: string;
    logisticName?: string;
    trackingNumber?: string;
    trackingStatus?: string;
    logisticsTrackEvents?: string;
    [key: string]: unknown;
  };
};

// ─── API functions ────────────────────────────────────────────────────────────

/**
 * Submit a fulfilled order to CJ for dropshipping.
 * Returns the CJ orderId on success.
 */
export async function createCJOrder(input: CJOrderInput): Promise<CJOrderResponse> {
  const storageId = process.env.CJ_STORAGE_ID;

  const body: Record<string, unknown> = {
    orderNumber: input.orderNumber,
    shippingZip: input.shipping.zip,
    shippingCountry: input.shipping.country,
    shippingCountryCode: input.shipping.countryCode,
    shippingProvince: input.shipping.province,
    shippingCity: input.shipping.city,
    shippingAddress: input.shipping.address,
    customerPhone: input.shipping.phone || "0000000000",
    customerName: input.shipping.name,
    products: input.products,
  };

  if (storageId) body.storageId = storageId;
  if (input.shippingName) body.shippingName = input.shippingName;

  return cjPost<CJOrderResponse>("/order/createOrderV2", body);
}

/**
 * Get logistics/tracking info for a CJ order.
 */
export async function getCJTracking(cjOrderId: string): Promise<CJTrackingResponse> {
  return cjPost<CJTrackingResponse>("/logistics/queryLogistics", {
    orderId: cjOrderId,
  });
}

/**
 * Get CJ order details (status, payment, etc.)
 */
export async function getCJOrder(cjOrderId: string): Promise<{ code: number; data?: Record<string, unknown> }> {
  return cjPost("/order/getOrder", { orderId: cjOrderId });
}

/**
 * Register a webhook URL with CJ.
 * Call this once during setup via /api/cj-setup.
 * webhookUrl must be a public HTTPS URL.
 */
export async function registerCJWebhook(webhookUrl: string): Promise<{ code: number; message: string }> {
  return cjPost("/webhook/set", { endPoint: webhookUrl });
}

/**
 * Returns the openId from the current token — use to verify incoming webhook payloads.
 */
export async function getCJOpenId(): Promise<string> {
  const t = await getToken();
  return t.openId;
}
