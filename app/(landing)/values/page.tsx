import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Our Values' };

const values = [
  {
    name: 'Anbu',
    tamil: 'அன்பு',
    meaning: 'Love / Compassion',
    text: 'Loving-kindness, empathy, and unconditional affection toward family, fellow humans, and all living creatures.',
    context: 'In classical Tamil philosophy like the Thirukkural, Anbu is considered the foundational virtue of human life, the fuel that makes a human soul truly alive.',
  },
  {
    name: 'Unmai',
    tamil: 'உண்மை',
    meaning: 'Truth / Honesty',
    text: 'Truthfulness, reality, sincerity, and integrity in thoughts, words, and actions.',
    context: 'Standing firmly by facts and inner truth without deceit or pretense.',
  },
  {
    name: 'Patru',
    tamil: 'பற்று',
    meaning: 'Attachment / Devotion / Loyalty',
    text: 'A deep-seated devotion, attachment, or commitment to a principle, language (Tamil-patru), country (Nattu-patru), or person.',
    context: "It defines a human's sense of duty and loyalty toward what they hold dear, giving direction to one's love and truth.",
  },
  {
    name: 'Pagutharivu',
    tamil: 'பகுத்தறிவு',
    meaning: 'Rationalism / Discernment',
    text: 'Critical thinking, logical reasoning, and analytical intelligence. It literally means the "ability to divide/analyze (pagu) knowledge (arivu)".',
    context: 'A cornerstone of the modern Tamil social reform movement (popularized by leaders like Periyar), Pagutharivu implores individuals to question dogma, reject blind superstitions, and evaluate everything using scientific logic and cause-and-effect reasoning.',
  },
];

export default function Page() {
  return (
    <main className="values-page">
      <header>
        <a href="/">← Chaitanya Keralam</a>
        <h1>Values our elders lived by</h1>
        <p>Four simple values for a balanced life, and the ones we hope to pass on to our children.</p>
      </header>
      {values.map((v) => (
        <article key={v.name} id={v.name.toLowerCase()}>
          <h2>{v.name} ({v.tamil})</h2>
          <p className="meaning">{v.meaning}</p>
          <p>{v.text}</p>
          <p>{v.context}</p>
        </article>
      ))}
      <section className="further-reading">
        <h2>Further reading</h2>
        <p>
          These values are rooted in classical Tamil thought. Read more about the{' '}
          <a href="https://en.wikipedia.org/wiki/Sangam_literature" target="_blank" rel="noopener noreferrer">Sangam literature</a>.
        </p>
      </section>
      <p><a href="/#experiences">Back to the home page</a></p>
    </main>
  );
}
