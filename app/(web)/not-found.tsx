export default function NotFound() {
  return (
    <main style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center', fontFamily: 'Poppins, system-ui, sans-serif', color: '#123d32', background: '#f7f3e8' }}>
      <p style={{ margin: 0, fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', fontSize: 12, color: '#2f6b50' }}>Page not found</p>
      <h1 style={{ margin: 0, fontSize: 36 }}>We couldn&apos;t find that page.</h1>
      <a href="/" style={{ color: '#2f6b50' }}>Back to the home page</a>
    </main>
  );
}
