export default function CrisisCTA() {
  return (
    <section className="faq-card">
      <h2 className="text-xl font-semibold">Need help right now?</h2>
      <p className="muted">
        If you’re a Veteran or Service member and need to talk to someone, you’re not alone.
        These lines are free and confidential, 24/7.
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          className="link-chip tel"
          href="tel:988,1"
          aria-label="Call 988, then press 1 for the Veterans Crisis Line"
        >
          Call 988 (press 1)
        </a>
        <a
          className="link-chip sms"
          href="sms:838255"
          aria-label="Text the Veterans Crisis Line at 838255"
        >
          Text 838255
        </a>
        <a
          className="link-chip"
          href="https://www.veteranscrisisline.net/get-help-now/chat/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open secure online chat (opens in a new tab)"
        >
          Secure chat
        </a>
      </div>

      <p className="muted mt-3 text-sm">
        Outside the U.S.? Contact your local emergency number or the nearest crisis service.
      </p>
    </section>
  );
}

