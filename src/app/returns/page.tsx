import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns & Refund Policy — The 00s Version",
  description: "14-day returns policy for The 00s Version, compliant with EU consumer law.",
};

const LAST_UPDATED = "8 April 2025";
const EMAIL = "returns@the00sversion.com";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <LegalHeader eyebrow="Legal" title="Returns & Refund Policy" updated={LAST_UPDATED} />

        <p className="text-sm text-neutral-400 leading-relaxed mb-10">
          We want you to love what you ordered. If you&apos;re not happy, we make it easy.
          This policy is compliant with the EU Consumer Rights Directive 2011/83/EU and applicable
          national consumer protection laws.
        </p>

        {/* Quick summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { icon: "14", label: "Day return window", sub: "From date of delivery" },
            { icon: "✓", label: "Free returns", sub: "On all EU orders" },
            { icon: "€", label: "Full refund", sub: "Within 14 days of receipt" },
          ].map((card) => (
            <div key={card.label} className="bg-[#111111] border border-[#1a1a1a] rounded-sm p-5 text-center">
              <div className="text-2xl font-black gold-text mb-2">{card.icon}</div>
              <p className="text-sm font-bold text-neutral-200">{card.label}</p>
              <p className="text-[11px] text-neutral-600 mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        <LegalSection title="1. Your Right to Return">
          <p>
            Under the EU Consumer Rights Directive, you have the right to withdraw from your purchase
            within <strong className="text-neutral-200">14 calendar days</strong> of the day you (or
            a nominated third party) receive your order, without needing to provide a reason.
          </p>
          <p className="mt-3">
            The 14-day window begins the day after delivery. If your order was delivered in multiple
            shipments, the window starts from the day you received the last item.
          </p>
        </LegalSection>

        <LegalSection title="2. How to Return">
          <p>To initiate a return:</p>
          <ol className="mt-3 space-y-3">
            {[
              ["Notify us", `Email ${EMAIL} with your order number and items you wish to return. Include the reason (optional but helpful).`],
              ["Pack securely", "Repackage items in their original packaging where possible. Include a note with your order number inside the parcel."],
              ["Ship back", "We will provide a pre-paid returns label for EU orders. For international returns outside the EU, return shipping costs are at your expense."],
              ["Confirmation", "Once we receive and inspect the return, we'll email you to confirm."],
            ].map(([step, desc], i) => (
              <li key={step} className="flex gap-4 text-sm text-neutral-400">
                <span className="w-6 h-6 flex-shrink-0 bg-[#1a1a1a] border border-[#C9A84C]/30 rounded-sm flex items-center justify-center text-[11px] font-black text-[#C9A84C] mt-0.5">
                  {i + 1}
                </span>
                <span><span className="text-neutral-200 font-semibold">{step}:</span> {desc}</span>
              </li>
            ))}
          </ol>
        </LegalSection>

        <LegalSection title="3. Condition of Returned Items">
          <p>Items must be returned in the following condition to qualify for a full refund:</p>
          <ul className="mt-3 space-y-1.5">
            {[
              "Unworn and unwashed.",
              "All original tags attached.",
              "Original packaging included where possible.",
              "No odours, stains, or signs of wear beyond trying on for fit.",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-neutral-400">
                <span className="text-[#C9A84C] flex-shrink-0 mt-1">·</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-3">
            If returned items do not meet these conditions, we reserve the right to issue a partial
            refund or decline the return, in which case we will contact you and return the items
            at your cost.
          </p>
        </LegalSection>

        <LegalSection title="4. Refunds">
          <p>
            Once we confirm receipt and inspection of your return, we will issue a full refund within{" "}
            <strong className="text-neutral-200">14 days</strong>. Refunds are made to your original
            payment method.
          </p>
          <p className="mt-3">
            We cover standard delivery costs on refunds. If you selected express or overnight shipping,
            only the equivalent standard shipping cost will be refunded; the upgrade charge is
            non-refundable.
          </p>
          <p className="mt-3">
            Refund processing times depend on your bank or card issuer and are typically 3–7 business
            days after we initiate the refund.
          </p>
        </LegalSection>

        <LegalSection title="5. Exchanges">
          <p>
            We do not currently offer direct exchanges. To get a different size or colour, return your
            original order for a full refund and place a new order. This ensures the fastest turnaround.
          </p>
        </LegalSection>

        <LegalSection title="6. Faulty or Incorrect Items">
          <p>
            If you received a faulty item, an item with a manufacturing defect, or the wrong item
            entirely, please contact us at{" "}
            <a href={`mailto:${EMAIL}`} className="text-[#C9A84C] hover:underline">{EMAIL}</a>{" "}
            within <strong className="text-neutral-200">30 days</strong> of receipt.
          </p>
          <p className="mt-3">
            Please include photos of the fault/issue and your order number. We will arrange collection
            at no cost to you and offer a replacement, repair, or full refund — your choice.
          </p>
          <p className="mt-3">
            Your statutory rights under EU law (2-year guarantee period) are not affected by this policy.
          </p>
        </LegalSection>

        <LegalSection title="7. Non-Returnable Items">
          <p>The following items cannot be returned:</p>
          <ul className="mt-3 space-y-1.5">
            {[
              "Items that have been personalised or made to order.",
              "Items that show signs of wear, washing, or damage not caused by us.",
              "Sale or clearance items marked as final sale at time of purchase.",
              "Hygiene-sealed goods that have been opened (e.g. undergarments).",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-neutral-400">
                <span className="text-[#C9A84C] flex-shrink-0 mt-1">·</span>
                {item}
              </li>
            ))}
          </ul>
        </LegalSection>

        <LegalSection title="8. International Returns (Outside EU)">
          <p>
            Customers outside the EU are responsible for return shipping costs. We recommend using a
            tracked shipping service as we cannot be responsible for returns lost in transit. Customs
            declarations for returned goods should be marked as &ldquo;Returned Goods — No Commercial
            Value&rdquo; to avoid import charges.
          </p>
        </LegalSection>

        <LegalSection title="9. Contact">
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-sm p-4 text-sm text-neutral-400">
            <p className="font-semibold text-neutral-200">Returns Team</p>
            <p className="mt-1">
              Email:{" "}
              <a href={`mailto:${EMAIL}`} className="text-[#C9A84C] hover:underline">
                {EMAIL}
              </a>
            </p>
            <p className="mt-1 text-[11px] text-neutral-600">
              Response time: within 1 business day
            </p>
          </div>
        </LegalSection>

        <LegalFooterNav />
      </div>
    </div>
  );
}

function LegalHeader({ eyebrow, title, updated }: { eyebrow: string; title: string; updated: string }) {
  return (
    <div className="mb-12">
      <p className="text-[11px] uppercase tracking-[0.4em] text-[#C9A84C] mb-3">{eyebrow}</p>
      <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight mb-4">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[#C9A84C]/30 to-transparent" />
        <p className="text-[11px] text-neutral-600 uppercase tracking-widest flex-shrink-0">
          Last updated: {updated}
        </p>
      </div>
    </div>
  );
}

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-base font-black uppercase tracking-tight text-[#C9A84C] mb-3">{title}</h2>
      <div className="text-sm text-neutral-400 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function LegalFooterNav() {
  return (
    <div className="mt-16 pt-8 border-t border-[#1a1a1a] flex flex-wrap gap-4">
      {[
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms & Conditions" },
        { href: "/returns", label: "Returns Policy" },
      ].map((link) => (
        <Link key={link.href} href={link.href} className="text-xs text-neutral-500 hover:text-[#C9A84C] transition-colors uppercase tracking-wider">
          {link.label}
        </Link>
      ))}
    </div>
  );
}
