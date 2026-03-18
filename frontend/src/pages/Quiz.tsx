import { useState } from 'react';
import { ArrowRight, ArrowLeft, RotateCcw, Check } from 'lucide-react';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { quizQuestions } from '@/data/products';
import { cn } from '@/lib/utils';
import { products } from '@/data/products';
import type { QuizResult, OlfactoryProfile } from '@/types';

export function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

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
      setCurrentStep(prev => prev + 1);
    } else {
      calculateResult();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculateResult = () => {
    // Simple result calculation
    const profileCounts: Record<string, number> = {};
    
    Object.entries(answers).forEach(([questionId, selectedAnswers]) => {
      const qId = parseInt(questionId);
      const question = quizQuestions.find(q => q.id === qId);
      if (!question) return;

      selectedAnswers.forEach(answerId => {
        const option = question.options.find(o => o.id === answerId);
        if (option?.profiles) {
          option.profiles.forEach(profile => {
            profileCounts[profile] = (profileCounts[profile] || 0) + 1;
          });
        }
      });
    });

    const dominantProfile = (Object.entries(profileCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'boise') as OlfactoryProfile;
    
    const descriptions: Record<string, string> = {
      boise: 'Vous appréciez les notes profondes et authentiques du bois.',
      epice: 'Vous aimez les sensations fortes et les épices.',
      doux: 'Vous préférez la douceur et la subtilité.',
      fume: 'Vous recherchez le mystère et l\'intensité.',
      sucre: 'Vous aimez les notes gourmandes et chaleureuses.',
      floral: 'Vous appréciez l\'élégance et la finesse.',
      resineux: 'Vous recherchez la spiritualité et le sacré.',
    };

    // Get recommended products based on profile
    const recommendedProducts = products
      .filter(p => p.profile === dominantProfile)
      .slice(0, 3);

    setResult({
      profile: dominantProfile,
      intensity: 'medium',
      occasion: 'quotidien',
      recommendedProducts,
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

  if (result) {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container-oud">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
                <Check className="w-4 h-4" />
                Quiz terminé
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-4">
                Votre Profil Oud
              </h1>
            </div>

            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-stone-100">
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <div className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full font-medium">
                    {profileLabels[result.profile]}
                  </div>
                </div>
                <p className="text-center text-stone-600 text-lg">
                  {result.description}
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-2xl text-stone-900 mb-6 text-center">
                Recommandés pour Vous
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.recommendedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>

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
            <div className="text-center mb-10">
              <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 mb-3">
                Trouvez Votre Oud
              </h1>
              <p className="text-stone-600">
                Répondez à quelques questions pour découvrir l'oud parfait.
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-stone-500 mb-2">
                <span>Question {currentStep + 1} sur {quizQuestions.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-stone-100">
              <h2 className="font-serif text-2xl text-stone-900 mb-2">
                {currentQuestion.question}
              </h2>
              {currentQuestion.description && (
                <p className="text-stone-500 mb-6">{currentQuestion.description}</p>
              )}

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
                  {currentStep === quizQuestions.length - 1 ? 'Voir les résultats' : 'Suivant'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
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
