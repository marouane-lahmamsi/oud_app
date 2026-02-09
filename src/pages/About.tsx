import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Leaf, Award, Globe, Heart, Shield, Users } from 'lucide-react';

export function About() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  const values = [
    {
      icon: Leaf,
      title: '100% Naturel',
      description: 'Tous nos oud sont purs et naturels, sans additifs ni parfums artificiels. Nous garantissons l\'authenticité de chaque produit.',
    },
    {
      icon: Globe,
      title: 'Origines Traçables',
      description: 'Nous connaissons la source de chaque lot. Du producteur à votre porte, nous assurons une traçabilité complète.',
    },
    {
      icon: Award,
      title: 'Qualité Premium',
      description: 'Chaque lot est rigoureusement sélectionné et testé. Nous ne proposons que des oud de la plus haute qualité.',
    },
    {
      icon: Heart,
      title: 'Passion & Expertise',
      description: 'Notre équipe est composée de passionnés d\'oud avec des années d\'expérience dans le domaine.',
    },
    {
      icon: Shield,
      title: 'Satisfaction Garantie',
      description: 'Votre satisfaction est notre priorité. Nous offrons une garantie de retour de 14 jours.',
    },
    {
      icon: Users,
      title: 'Service Client',
      description: 'Notre équipe est disponible sur WhatsApp pour vous conseiller et répondre à toutes vos questions.',
    },
  ];

  const stats = [
    { value: '15,000+', label: 'Clients satisfaits' },
    { value: '50+', label: 'Produits disponibles' },
    { value: '8', label: 'Pays d\'origine' },
    { value: '4.8/5', label: 'Note moyenne' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-stone-900" />
          <div className="absolute inset-0 opacity-20">
            <img
              src="/images/about/hero.jpg"
              alt="Oud background"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="container-oud relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <span className="text-amber-400 text-sm font-medium uppercase tracking-wider mb-4 block">
                À Propos de Nous
              </span>
              <h1 className="font-serif text-4xl lg:text-6xl text-white mb-6">
                Notre Histoire
              </h1>
              <p className="text-stone-300 text-lg">
                Passionnés par l'oud authentique, nous avons créé Oud Premium 
                pour partager cette tradition millénaire avec le Maroc.
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section ref={ref} className="section-padding">
          <div className="container-oud">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
                }`}
              >
                <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-stone-200">
                  <img
                    src="/images/about/story.jpg"
                    alt="Notre histoire"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div
                className={`transition-all duration-700 delay-100 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
                }`}
              >
                <h2 className="font-serif text-3xl lg:text-4xl text-stone-900 mb-6">
                  De la Passion à l'Excellence
                </h2>
                <div className="space-y-4 text-stone-600">
                  <p>
                    Oud Premium est né d'une passion profonde pour l'oud authentique. 
                    Notre fondateur, après des années à parcourir les marchés d'Asie 
                    du Sud-Est et du Moyen-Orient, a décidé de partager cette richesse 
                    culturelle avec le Maroc.
                  </p>
                  <p>
                    Nous sélectionnons personnellement chaque lot d'oud, en veillant 
                    à ce qu'il réponde à nos critères stricts de qualité. Du Cambodge 
                    au Yémen, nous entretenons des relations directes avec les producteurs 
                    pour vous garantir l'authenticité.
                  </p>
                  <p>
                    Notre mission est simple : rendre l'oud de qualité accessible à tous, 
                    tout en préservant les traditions et en éduquant nos clients sur 
                    cet art millénaire.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-stone-900">
          <div className="container-oud">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-serif text-4xl lg:text-5xl text-amber-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-stone-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding">
          <div className="container-oud">
            <div className="text-center mb-12">
              <span className="text-amber-600 text-sm font-medium uppercase tracking-wider mb-2 block">
                Nos Valeurs
              </span>
              <h2 className="font-serif text-3xl lg:text-4xl text-stone-900">
                Ce qui nous Anime
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-2xl border border-stone-100 hover:shadow-lg transition-all duration-300"
                >
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

        {/* Sourcing */}
        <section className="section-padding bg-stone-50">
          <div className="container-oud">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <span className="text-amber-600 text-sm font-medium uppercase tracking-wider mb-2 block">
                  Notre Sourcing
                </span>
                <h2 className="font-serif text-3xl lg:text-4xl text-stone-900 mb-6">
                  Des Origines Contrôlées
                </h2>
                <div className="space-y-4 text-stone-600">
                  <p>
                    Nous travaillons directement avec des producteurs dans 8 pays : 
                    Cambodge, Indonésie, Malaisie, Thaïlande, Vietnam, Yémen, Inde et Brunei.
                  </p>
                  <p>
                    Chaque lot est soumis à des tests rigoureux pour vérifier :
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>La pureté et l'absence d'additifs</li>
                    <li>La teneur en huile naturelle</li>
                    <li>Le vieillissement et la maturité</li>
                    <li>Les notes olfactives caractéristiques</li>
                  </ul>
                  <p>
                    Nous proposons trois grades distincts : Premium, Supérieure et Élite, 
                    chacun répondant à des critères spécifiques de qualité.
                  </p>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-stone-200">
                  <img
                    src="/images/about/sourcing.jpg"
                    alt="Notre sourcing"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding">
          <div className="container-oud">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-8 lg:p-16 text-center">
              <h2 className="font-serif text-3xl lg:text-4xl text-stone-900 mb-4">
                Prêt à Découvrir l'Oud ?
              </h2>
              <p className="text-stone-800 mb-8 max-w-xl mx-auto">
                Explorez notre collection et trouvez l'oud qui correspond à vos goûts. 
                Notre équipe est là pour vous conseiller.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/collection"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-colors"
                >
                  Voir la Collection
                </a>
                <a
                  href="https://wa.me/212600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-stone-900 rounded-lg font-medium hover:bg-stone-100 transition-colors"
                >
                  Nous Contacter
                </a>
              </div>
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
