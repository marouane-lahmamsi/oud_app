import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

import { Leaf, Globe, Award, Heart } from 'lucide-react';

export function About() {
  const values = [
    {
      icon: Leaf,
      title: '100% Naturel',
      description: 'Tous nos oud sont purs et naturels, sans additifs ni parfums artificiels.',
    },
    {
      icon: Globe,
      title: 'Origines Traçables',
      description: 'Nous connaissons la source de chaque lot, du producteur à votre porte.',
    },
    {
      icon: Award,
      title: 'Qualité Premium',
      description: 'Chaque lot est rigoureusement sélectionné et testé.',
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Notre équipe est composée de passionnés d\'oud.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="relative py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-stone-900" />
          <div className="absolute inset-0 opacity-20">
            <img
              src="/images/hero/hero-1.jpg"
              alt="Oud"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container-oud relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="font-serif text-4xl lg:text-6xl text-white mb-6">
                Notre Histoire
              </h1>
              <p className="text-stone-300 text-lg">
                Passionnés par l'oud authentique, nous avons créé Medina Oud 
                pour partager cette tradition millénaire.
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20 lg:py-28">
          <div className="container-oud">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-stone-200">
                <img
                  src="/images/hero/hero-2.jpg"
                  alt="Notre histoire"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-serif text-3xl lg:text-4xl text-stone-900 mb-6">
                  De la Passion à l'Excellence
                </h2>
                <div className="space-y-4 text-stone-600">
                  <p>
                    Medina Oud est né d'une passion profonde pour l'oud authentique. 
                    Notre fondateur, après des années à parcourir les marchés d'Asie 
                    du Sud-Est et du Moyen-Orient, a décidé de partager cette richesse 
                    culturelle avec le Maroc.
                  </p>
                  <p>
                    Nous sélectionnons personnellement chaque lot d'oud, en veillant 
                    à ce qu'il réponde à nos critères stricts de qualité. Du Cambodge 
                    au Yémen, nous entretenons des relations directes avec les producteurs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 lg:py-28 bg-stone-50">
          <div className="container-oud">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl text-stone-900">
                Nos Valeurs
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="p-6 bg-white rounded-2xl border border-stone-100">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-serif text-xl text-stone-900 mb-2">{value.title}</h3>
                  <p className="text-stone-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}
