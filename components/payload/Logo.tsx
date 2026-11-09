// Replaces the Payload logo on the CMS login page and nav.
export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <img src="/assets/logo.png" alt="Chaitanya Keralam" width={56} height={54} style={{ height: 54, width: 'auto' }} />
      <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--theme-text)' }}>Chaitanya Keralam</span>
    </div>
  );
}
