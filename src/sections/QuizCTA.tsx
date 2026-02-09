import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function QuizCTA() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  const benefits = [
    { icon: Target, text: 'Recommandation personnalisée' },
    { icon: Clock, text: '2 minutes seulement' },
    { icon: Sparkles, text: 'Basé sur vos préférences' },
  ];

  return (
    <section ref={ref} className="section-padding bg-stone-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-oud relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Quiz Interactif Gratuit</span>
          </div>

          {/* Headline */}
          <h2
            className={`font-serif text-3xl sm:text-4xl lg:text-5xl text-white mb-6 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Trouvez Votre Oud Idéal
            <span className="block text-amber-400 mt-2">en 2 Minutes</span>
          </h2>

          {/* Description */}
          <p
            className={`text-lg text-stone-400 mb-8 max-w-xl mx-auto transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Répondez à quelques questions simples et laissez-nous vous guider 
            vers l'oud qui correspond parfaitement à vos goûts et vos besoins.
          </p>

          {/* Benefits */}
          <div
            className={`flex flex-wrap justify-center gap-6 mb-10 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-stone-300"
              >
                <benefit.icon className="w-5 h-5 text-amber-500" />
                <span className="text-sm">{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className={`transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold px-10 py-6 text-lg"
              asChild
            >
              <Link to="/quiz">
                Commencer le Quiz
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>

          {/* Trust Text */}
          <p
            className={`text-sm text-stone-500 mt-6 transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Déjà +5 000 personnes ont trouvé leur oud grâce à notre quiz
          </p>
        </div>
      </div>
    </section>
  );
}
