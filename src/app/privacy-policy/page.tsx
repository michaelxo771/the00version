import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — The 00s Version",
  description: "Privacy policy for The 00s Version, compliant with GDPR and EU data protection law.",
};

const LAST_UPDATED = "8 April 2025";
const COMPANY = "The 00s Version";
const EMAIL = "privacy@the00sversion.com";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <LegalHeader
          eyebrow="Legal"
          title="Privacy Policy"
          updated={LAST_UPDATED}
        />

        <LegalSection title="1. Who We Are">
          <p>
            {COMPANY} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is the data controller
            responsible for your personal data. We operate the website the00sversion.com and are committed
            to protecting and respecting your privacy in accordance with the General Data Protection
            Regulation (EU) 2016/679 (&ldquo;GDPR&rdquo;) and applicable national data protection laws.
          </p>
          <p className="mt-3">
            Contact: <a href={`mailto:${EMAIL}`} className="text-[#C9A84C] hover:underline">{EMAIL}</a>
          </p>
        </LegalSection>

        <LegalSection title="2. Data We Collect">
          <p>We collect and process the following categories of personal data:</p>
          <ul className="mt-3 space-y-2">
            {[
              ["Identity Data", "First name, last name, username or similar identifier."],
              ["Contact Data", "Billing address, delivery address, email address, phone number."],
              ["Financial Data", "Payment card details (processed securely by Stripe — we do not store card numbers)."],
              ["Transaction Data", "Details of products and services purchased, order history."],
              ["Technical Data", "IP address, browser type/version, time zone, browser plug-in types, operating system and platform."],
              ["Usage Data", "Information about how you use our website and products."],
              ["Marketing Data", "Preferences for receiving marketing communications from us."],
              ["Cookie Data", "As described in Section 8 below."],
            ].map(([label, desc]) => (
              <li key={label} className="flex gap-3 text-sm text-neutral-400">
                <span className="text-[#C9A84C] flex-shrink-0 mt-0.5">—</span>
                <span><span className="text-neutral-200 font-semibold">{label}:</span> {desc}</span>
              </li>
            ))}
          </ul>
        </LegalSection>

        <LegalSection title="3. Legal Basis for Processing">
          <p>We process your personal data on the following legal bases under Article 6 GDPR:</p>
          <ul className="mt-3 space-y-2">
            {[
              ["Contract performance", "To fulfil orders, process payments, and deliver products to you."],
              ["Legal obligation", "To comply with applicable accounting, tax, and consumer protection laws."],
              ["Legitimate interests", "To improve our website, prevent fraud, and administer our business."],
              ["Consent", "To send you marketing emails where you have opted in. You may withdraw consent at any time."],
            ].map(([basis, desc]) => (
              <li key={basis} className="flex gap-3 text-sm text-neutral-400">
                <span className="text-[#C9A84C] flex-shrink-0 mt-0.5">—</span>
                <span><span className="text-neutral-200 font-semibold">{basis}:</span> {desc}</span>
              </li>
            ))}
          </ul>
        </LegalSection>

        <LegalSection title="4. How We Use Your Data">
          <p>We use your personal data to:</p>
          <ul className="mt-3 space-y-1.5">
            {[
              "Process and fulfil your orders, including sending order confirmations and dispatch notifications.",
              "Manage your account and provide customer support.",
              "Process payments securely via our payment processor (Stripe).",
              "Comply with legal and regulatory obligations.",
              "Send you marketing communications where you have given consent.",
              "Improve our website, products, and services through analytics.",
              "Detect and prevent fraud and other illegal activities.",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-neutral-400">
                <span className="text-[#C9A84C] flex-shrink-0 mt-1">·</span>
                {item}
              </li>
            ))}
          </ul>
        </LegalSection>

        <LegalSection title="5. Data Sharing & Third Parties">
          <p>
            We do not sell your personal data. We share it only with trusted third parties who help
            us operate our business, each bound by data processing agreements:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              ["Stripe", "Payment processing. Privacy policy at stripe.com/privacy"],
              ["Resend", "Transactional email delivery. Privacy policy at resend.com/legal/privacy-policy"],
              ["Vercel", "Website hosting and infrastructure."],
              ["Analytics providers", "Aggregated, anonymised website analytics."],
            ].map(([name, desc]) => (
              <li key={name} className="flex gap-3 text-sm text-neutral-400">
                <span className="text-[#C9A84C] flex-shrink-0 mt-0.5">—</span>
                <span><span className="text-neutral-200 font-semibold">{name}:</span> {desc}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-neutral-400">
            Where we transfer data outside the European Economic Area (EEA), we ensure appropriate
            safeguards are in place, such as Standard Contractual Clauses (SCCs) approved by the
            European Commission.
          </p>
        </LegalSection>

        <LegalSection title="6. Data Retention">
          <p>
            We retain your personal data only as long as necessary for the purposes for which it was
            collected:
          </p>
          <ul className="mt-3 space-y-1.5">
            {[
              "Order and transaction data: 7 years (tax and accounting obligations under EU law).",
              "Account data: for the duration of your account plus 2 years.",
              "Marketing data: until you unsubscribe or withdraw consent.",
              "Technical/cookie data: as described in our Cookie Policy (Section 8).",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-neutral-400">
                <span className="text-[#C9A84C] flex-shrink-0 mt-1">·</span>
                {item}
              </li>
            ))}
          </ul>
        </LegalSection>

        <LegalSection title="7. Your Rights Under GDPR">
          <p>
            Under the GDPR, you have the following rights regarding your personal data. To exercise
            any of these rights, contact us at{" "}
            <a href={`mailto:${EMAIL}`} className="text-[#C9A84C] hover:underline">{EMAIL}</a>:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              ["Right of access", "Request a copy of the personal data we hold about you."],
              ["Right to rectification", "Request correction of inaccurate or incomplete data."],
              ["Right to erasure", "Request deletion of your personal data ('right to be forgotten'), subject to legal retention obligations."],
              ["Right to restriction", "Request that we restrict processing of your data in certain circumstances."],
              ["Right to data portability", "Receive your data in a structured, commonly used, machine-readable format."],
              ["Right to object", "Object to processing based on legitimate interests, including direct marketing."],
              ["Right to withdraw consent", "Where processing is based on consent, withdraw it at any time without affecting prior processing."],
              ["Right to lodge a complaint", "File a complaint with your national supervisory authority (e.g. the Data Protection Commission in Ireland or ICO in the UK)."],
            ].map(([right, desc]) => (
              <li key={right} className="flex gap-3 text-sm text-neutral-400">
                <span className="text-[#C9A84C] flex-shrink-0 mt-0.5">—</span>
                <span><span className="text-neutral-200 font-semibold">{right}:</span> {desc}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-neutral-400">
            We will respond to all requests within 30 days. Requests are free of charge, except where
            manifestly unfounded or excessive.
          </p>
        </LegalSection>

        <LegalSection title="8. Cookies">
          <p>
            We use cookies and similar tracking technologies to enhance your experience on our site.
            Cookies are small text files stored on your device.
          </p>
          <ul className="mt-3 space-y-2">
            {[
              ["Strictly necessary", "Essential for the website to function (e.g. cart contents, session tokens). Cannot be disabled."],
              ["Functional", "Remember your preferences (e.g. cookie consent settings)."],
              ["Analytics", "Anonymised data on how visitors use our site. Only placed with your consent."],
              ["Marketing", "Track visitors across websites for advertising purposes. Only placed with your consent."],
            ].map(([type, desc]) => (
              <li key={type} className="flex gap-3 text-sm text-neutral-400">
                <span className="text-[#C9A84C] flex-shrink-0 mt-0.5">—</span>
                <span><span className="text-neutral-200 font-semibold">{type}:</span> {desc}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-neutral-400">
            You can change your cookie preferences at any time by clearing your browser's local storage
            or adjusting browser settings. Most browsers allow you to refuse cookies via their settings.
          </p>
        </LegalSection>

        <LegalSection title="9. Security">
          <p>
            We implement appropriate technical and organisational measures to protect your personal data
            against unauthorised access, alteration, disclosure, or destruction. These include SSL/TLS
            encryption for data in transit, secure payment processing via Stripe (PCI-DSS compliant),
            and restricted access to personal data within our organisation.
          </p>
          <p className="mt-3 text-sm text-neutral-400">
            In the event of a personal data breach, we will notify affected individuals and the relevant
            supervisory authority within 72 hours where required by law.
          </p>
        </LegalSection>

        <LegalSection title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. Material changes will be communicated
            via email or a prominent notice on our website. The &ldquo;Last updated&rdquo; date at the
            top of this page reflects the most recent revision.
          </p>
        </LegalSection>

        <LegalSection title="11. Contact Us">
          <p>
            For any questions, concerns, or data rights requests, please contact our Data Protection
            contact:
          </p>
          <div className="mt-3 bg-[#111111] border border-[#1a1a1a] rounded-sm p-4 text-sm text-neutral-400">
            <p className="font-semibold text-neutral-200">{COMPANY}</p>
            <p className="mt-1">Email: <a href={`mailto:${EMAIL}`} className="text-[#C9A84C] hover:underline">{EMAIL}</a></p>
          </div>
        </LegalSection>

        <LegalFooterNav />
      </div>
    </div>
  );
}

// ── Shared sub-components ────────────────────────────────────────────────────

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
        <Link
          key={link.href}
          href={link.href}
          className="text-xs text-neutral-500 hover:text-[#C9A84C] transition-colors uppercase tracking-wider"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
