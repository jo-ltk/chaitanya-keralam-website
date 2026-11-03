import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Our Values' };

const values = [
  {
    name: 'Anbu',
    meaning: 'love and compassion',
    text: 'Anbu is the warmth that makes a stranger a guest and a guest family. It is care for people, for animals and for the land, shown through kindness that expects nothing back. At Chaitanya Keralam it shapes how we welcome visitors and how we treat one another.',
  },
  {
    name: 'Unmai',
    meaning: 'truth and integrity',
    text: 'Unmai means being honest in word and deed, and holding to what is right even when it is difficult. It is the foundation of trust: in how we describe our journeys, how we deal with partners and how we keep our promises.',
  },
  {
    name: 'Patru',
    meaning: 'commitment and devotion',
    text: 'Patru is steady dedication to a purpose greater than oneself. It is showing up every day, with care, for our work, our community and our spiritual practice, and seeing a commitment through to the end.',
  },
  {
    name: 'Pagutharivu',
    meaning: 'rational thinking and discernment',
    text: 'Pagutharivu is the clear mind that weighs, questions and chooses wisely. It balances heart with reason, so that compassion and devotion are guided by understanding and good judgement.',
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
          <h2>{v.name}</h2>
          <p className="meaning">{v.meaning}</p>
          <p>{v.text}</p>
        </article>
      ))}
      <p><a href="/#experiences">Back to the home page</a></p>
    </main>
  );
}
