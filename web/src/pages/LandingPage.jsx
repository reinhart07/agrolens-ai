import HeroSection from '../components/landing/HeroSection'
import SponsorSection from '../components/landing/SponsorSection'
import ProblemSection from '../components/landing/ProblemSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import StatsSection from '../components/landing/StatsSection'
import TeamSection from '../components/landing/TeamSection'
import CTASection from '../components/landing/CTASection'

export default function LandingPage() {
  return (
    <main className="pt-16">
      <HeroSection />
      <SponsorSection />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <TeamSection />
      <CTASection />
    </main>
  )
}