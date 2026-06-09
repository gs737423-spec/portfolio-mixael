import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import PortfolioSection from '@/components/PortfolioSection'
import AboutSection from '@/components/AboutSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import { MessageCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <PortfolioSection />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/5511999990000"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-fab"
        aria-label="Contato via WhatsApp"
      >
        <MessageCircle size={24} color="white" />
      </a>
    </>
  )
}
