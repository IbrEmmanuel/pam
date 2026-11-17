import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Legal — PAM Africa",
  description:
    "How PAM Africa collects, uses, shares, and protects your personal data, plus cookie choices and controls.",
};

export function PrivacyPage() {
  const updated = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date());

  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title */}
      <header className="mb-8">
        <h1 className="text-[clamp(2rem,5vw,64px)]  font-semibold tracking-tight">
          Privacy & Legal
        </h1>
      </header>

      <div className="space-y-10 text-[15px] leading-relaxed">
        {/* Who we are */}
        <section>
          <h2 className="font-bold">Who we are</h2>
          <p className="mt-2">
            PAM Africa Ltd (“PAM Africa”, “we”, “us”, “our”) provides an Energy
            Enabler Ecosystem with tools and services.
          </p>
        </section>

        {/* What this policy covers */}
        <section>
          <h2 className="font-bold">What this policy covers</h2>
          <p className="mt-2">
            This policy applies when you use our websites, apps, portals, forms,
            or contact us.
          </p>
        </section>

        {/* Personal data we collect */}
        <section>
          <h2 className="font-bold">Personal data we collect</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <span className="font-semibold">Identity &amp; contact:</span>{" "}
              name, email, phone, organization, role.
            </li>
            <li>
              <span className="font-semibold">Account &amp; usage:</span> login
              details, permissions, in-app events, pages viewed, session times,
              device/IP, browser/OS.
            </li>
            <li>
              <span className="font-semibold">Operational/project:</span> files
              you upload, site notes, O&amp;M logs, energy device/meter data,
              carbon-impact records (where enabled by your organization).
            </li>
            <li>
              <span className="font-semibold">Financial:</span> invoices and
              payment/payout metadata handled through PCI-compliant processors.
            </li>
            <li>
              <span className="font-semibold">Communications:</span> emails,
              support tickets, call/meeting notes.
            </li>
          </ul>
        </section>

        {/* How we collect it */}
        <section>
          <h2 className="font-bold">How we collect it</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>You provide it (forms, emails, uploads).</li>
            <li>It’s collected automatically (cookies/telemetry).</li>
            <li>
              Your organization or partners share it based on lawful
              instructions.
            </li>
          </ul>
        </section>

        {/* Why we process it */}
        <section>
          <h2 className="font-bold">Why we process it</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <span className="font-semibold">Contract necessity:</span>{" "}
              create/manage accounts; deploy tools and services
            </li>
            <li>
              <span className="font-semibold">Consent:</span> non-essential
              cookies, certain marketing, and optional profiling features.
            </li>
            <li>
              <span className="font-semibold">Legitimate interests:</span>{" "}
              product safety, quality, analytics, fraud/threat detection -
              balanced against your rights.
            </li>
            <li>
              <span className="font-semibold">Legal obligation:</span>{" "}
              tax/finance, AML/KYC (if applicable), regulator requests.
            </li>
            <li>
              <span className="font-semibold">Vital/public interest:</span>{" "}
              where applicable in emergencies or under law.
            </li>
          </ul>
        </section>

        {/* What we do with it */}
        <section>
          <h2 className="font-bold">What we do with it</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              Provide features and personalize workspaces; operate and secure
              the Services.
            </li>
            <li>
              Analyze performance and improve reliability; run pilots and betas.
            </li>
            <li>Process payments/payouts; manage billing and refunds.</li>
            <li>
              Resolve issues; communicate changes, updates, and service notices.
            </li>
            <li>
              To provide and maintain our Service, including monitoring usage.
            </li>
            <li>
              To manage your Account as a registered user, enabling
              functionalities available to you.
            </li>
            <li>
              For the performance of a contract related to products, items, or
              services purchased or any other contract with us through the
              Service.
            </li>
            <li>
              To contact you by email, telephone, SMS, or push notifications
              regarding updates or informative communications, including
              security updates.
            </li>
            <li>
              To provide you with news, special offers, and information about
              goods, services, and events similar to those you use or enquire
              about (unless you opt out).
            </li>
            <li>To manage your requests and support tickets.</li>
            <li>
              For business transfers (e.g., merger, divestiture, restructuring,
              reorganization, dissolution, sale or transfer of assets).
            </li>
            <li>
              For other purposes such as data analysis, usage trends, campaign
              effectiveness, and improving services, products, marketing, and
              your experience.
            </li>
          </ul>

          <p className="mt-4 font-semibold">
            We may share your personal information in the following situations:
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <span className="font-semibold">With Service Providers:</span> to
              monitor/analyze use of our Service, and to contact you.
            </li>
            <li>
              <span className="font-semibold">For business transfers:</span>{" "}
              during negotiations or completion of a merger, sale, financing, or
              acquisition.
            </li>
            <li>
              <span className="font-semibold">With Affiliates:</span>{" "}
              parent/holding companies, subsidiaries, joint ventures, or
              companies under common control (subject to this policy).
            </li>
            <li>
              <span className="font-semibold">With business partners:</span> to
              offer certain products, services, or promotions.
            </li>
            <li>
              <span className="font-semibold">With your consent:</span> for any
              other purpose you approve.
            </li>
          </ul>
        </section>

        {/* Cookies & similar tech */}
        <section>
          <h2 className="font-bold">Cookies &amp; similar tech</h2>
          <p className="mt-2">
            We use: strictly necessary (auth/session), functional, analytics,
            and (optional) advertising cookies. Manage preferences in our banner
            and your browser.
          </p>
        </section>

        {/* Sharing your information (capsule bullets, as per brief) */}
        <section>
          <h2 className="font-bold">Sharing your information</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Processors</li>
            <li>Project partners</li>
            <li>Corporate events, as allowed by law.</li>
            <li>Regulators/law enforcement where legally required.</li>
          </ul>
        </section>

        {/* International transfers */}
        <section>
          <h2 className="font-bold">International transfers</h2>
          <p className="mt-2">
            We prefer storage/processing in Nigeria when feasible. If we
            transfer data abroad, we use NDPR-recognized mechanisms (e.g.,
            appropriate safeguards, contractual clauses, or explicit consent)
            plus technical/organizational protections.
          </p>
        </section>

        {/* Retention */}
        <section>
          <h2 className="font-bold">Retention</h2>
          <p className="mt-2">
            We keep data only as long as needed for stated purposes and legal
            obligations. We will retain and use Personal Data as necessary to
            comply with legal obligations, resolve disputes, and enforce
            agreements and policies. Usage Data is generally retained for a
            shorter period unless needed to strengthen security, improve
            functionality, or where longer retention is legally required.
          </p>
        </section>

        {/* Your rights */}
        <section>
          <h2 className="font-bold">Your Privacy rights</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              Access, rectification, erasure, objection/restriction,
              portability, withdrawal of consent.
            </li>
            <li>
              Objection to profiling/automated decisions with human review for
              significant effects.
            </li>
          </ul>
          <p className="mt-2">
            How: email{" "}
            <a className="underline" href="mailto:support@pamafrica.com">
              support@pamafrica.com
            </a>
          </p>
        </section>

        {/* Children */}
        <section>
          <h2 className="font-bold">Children</h2>
          <p className="mt-2">
            Our services are not directed to children under the age of 13. We do
            not knowingly collect personally identifiable information from
            anyone under 13. If you are a parent or guardian and are aware your
            child has provided Personal Data, please contact us. If we become
            aware we have collected Personal Data from a child under 13 without
            verified parental consent, we will remove it. Where consent is
            legally required, we may request parental consent before collection
            and use.
          </p>
        </section>

        {/* Third-party links */}
        <section>
          <h2 className="font-bold">Third-party links</h2>
          <p className="mt-2">
            We may direct you to third-party websites from our site. Linked
            sites have their own privacy notices, policies, and cookie use.
            Please review their practices. PAM Africa is not responsible for the
            content, use, or privacy practices of linked sites.
          </p>
        </section>

        {/* Changes */}
        <section>
          <h2 className="font-bold">Changes</h2>
          <p className="mt-2">
            We reserve the right to amend this Privacy notice at any time and
            will post any revisions on this page.
          </p>
        </section>

        {/* Cookie Policy */}
        <section>
          <h2 className="font-bold">Cookie Policy</h2>

          <h3 className="mt-3 font-bold">What are cookies?</h3>
          <p className="mt-2">
            Small files saved on your device that help our website/app work,
            remember settings, and understand usage. When you access the Service
            via a mobile device, we may collect device details (e.g., device
            type, unique ID, IP address, OS, browser), unique identifiers, and
            other diagnostic data, as well as information your browser sends
            when you visit.
          </p>

          <h3 className="mt-3 font-bold">Tracking Technologies and Cookies</h3>
          <p className="mt-2">
            We use cookies and similar technologies (beacons, tags, scripts) to
            track activity and store certain information, helping us improve and
            analyze our Service.
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <span className="font-semibold">Cookies/Browser Cookies:</span>{" "}
              you can refuse or be notified when a cookie is set (some features
              may not work without cookies).
            </li>
            <li>
              <span className="font-semibold">Flash Cookies:</span> used for
              preferences/activity storage (managed differently from browser
              cookies). See Adobe guidance for disabling local shared objects.
            </li>
            <li>
              <span className="font-semibold">Web Beacons:</span> small
              electronic files used for stats (e.g., counting page views or
              email opens).
            </li>
          </ul>

          <h3 className="mt-3 font-bold">Types we use</h3>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Strictly necessary</li>
            <li>Functional</li>
            <li>Analytics</li>
            <li>Advertising</li>
          </ul>

          <h3 className="mt-3 font-bold">Specific cookie purposes</h3>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <span className="font-semibold">
                Necessary / Essential (Session) — Administered by us:
              </span>{" "}
              core functionality and authentication; fraud prevention.
            </li>
            <li>
              <span className="font-semibold">
                Cookies Policy / Notice Acceptance (Persistent) — Administered
                by us:
              </span>{" "}
              remember your cookie choice.
            </li>
            <li>
              <span className="font-semibold">
                Functionality (Persistent) — Administered by us:
              </span>{" "}
              remember preferences (e.g., login or language).
            </li>
          </ul>

          <h3 className="mt-3 font-bold">Your choices</h3>
          <p className="mt-2">
            Use our cookie banner to <strong>Accept All</strong>,{" "}
            <strong>Reject Non-Essential</strong>, or{" "}
            <strong>Manage Preferences</strong>. You can also change browser
            settings to block or delete cookies; note some features may not work
            as expected.
          </p>

          <h3 className="mt-3 font-bold">Updates</h3>
          <p className="mt-2">
            We review cookies regularly and update this page and the banner.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="font-bold">Contact</h2>
          <p className="mt-2">
            Questions about this policy? Email{" "}
            <a className="underline" href="mailto:support@pamafrica.com">
              support@pamafrica.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
