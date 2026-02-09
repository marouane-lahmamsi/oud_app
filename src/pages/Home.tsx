import { Header } from '@/sections/Header';
import { Hero } from '@/sections/Hero';
import { BestSellers } from '@/sections/BestSellers';
import { QuizCTA } from '@/sections/QuizCTA';
import { SocialProof } from '@/sections/SocialProof';
import { Education } from '@/sections/Education';
import { Bundles } from '@/sections/Bundles';
import { ShippingInfo } from '@/sections/ShippingInfo';
import { FAQ } from '@/sections/FAQ';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

export function Home() {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      <main>
        <Hero />
        <BestSellers />
        <QuizCTA />
        <Bundles />
        <SocialProof />
        <Education />
        <ShippingInfo />
        <FAQ />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}
