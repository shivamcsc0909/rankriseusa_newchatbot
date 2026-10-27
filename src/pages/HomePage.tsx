import { lazy, Suspense } from 'react';
import Hero from '../components/Hero';
import LazySection from '../components/LazySection';

import Seo from '../components/seo';

const Services = lazy(() => import('../components/Services'));
const About = lazy(() => import('../components/About'));
const WorkShowcase3D = lazy(() => import('../components/WorkShowcase3D'));
const MarketingBranding = lazy(() => import('../components/MarketingBranding'));
const OurClients = lazy(() => import('../components/OurClients'));
const Process = lazy(() => import('../components/Process'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const TrustedBy = lazy(() => import('../components/TrustedBy'));
const Faq = lazy(() => import('../components/Faq'));
const Contact = lazy(() => import('../components/Contact'));

export default function HomePage() {
  return (
    <main className="bg-[#05070a]">
      <Seo
        title="RankRise USA | AI SEO & Digital Marketing Agency"
        description="RankRise USA is a premier digital marketing agency driving business growth with AI SEO, web development, PPC ad management, and strategic online marketing."
        canonical="https://rankriseusa.com/"
        keywords={[
          "affordable seo",
          "online marketing company",
          "online marketing agency",
          "marketing comapny",
          "marketing agency",
          "online advertisement company",
          "online advertisement agency",
          "advertisement company",
          "advertisement agency",
          "ppc service",
          "digital company",
          "digital solution"
        ]}
      />
      <Hero />

      <LazySection minHeight="600px">
        <Suspense fallback={<div className="min-h-[600px]" />}>
          <Services />
        </Suspense>
      </LazySection>

      <LazySection minHeight="500px">
        <Suspense fallback={<div className="min-h-[500px]" />}>
          <About />
        </Suspense>
      </LazySection>

      <LazySection minHeight="450px">
        <Suspense fallback={<div className="min-h-[450px]" />}>
          <WorkShowcase3D />
        </Suspense>
      </LazySection>

      <LazySection minHeight="500px">
        <Suspense fallback={<div className="min-h-[500px]" />}>
          <MarketingBranding />
        </Suspense>
      </LazySection>

      <LazySection minHeight="300px">
        <Suspense fallback={<div className="min-h-[300px]" />}>
          <OurClients />
        </Suspense>
      </LazySection>

      <LazySection minHeight="400px">
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <Process />
        </Suspense>
      </LazySection>

      <LazySection minHeight="400px">
        <Suspense fallback={<div className="min-h-[400px]" />}>
          <Testimonials />
        </Suspense>
      </LazySection>

      <LazySection minHeight="250px">
        <Suspense fallback={<div className="min-h-[250px]" />}>
          <TrustedBy />
        </Suspense>
      </LazySection>

      <LazySection minHeight="500px">
        <Suspense fallback={<div className="min-h-[500px]" />}>
          <Faq />
        </Suspense>
      </LazySection>

      <LazySection minHeight="500px">
        <Suspense fallback={<div className="min-h-[500px]" />}>
          <Contact />
        </Suspense>
      </LazySection>
    </main>
  );
}
