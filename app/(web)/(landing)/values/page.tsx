import type { Metadata } from 'next';
import { getValuesContent } from '@/lib/values-content';

export const metadata: Metadata = { title: 'Our Values' };

// Content comes from the Payload "Values page" global (/cms); it is refreshed when editors save.
export default async function Page() {
  const c = await getValuesContent();
  return (
    <main className="values-page">
      <header>
        <a href="/">{c.header.backLink}</a>
        <h1>{c.header.heading}</h1>
        <p>{c.header.lead}</p>
      </header>
      {c.values.map((v, i) => (
        <article key={i} id={v.name.toLowerCase()}>
          <h2>{v.name} ({v.tamil})</h2>
          <p className="meaning">{v.meaning}</p>
          <p>{v.text}</p>
          <p>{v.context}</p>
        </article>
      ))}
      <section className="further-reading">
        <h2>{c.furtherReading.heading}</h2>
        <p>
          {c.furtherReading.text}{' '}
          <a href={c.furtherReading.linkUrl} target="_blank" rel="noopener noreferrer">{c.furtherReading.linkText}</a>.
        </p>
      </section>
      <p><a href="/#experiences">{c.footer.backHome}</a></p>
    </main>
  );
}
