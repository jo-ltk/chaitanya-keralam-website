import LandingPage from '@/components/landing/LandingPage';
import { getLandingContent } from '@/lib/landing-content';

// Content comes from the Payload "Landing page" global (/cms); it is refreshed when editors save.
export default async function Page() {
  const content = await getLandingContent();
  return <LandingPage content={content} />;
}
