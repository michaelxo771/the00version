import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions — The 00s Version",
  description: "Terms and conditions for purchasing from The 00s Version, compliant with EU consumer law.",
};

const LAST_UPDATED = "8 April 2025";
const COMPANY = "The 00s Version";
const EMAIL = "hello@the00sversion.com";

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <LegalHeader eyebrow="Legal" title="Terms & Conditions" updated={LAST_UPDATED} />

        <p className="text-sm text-neutral-400 leading-relaxed mb-10">
          Please read these Terms and Conditions carefully before placing an order. By purchasing from
          The 00s Version you agree to be bound by these terms. These terms are governed by EU law,
          including the Consumer Rights Directive 2011/83/EU and the Sale of Goods Directive 1999/44/EC.
        </p>

        <LegalSection title="1. About Us">
          <p>
            {COMPANY} operates the ecommerce store at the00sversion.com. References to
            &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo; in these terms refer to{" "}
            {COMPANY}. For support, contact{" "}
            <a href={`mailto:${EMAIL}`} className="text-[#C9A84C] hover:underline">{EMAIL}</a>.
          </p>
        </LegalSection>

        <LegalSection title="2. Your Order">
          <p>
            By placing an order you make an offer to purchase our products. A binding contract is formed
            when we send you an order confirmation email. We reserve the right to refuse any order at our
            discretion (e.g. payment failure, suspected fraud, stock unavailability).
          </p>
          <p className="mt-3">
            You must be at least 18 years old to make a purchase. By placing an order you confirm you
            meet this requirement.
          </p>
        </LegalSection>

        <LegalSection title="3. Prices & Payment">
          <ul className="space-y-2">
            {[
              "All prices are displayed in Euros (EUR) and include applicable VAT where required by law.",
              "We accept payment via major debit/credit cards and other methods offered by our payment processor (Stripe).",
              "Payment is taken in full at the time of order. We do not store your card details.",
              "We reserve the right to correct pricing errors. If a pricing error affects your order, we will contact you and give you the option to proceed at the correct price or cancel.",
              "Promotional codes are applied at checkout and cannot be combined with other offers unless explicitly stated.",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-neutral-400">
                <span className="text-[#C9A84C] flex-shrink-0 mt-1">·</span>
                {item}
              </li>
            ))}
          </ul>
        </LegalSection>

        <LegalSection title="4. Delivery">
          <ul className="space-y-2">
            {[
              "Delivery times are estimates only and are not guaranteed. We are not liable for delays outside our reasonable control.",
              "Standard delivery: 5–7 business days. Express: 2–3 business days. Overnight: next business day (where available).",
              "Free standard delivery applies to orders over €150.",
              "Risk and ownership of the goods transfer to you upon delivery.",
              "If you provide incorrect delivery details and goods are lost or returned, re-delivery charges may apply.",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-neutral-400">
                <span className="text-[#C9A84C] flex-shrink-0 mt-1">·</span>
                {item}
              </li>
            ))}
          </ul>
        </LegalSection>

        <LegalSection title="5. Consumer Right of Withdrawal (14-Day Returns)">
          <p>
            Under the Consumer Rights Directive 2011/83/EU, you have the right to withdraw from your
            purchase within <strong className="text-neutral-200">14 calendar days</strong> of receiving
            your order, without giving any reason.
          </p>
          <p className="mt-3">
            To exercise this right, notify us at{" "}
            <a href={`mailto:${EMAIL}`} className="text-[#C9A84C] hover:underline">{EMAIL}</a>{" "}
            within the 14-day period. Full details are set out in our{" "}
            <Link href="/returns" className="text-[#C9A84C] hover:underline">Returns Policy</Link>.
          </p>
          <p className="mt-3">
            Exceptions: The right of withdrawal does not apply to goods that have been personalised or
            made to order, sealed goods that are not suitable for return once opened for hygiene reasons,
            or goods that have been clearly used beyond reasonable inspection.
          </p>
        </LegalSection>

        <LegalSection title="6. Defective or Non-Conforming Goods">
          <p>
            Under EU law (Sale of Goods Directive 1999/44/EC, as amended), we guarantee that all goods
            are in conformity with the contract and free from defects for a period of at least{" "}
            <strong className="text-neutral-200">2 years</strong> from the date of delivery.
          </p>
          <p className="mt-3">
            If goods are defective or do not conform, you have the right to repair, replacement, price
            reduction, or a full refund. Contact us at{" "}
            <a href={`mailto:${EMAIL}`} className="text-[#C9A84C] hover:underline">{EMAIL}</a>{" "}
            with proof of purchase and a description of the issue.
          </p>
        </LegalSection>

        <LegalSection title="7. Intellectual Property">
          <p>
            All content on this website — including logos, graphics, product names, copy, and
            design — is the intellectual property of {COMPANY} or its licensors. You may not
            reproduce, distribute, or use any content without our prior written permission.
          </p>
        </LegalSection>

        <LegalSection title="8. Limitation of Liability">
          <p>
            Nothing in these terms limits or excludes our liability for death or personal injury caused
            by negligence, fraud, or any other liability that cannot be excluded under EU law.
          </p>
          <p className="mt-3">
            Subject to the above, our total liability in connection with any order shall not exceed
            the total amount paid by you for that order.
          </p>
        </LegalSection>

        <LegalSection title="9. Online Dispute Resolution">
          <p>
            The European Commission provides an Online Dispute Resolution (ODR) platform for consumers
            in the EU:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A84C] hover:underline"
            >
              ec.europa.eu/consumers/odr
            </a>
            . Our email address for ODR purposes is{" "}
            <a href={`mailto:${EMAIL}`} className="text-[#C9A84C] hover:underline">{EMAIL}</a>.
          </p>
        </LegalSection>

        <LegalSection title="10. Governing Law">
          <p>
            These terms are governed by the laws of the European Union and the laws of the country in
            which we are registered. Any disputes will be subject to the exclusive jurisdiction of the
            competent courts, without prejudice to your rights as a consumer under the mandatory
            provisions of the law of your country of residence.
          </p>
        </LegalSection>

        <LegalSection title="11. Changes to These Terms">
          <p>
            We may update these terms from time to time. Changes will be posted on this page with an
            updated date. Continued use of our site after changes are posted constitutes acceptance of
            the new terms.
          </p>
        </LegalSection>

        <LegalSection title="12. Contact">
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-sm p-4 text-sm text-neutral-400">
            <p className="font-semibold text-neutral-200">{COMPANY}</p>
            <p className="mt-1">Email: <a href={`mailto:${EMAIL}`} className="text-[#C9A84C] hover:underline">{EMAIL}</a></p>
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
