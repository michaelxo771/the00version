import Link from "next/link";
import Stripe from "stripe";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function OrderConfirmationPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  // No session ID — likely a direct visit
  if (!session_id) {
    return <NoSession />;
  }

  let session: Stripe.Checkout.Session | null = null;
  let lineItems: Stripe.LineItem[] = [];

  try {
    const stripe = getStripe();
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    });
    lineItems = session.line_items?.data ?? [];
  } catch {
    return <NoSession />;
  }

  // If payment wasn't completed, show a pending state
  if (session.payment_status !== "paid") {
    return <PaymentPending />;
  }

  const name =
    [session.metadata?.firstName, session.metadata?.lastName]
      .filter(Boolean)
      .join(" ") || "there";

  const email = session.customer_email ?? session.customer_details?.email ?? "";
  const orderNumber = `#00S${session.id.slice(-6).toUpperCase()}`;
  const amountTotal = ((session.amount_total ?? 0) / 100).toFixed(2);
  const shippingMethod = session.metadata?.shippingMethod ?? "standard";

  const deliveryEstimates: Record<string, string> = {
    standard: "5–7 business days",
    express: "2–3 business days",
    overnight: "Next business day",
  };

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Success icon */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-full border-2 border-[#C9A84C] flex items-center justify-center mx-auto mb-5"
            style={{ boxShadow: "0 0 40px rgba(201,168,76,0.15)" }}
          >
            <svg className="w-10 h-10 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-[1px] w-10 bg-[#C9A84C]/40" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C9A84C]">
              Order Confirmed
            </span>
            <div className="h-[1px] w-10 bg-[#C9A84C]/40" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-3">
            Thank You, {name}
          </h1>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Your order is in. We&apos;re getting it ready.
            {email && (
              <>
                {" "}A confirmation has been sent to{" "}
                <span className="text-neutral-300">{email}</span>.
              </>
            )}
          </p>
        </div>

        {/* Order details card */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm overflow-hidden mb-6">
          {/* Gold top line */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

          <div className="p-6">
            {/* Key details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: "Order Number", value: orderNumber },
                { label: "Amount Paid", value: `€${amountTotal}` },
                { label: "Delivery", value: deliveryEstimates[shippingMethod] },
                { label: "Payment", value: "Completed" },
              ].map((d) => (
                <div key={d.label} className="bg-[#111111] rounded-sm px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-600 mb-1">{d.label}</p>
                  <p
                    className={`text-sm font-bold ${
                      d.label === "Amount Paid"
                        ? "text-[#C9A84C]"
                        : d.label === "Payment"
                        ? "text-green-400"
                        : "text-neutral-200"
                    }`}
                  >
                    {d.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Line items */}
            {lineItems.length > 0 && (
              <div>
                <div className="h-[1px] bg-gradient-to-r from-[#C9A84C]/30 to-transparent mb-4" />
                <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] mb-3">
                  Items Ordered
                </h2>
                <ul className="space-y-3">
                  {lineItems.map((item, i) => (
                    <li key={i} className="flex justify-between items-start text-sm gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-200 leading-tight truncate">
                          {item.description}
                        </p>
                        {item.price?.product &&
                          typeof item.price.product !== "string" &&
                          "description" in item.price.product &&
                          item.price.product.description && (
                            <p className="text-[11px] text-neutral-600 mt-0.5">
                              {item.price.product.description}
                            </p>
                          )}
                        <p className="text-[11px] text-neutral-600 mt-0.5">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-neutral-300 flex-shrink-0">
                        €{((item.amount_total ?? 0) / 100).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Shipping address if available */}
            {session.customer_details?.address && (
              <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
                <h2 className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] mb-2">
                  Shipping To
                </h2>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  {session.customer_details.name && (
                    <span className="block text-neutral-300 font-semibold">
                      {session.customer_details.name}
                    </span>
                  )}
                  {session.customer_details.address.line1}
                  {session.customer_details.address.line2 && `, ${session.customer_details.address.line2}`}
                  <br />
                  {[
                    session.customer_details.address.city,
                    session.customer_details.address.state,
                    session.customer_details.address.postal_code,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  {session.customer_details.address.country && (
                    <>, {session.customer_details.address.country}</>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/products" className="btn-gold flex-1 py-4 text-sm rounded-sm text-center">
            Keep Shopping
          </Link>
          <Link href="/" className="btn-outline-gold flex-1 py-4 text-sm rounded-sm text-center">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function NoSession() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-neutral-600 text-sm mb-4">No order found.</p>
        <Link href="/" className="btn-gold px-8 py-3.5 text-sm rounded-sm inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function PaymentPending() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full border border-[#C9A84C]/40 flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-[#C9A84C]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-black uppercase tracking-tight mb-2">Payment Pending</h1>
        <p className="text-neutral-500 text-sm mb-6">
          Your payment is still processing. Check your email for confirmation.
        </p>
        <Link href="/" className="btn-gold px-8 py-3.5 text-sm rounded-sm inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
