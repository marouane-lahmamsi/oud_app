import { Truck, CreditCard, RotateCcw, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function ShippingInfo() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  const features = [
    {
      icon: Truck,
      title: 'Livraison Rapide',
      description: '24-48h Casablanca & Rabat, 48-72h autres villes',
      highlight: 'Gratuite dès 500 DH',
    },
    {
      icon: CreditCard,
      title: 'Paiement Sécurisé',
      description: 'Carte bancaire, paiement à la livraison',
      highlight: '100% Sécurisé',
    },
    {
      icon: RotateCcw,
      title: 'Satisfait ou Remboursé',
      description: '14 jours pour retourner votre commande',
      highlight: 'Retours Faciles',
    },
    {
      icon: ShieldCheck,
      title: 'Authenticité Garantie',
      description: 'Tous nos oud sont 100% naturels et certifiés',
      highlight: 'Certificat Disponible',
    },
  ];

  const cities = [
    { name: 'Casablanca', delay: '24-48h' },
    { name: 'Rabat', delay: '24-48h' },
    { name: 'Marrakech', delay: '48-72h' },
    { name: 'Tanger', delay: '48-72h' },
    { name: 'Fès', delay: '48-72h' },
    { name: 'Agadir', delay: '48-72h' },
  ];

  return (
    <section ref={ref} className="section-padding bg-stone-900 text-white">
      <div className="container-oud">
        {/* Features Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-serif text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-stone-400 text-sm mb-3">{feature.description}</p>
              <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-medium">
                <ShieldCheck className="w-3 h-3" />
                {feature.highlight}
              </span>
            </div>
          ))}
        </div>

        {/* Delivery Cities */}
        <div
          className={`transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="flex items-center gap-4 mb-6">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif text-xl">Délais de Livraison par Ville</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {cities.map((city, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{city.name}</p>
                  <p className="text-xs text-stone-400">{city.delay}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
