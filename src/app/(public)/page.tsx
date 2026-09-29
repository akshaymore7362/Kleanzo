import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsTestimonialsSection } from '@/components/home/StatsTestimonialsSection';
import { ServicesGridSection } from '@/components/home/ServicesGridSection';
import { FeatureComparisonSection } from '@/components/home/FeatureComparisonSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { StainDiagnosticSection } from '@/components/home/StainDiagnosticSection';
import { WhyKleanzoSection } from '@/components/home/WhyKleanzoSection';
import { FeaturedAgenciesSection } from '@/components/home/FeaturedAgenciesSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { ProjectCtaSection } from '@/components/home/ProjectCtaSection';

export const metadata = {
  title: 'Kleanzo | Deep Cleaning. Zero Stress.',
  description: 'Professional deep cleaning for your home handled by trained teams with transparent pricing and quality you can trust.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Banner & Core Value Prop */}
      <HeroSection />

      {/* 2. Live Platform Stats & Quick Review Counter */}
      <StatsTestimonialsSection />

      {/* 3. Popular Deep Cleaning Services Grid */}
      <ServicesGridSection />

      {/* 4. Interactive Instant Cost Estimator & Kleanzo vs Local Maids Table */}
      <FeatureComparisonSection />

      {/* 5. How It Works - 8 Step Journey */}
      <HowItWorksSection />

      {/* 6. Smart AI Stain Diagnostic & Substrate Calculator */}
      <StainDiagnosticSection />

      {/* 7. Why Kleanzo & Interactive Before/After Comparison Slider */}
      <WhyKleanzoSection />

      {/* 8. Kleanzo Standards & Verified Crew Assurance */}
      <FeaturedAgenciesSection />

      {/* 10. Verified Customer Reviews & Ratings */}
      <TestimonialsSection />

      {/* 11. Call to Action Banner */}
      <ProjectCtaSection />
    </main>
  );
}
