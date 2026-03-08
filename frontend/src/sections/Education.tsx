import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Flame, Leaf, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { guideArticles } from '@/data/products';

export function Education() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  const features = [
    {
      icon: Leaf,
      title: '100% Naturel',
      description: 'Tous nos oud sont purs, sans additifs ni parfums artificiels.',
    },
    {
      icon: Award,
      title: 'Grades Certifiés',
      description: 'Premium, Supérieure et Élite : chaque grade correspond à des critères stricts.',
    },
    {
      icon: Flame,
      title: 'Origines Traçables',
      description: 'Du Cambodge au Yémen, nous connaissons la source de chaque lot.',
    },
  ];

  const featuredArticles = guideArticles.slice(0, 3);

  return (
    <section ref={ref} className="section-padding bg-stone-50">
      <div className="container-oud">
        {/* Features Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
                <feature.icon className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-serif text-xl font-medium text-stone-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-stone-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Guide Articles */}
        <div
          className={`transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="text-amber-600 text-sm font-medium uppercase tracking-wider mb-2 block">
                Le Guide Oud
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-900">
                Apprenez Tout sur l'Oud
              </h2>
            </div>
            <Button variant="outline" className="self-start sm:self-auto" asChild>
              <Link to="/guide">
                Voir tous les articles
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map((article, index) => (
              <Link
                key={article.id}
                to={`/guide/${article.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-lg transition-all duration-500"
                style={{ transitionDelay: `${(index + 3) * 100}ms` }}
              >
                <div className="aspect-[16/10] overflow-hidden bg-stone-200">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                      {article.category}
                    </span>
                    <span className="text-stone-400 text-xs flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {article.readTime} min
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-stone-900 mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-stone-600 text-sm line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
