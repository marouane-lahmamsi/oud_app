import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, RotateCcw, Sparkles, Check, Target, Clock } from 'lucide-react';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { quizQuestions, products, bundles } from '@/data/products';
import { cn } from '@/lib/utils';
import type { QuizResult, OlfactoryProfile, Occasion } from '@/types';

export function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentQuestion = quizQuestions[currentStep];
  const progress = ((currentStep + 1) / quizQuestions.length) * 100;

  const handleAnswer = (optionId: string) => {
    const currentAnswers = answers[currentStep] || [];
    
    if (currentQuestion.multiple) {
      const newAnswers = currentAnswers.includes(optionId)
        ? currentAnswers.filter(id => id !== optionId)
        : [...currentAnswers, optionId];
      
      setAnswers({ ...answers, [currentStep]: newAnswers });
    } else {
      setAnswers({ ...answers, [currentStep]: [optionId] });
    }
  };

  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      calculateResult();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  const calculateResult = () => {
    // Analyze answers
    const profileCounts: Record<string, number> = {};
    const occasionCounts: Record<string, number> = {};
    let intensity: 'low' | 'medium' | 'high' = 'medium';

    Object.entries(answers).forEach(([questionId, selectedAnswers]) => {
      const qId = parseInt(questionId);
      const question = quizQuestions.find(q => q.id === qId);
      if (!question) return;

      selectedAnswers.forEach(answerId => {
        const option = question.options.find(o => o.id === answerId);
        if (!option) return;

        if (option.profiles) {
          option.profiles.forEach(profile => {
            profileCounts[profile] = (profileCounts[profile] || 0) + 1;
          });
        }

        if (option.occasions) {
          option.occasions.forEach(occasion => {
            occasionCounts[occasion] = (occasionCounts[occasion] || 0) + 1;
          });
        }

        if (option.intensity) {
          intensity = option.intensity;
        }
      });
    });

    const dominantProfile = (Object.entries(profileCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'boise') as OlfactoryProfile;
    const dominantOccasion = (Object.entries(occasionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'quotidien') as Occasion;

    const descriptions: Record<OlfactoryProfile, string> = {
      boise: 'Vous appréciez les notes profondes et authentiques du bois. L\'oud dans sa forme la plus pure.',
      epice: 'Vous aimez les sensations fortes et les épices. Un oud charismatique et marquant.',
      doux: 'Vous préférez la douceur et la subtilité. Un oud accessible et enveloppant.',
      fume: 'Vous recherchez le mystère et l\'intensité. Un oud qui crée une ambiance unique.',
      sucre: 'Vous aimez les notes gourmandes et chaleureuses. Un oud sucré et accueillant.',
      floral: 'Vous appréciez l\'élégance et la finesse. Un oud délicat et raffiné.',
      resineux: 'Vous recherchez la spiritualité et le sacré. Un oud pour l\'élévation.',
    };

    // Find matching products
    const matchingProducts = products.filter((p: any) => {
      const profileMatch = p.profile === dominantProfile;
      const intensityMatch = p.intensity === intensity || Math.abs(
        (p.intensity === 'low' ? 1 : p.intensity === 'medium' ? 2 : 3) -
        (intensity === 'low' ? 1 : intensity === 'medium' ? 2 : 3)
      ) <= 1;
      return profileMatch && intensityMatch;
    }).slice(0, 3);

    const recommendedProducts = matchingProducts.length > 0 
      ? matchingProducts 
      : products.filter((p: any) => p.profile === dominantProfile).slice(0, 3);

    const recommendedBundle = bundles.find((b: any) => 
      b.products.some((bp: any) => recommendedProducts.some((rp: any) => rp.id === bp.product.id))
    ) || bundles[0];

    setResult({
      profile: dominantProfile,
      intensity,
      occasion: dominantOccasion,
      recommendedProducts,
      recommendedBundle,
      description: descriptions[dominantProfile],
    });
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  const profileLabels: Record<string, string> = {
    boise: 'Boisé',
    epice: 'Épicé',
    doux: 'Doux',
    fume: 'Fumé',
    sucre: 'Sucré',
    floral: 'Floral',
    resineux: 'Résineux',
  };

  const occasionLabels: Record<string, string> = {
    quotidien: 'Quotidien',
    special: 'Occasions spéciales',
    priere: 'Prière',
    meditation: 'Méditation',
    hotes: 'Recevoir',
    cadeau: 'Cadeau',
  };

  if (result) {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container-oud">
            {/* Result Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
                <Check className="w-4 h-4" />
                Quiz terminé
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 mb-4">
                Votre Profil Oud
              </h1>
              <p className="text-stone-600 max-w-xl mx-auto">
                Basé sur vos réponses, nous avons sélectionné les oud qui vous correspondent le mieux.
              </p>
            </div>

            {/* Profile Card */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-stone-100">
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <div className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-medium">
                    {profileLabels[result.profile]}
                  </div>
                  <div className="px-4 py-2 bg-stone-100 text-stone-700 rounded-full font-medium">
                    Intensité {result.intensity === 'low' ? 'Douce' : result.intensity === 'medium' ? 'Moyenne' : 'Forte'}
                  </div>
                  <div className="px-4 py-2 bg-stone-100 text-stone-700 rounded-full font-medium">
                    {occasionLabels[result.occasion]}
                  </div>
                </div>
                <p className="text-center text-stone-600 text-lg">
                  {result.description}
                </p>
              </div>
            </div>

            {/* Recommended Products */}
            <div className="mb-12">
              <h2 className="font-serif text-2xl text-stone-900 mb-6 text-center">
                Recommandés pour Vous
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.recommendedProducts.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

            {/* Recommended Bundle */}
            {result.recommendedBundle && (
              <div className="mb-12">
                <h2 className="font-serif text-2xl text-stone-900 mb-6 text-center">
                  Notre Pack Recommandé
                </h2>
                <div className="max-w-md mx-auto">
                  <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-lg">
                    <div className="aspect-video bg-stone-100">
                      <img
                        src={result.recommendedBundle.image}
                        alt={result.recommendedBundle.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif text-xl text-stone-900 mb-2">
                        {result.recommendedBundle.name}
                      </h3>
                      <p className="text-stone-600 text-sm mb-4">
                        {result.recommendedBundle.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-serif text-2xl font-semibold text-stone-900">
                            {new Intl.NumberFormat('fr-MA', {
                              style: 'currency',
                              currency: 'MAD',
                              minimumFractionDigits: 0,
                            }).format(result.recommendedBundle.bundlePrice)}
                          </span>
                          <span className="text-sm text-emerald-600 ml-2">
                            Économisez {new Intl.NumberFormat('fr-MA', {
                              style: 'currency',
                              currency: 'MAD',
                              minimumFractionDigits: 0,
                            }).format(result.recommendedBundle.savings)}
                          </span>
                        </div>
                        <Button asChild>
                          <Link to={`/pack/${result.recommendedBundle.slug}`}>
                            Voir le Pack
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Restart */}
            <div className="text-center">
              <Button variant="outline" onClick={resetQuiz}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Refaire le Quiz
              </Button>
            </div>
          </div>
        </main>
        <Footer />
        <CartDrawer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-oud">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Quiz Interactif
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-3">
                Trouvez Votre Oud Idéal
              </h1>
              <p className="text-stone-600">
                Répondez à quelques questions pour découvrir l'oud parfait pour vous.
              </p>
            </div>

            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-stone-500 mb-2">
                <span>Question {currentStep + 1} sur {quizQuestions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question Card */}
            <div
              className={cn(
                'bg-white rounded-3xl p-8 shadow-lg border border-stone-100 transition-all duration-300',
                isAnimating && 'opacity-0 translate-x-4'
              )}
            >
              <h2 className="font-serif text-2xl text-stone-900 mb-2">
                {currentQuestion.question}
              </h2>
              {currentQuestion.description && (
                <p className="text-stone-500 mb-6">{currentQuestion.description}</p>
              )}

              {/* Options */}
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option) => {
                  const isSelected = (answers[currentStep] || []).includes(option.id);
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleAnswer(option.id)}
                      className={cn(
                        'w-full p-4 rounded-xl border-2 text-left transition-all duration-300',
                        isSelected
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-200 hover:border-amber-400 hover:bg-amber-50'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium block">{option.label}</span>
                          {option.description && (
                            <span className={cn(
                              'text-sm',
                              isSelected ? 'text-stone-300' : 'text-stone-500'
                            )}>
                              {option.description}
                            </span>
                          )}
                        </div>
                        {isSelected && <Check className="w-5 h-5" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Précédent
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!answers[currentStep]?.length}
                >
                  {currentStep === quizQuestions.length - 1 ? 'Voir mes résultats' : 'Suivant'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <Target className="w-4 h-4" />
                <span>Recommandation personnalisée</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-500">
                <Clock className="w-4 h-4" />
                <span>2 minutes seulement</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}
