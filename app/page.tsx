import { CtaBanner } from "@/app/components/cta-banner";
import { FeaturesSection } from "@/app/components/features-section";
import { HeroSection } from "@/app/components/hero-section";
import { HowItWorks } from "@/app/components/how-it-works";
import { SectionDivider } from "@/app/components/section-divider";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";
import { TemplateShowcase } from "@/app/components/template-showcase";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark">
      <SiteHeader />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <SectionDivider />
        <TemplateShowcase />
        <SectionDivider />
        <HowItWorks />
        <SectionDivider />
        <FeaturesSection />
        <CtaBanner />
      </main>
      <SiteFooter />
    </div>
  );
}
