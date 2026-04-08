import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy — The 00s Version",
  description: "Cookie policy for The 00s Version — what cookies we use, why, and how to manage them.",
};

const LAST_UPDATED = "April 2026";
const PRIVACY_EMAIL = "privacy@the00sversion.com";

// ── Cookie table data ─────────────────────────────────────────────────────────

const COOKIES = [
  {
    name: "cookie-consent",
    purpose: "Stores your cookie preference so we don't ask on every visit.",
    duration: "1 year",
    type: "Essential",
  },
  {
    name: "cart",
    purpose: "Stores the contents of your shopping cart between pages and sessions.",
    duration: "Session",
    type: "Essential",
  },
  {
    name: "__stripe_mid",
    purpose: "Stripe fraud prevention and payment processing.",
    duration: "1 year",
    type: "Essential / Third-party",
  },
  {
    name: "__stripe_sid",
    purpose: "Stripe session identifier for secure payment processing.",
    duration: "Session",
    type: "Essential / Third-party",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Legal"
          title="Cookie Policy"
          updated={LAST_UPDATED}
        />

        {/* What are cookies */}
        <PolicySection title="What Are Cookies?">
          <p>
            Cookies are small text files that a website stores on your device when you visit. They
            are widely used to make websites work correctly, improve efficiency, and provide
            information to site owners. Cookies cannot run programs or deliver viruses to your device.
          </p>
          <p className="mt-3">
            We only use cookies that are strictly necessary for the operation of this site, or that
            are set by trusted third-party services we rely on to process payments securely. We do
            not use analytics or marketing cookies.
          </p>
        </PolicySection>

        {/* Essential cookies */}
        <PolicySection title="Essential Cookies">
          <p>
            Essential cookies are necessary for the website to function. They cannot be disabled
            without breaking core functionality. We use essential cookies for:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              ["Session management", "To maintain your browsing session across pages."],
              ["Cart persistence", "To remember the items you have added to your cart."],
              ["Cookie consent preference", "To record your cookie choice so we don't ask on every visit."],
            ].map(([label, desc]) => (
              <li key={label as string} className="flex gap-3 text-sm text-neutral-400">
                <span className="text-[#C9A84C] flex-shrink-0 mt-0.5">—</span>
                <span>
                  <span className="text-neutral-200 font-semibold">{label}:</span> {desc}
                </span>
              </li>
            ))}
          </ul>
        </PolicySection>

        {/* Analytics cookies */}
        <PolicySection title="Analytics Cookies">
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-5">
            <p className="text-sm font-black uppercase tracking-wider text-[#C9A84C] mb-2">
              None currently used
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              We do not currently use any analytics cookies or third-party tracking tools (such as
              Google Analytics) on this site. If this changes, this policy will be updated and you
              will be given the opportunity to opt in before any analytics cookies are placed on your
              device.
            </p>
          </div>
        </PolicySection>

        {/* Marketing cookies */}
        <PolicySection title="Marketing Cookies">
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-5">
            <p className="text-sm font-black uppercase tracking-wider text-[#C9A84C] mb-2">
              None currently used — opt-in only
            </p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              We do not place any marketing or advertising cookies on your device. We have no
              retargeting pixels, ad-network trackers, or social media cookies active on this site.
              Any future use of marketing cookies will require your explicit opt-in consent, in
              accordance with the EU ePrivacy Directive and GDPR.
            </p>
          </div>
        </PolicySection>

        {/* Third-party cookies */}
        <PolicySection title="Third-Party Cookies">
          <p>
            We use <span className="text-neutral-200 font-semibold">Stripe</span> to process
            payments securely. Stripe may set cookies on your device during the checkout process to
            prevent fraud and manage payment sessions. These cookies are essential to completing your
            purchase and are governed by Stripe&apos;s own privacy and cookie policies.
          </p>
          <ul className="mt-3 space-y-1.5">
            {[
              "Stripe cookies are only set during checkout — not on regular browsing sessions.",
              "We do not have access to the data stored in Stripe's cookies.",
              "Stripe is PCI-DSS compliant. See stripe.com/privacy for full details.",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-neutral-400">
                <span className="text-[#C9A84C] flex-shrink-0 mt-1">·</span>
                {item}
              </li>
            ))}
          </ul>
        </PolicySection>

        {/* Cookie table */}
        <div className="mb-12">
          <h2 className="text-base font-black uppercase tracking-tight text-[#C9A84C] mb-5">
            Cookie Reference Table
          </h2>
          <div className="overflow-x-auto rounded-sm border border-[#1a1a1a]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#111111] border-b border-[#1a1a1a]">
                  {["Cookie Name", "Purpose", "Duration", "Type"].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-wider text-[#C9A84C]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COOKIES.map(({ name, purpose, duration, type }, i) => (
                  <tr
                    key={name}
                    className={`border-b border-[#1a1a1a] last:border-0 ${
                      i % 2 === 0 ? "bg-[#0d0d0d]" : "bg-[#0a0a0a]"
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-[11px] font-semibold text-neutral-200 whitespace-nowrap">
                      {name}
                    </td>
                    <td className="px-4 py-3 text-neutral-400 text-xs leading-relaxed">
                      {purpose}
                    </td>
                    <td className="px-4 py-3 text-neutral-400 whitespace-nowrap text-xs">
                      {duration}
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      <span className="text-[#C9A84C]/80">{type}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to manage cookies */}
        <PolicySection title="How to Manage Cookies">
          <p>
            You can control and delete cookies through your browser settings. Most browsers allow
            you to:
          </p>
          <ul className="mt-3 space-y-1.5">
            {[
              "View which cookies are stored and delete them individually.",
              "Block third-party cookies from being set.",
              "Block all cookies from specific sites.",
              "Block all cookies from all sites (note: this will break cart and checkout functionality).",
              "Delete all cookies when you close your browser.",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-neutral-400">
                <span className="text-[#C9A84C] flex-shrink-0 mt-1">·</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-neutral-500">
            For guidance on managing cookies in your specific browser, visit:{" "}
            <span className="text-neutral-400">
              Chrome — Settings › Privacy and security › Cookies and other site data.
              Firefox — Settings › Privacy & Security › Cookies and Site Data.
              Safari — Preferences › Privacy.
              Edge — Settings › Cookies and site permissions.
            </span>
          </p>
          <p className="mt-3">
            Disabling essential cookies will prevent core site features — including your shopping
            cart and checkout — from working correctly.
          </p>
        </PolicySection>

        {/* Contact */}
        <PolicySection title="Contact">
          <p>
            If you have any questions about our use of cookies or this policy, please contact us:
          </p>
          <div className="mt-4 bg-[#111111] border border-[#1a1a1a] rounded-sm p-5 text-sm text-neutral-400">
            <p className="font-semibold text-neutral-200">The 00s Version — Privacy</p>
            <p className="mt-1">
              Email:{" "}
              <a
                href={`mailto:${PRIVACY_EMAIL}`}
                className="text-[#C9A84C] hover:underline"
              >
                {PRIVACY_EMAIL}
              </a>
            </p>
          </div>
        </PolicySection>

        {/* Last updated note */}
        <div className="mb-12 border-l-2 border-[#C9A84C]/40 pl-5">
          <p className="text-sm text-neutral-500 leading-relaxed">
            <span className="text-neutral-400 font-semibold">Last updated:</span> {LAST_UPDATED}.
            This policy may be updated from time to time. Any material changes will be communicated
            via a notice on our website or by email. Continued use of our site after changes
            constitutes acceptance of the revised policy.
          </p>
        </div>

        <FooterNav />
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PageHeader({
  eyebrow,
  title,
  updated,
}: {
  eyebrow: string;
  title: string;
  updated: string;
}) {
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

function PolicySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10 pl-5 border-l border-[#C9A84C]/20">
      <h2 className="text-base font-black uppercase tracking-tight text-[#C9A84C] mb-3">{title}</h2>
      <div className="text-sm text-neutral-400 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

function FooterNav() {
  return (
    <div className="mt-16 pt-8 border-t border-[#1a1a1a] flex flex-wrap gap-4">
      {[
        { href: "/privacy-policy", label: "Privacy Policy" },
        { href: "/terms", label: "Terms & Conditions" },
        { href: "/returns", label: "Returns Policy" },
        { href: "/faq", label: "FAQ" },
        { href: "/size-guide", label: "Size Guide" },
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
