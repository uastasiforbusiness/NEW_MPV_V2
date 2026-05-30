export function PrivacyLinks() {
  return (
    <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
      <a
        href="https://www.iubenda.com/privacy-policy/your_id"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-[var(--accent)] transition-colors"
      >
        Privacy Policy
      </a>
      <span aria-hidden="true">·</span>
      <a
        href="https://www.iubenda.com/cookie-policy/your_id"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-[var(--accent)] transition-colors"
      >
        Cookie Policy
      </a>
      <span aria-hidden="true">·</span>
      <a
        href="/recesso/modulo"
        className="hover:text-[var(--accent)] transition-colors"
      >
        Diritto di Recesso
      </a>
    </div>
  );
}
