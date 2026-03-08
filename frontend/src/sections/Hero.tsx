import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  const heroImages = [
    {
      url: '/images/hero/hero-1.jpg',
      alt: 'Oud naturel premium',
    },
    {
      url: '/images/hero/hero-2.jpg',
      alt: 'Copeaux d\'oud',
    },
    {
      url: '/images/hero/hero-3.jpg',
      alt: 'Brûleur d\'oud traditionnel',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const trustBadges = [
    { icon: Shield, text: '100% Naturel & Authentique' },
    { icon: Truck, text: 'Livraison 24-72h au Maroc' },
    { icon: Sparkles, text: 'Sélection Premium' },
  ];

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center pt-20 overflow-hidden"
    >
      {/* Background Images with Fade */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImage ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1612]/90 via-[#1A1612]/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container-oud relative z-10">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full text-amber-400 text-sm font-medium mb-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Oud Naturel du Monde Entier</span>
          </div>

          {/* Headline */}
          <h1
            className={`font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-medium text-white leading-tight mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Découvrez l'Art
            <span className="block text-amber-400">de l'Oud Authentique</span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-lg sm:text-xl text-stone-300 mb-8 max-w-xl transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Oud 100% naturel sélectionné aux quatre coins du monde. 
            Du Cambodge au Yémen, découvrez des arômes d'exception 
            livrés chez vous au Maroc.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row gap-4 mb-12 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold px-8"
              asChild
            >
              <Link to="/collection">
                Découvrir la Collection
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              asChild
            >
              <Link to="/quiz">
                Trouver mon Oud
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div
            className={`flex flex-wrap gap-4 sm:gap-6 transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-stone-400"
              >
                <badge.icon className="w-5 h-5 text-amber-500" />
                <span className="text-sm">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImage
                ? 'w-8 bg-amber-500'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2 text-white/60">
        <span className="text-xs uppercase tracking-widest rotate-90 origin-center translate-y-8">
          Scroll
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
}
