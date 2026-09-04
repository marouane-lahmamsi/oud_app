import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, RotateCcw, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { productsAPI } from '@/services/api';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

type Answer = 'discover' | 'signature' | 'balanced' | 'intense' | 'daily' | 'reception' | 'gift';

type QuizQuestion = {
  id: string;
  question: string;
  description: string;
  options: Array<{ id: Answer; label: string; description: string }>;
};

const quizQuestions: QuizQuestion[] = [
  {
    id: 'experience',
    question: 'Comment souhaitez-vous commencer ?',
    description: 'Nous adaptons la sélection à votre familiarité avec l’oud.',
    options: [
      { id: 'discover', label: 'Je découvre l’oud', description: 'Une première rencontre accessible et équilibrée.' },
      { id: 'signature', label: 'Je connais déjà l’oud', description: 'Une signature plus profonde, avec du caractère.' },
    ],
  },
  {
    id: 'character',
    question: 'Quel caractère vous attire ?',
    description: 'Choisissez simplement l’intensité qui vous ressemble le plus.',
    options: [
      { id: 'balanced', label: 'Équilibré et raffiné', description: 'Boisé, élégant, facile à apprécier au quotidien.' },
      { id: 'intense', label: 'Profond et intense', description: 'Une présence affirmée pour les amateurs de belles matières.' },
    ],
  },
  {
    id: 'moment',
    question: 'Pour quel moment le choisissez-vous ?',
    description: 'Le bon oud dépend aussi de la façon dont vous allez le vivre.',
    options: [
      { id: 'daily', label: 'Pour un rituel quotidien', description: 'Un geste chaleureux pour soi et pour la maison.' },
      { id: 'reception', label: 'Pour recevoir', description: 'Une senteur mémorable pour les moments partagés.' },
      { id: 'gift', label: 'Pour offrir ou comparer', description: 'Une sélection pensée pour découvrir plusieurs signatures.' },
    ],
  },
];

function getProductsFromResult(result: any): Product[] {
  if (!result?.success || !result.data) return [];
  return Array.isArray(result.data) ? result.data : result.data.data || [];
}

function productScore(product: Product, answers: Set<Answer>) {
  const isCoffret = product.category === 'coffrets';
  let score = 0;

  if (answers.has('discover')) score += product.intensity === 'medium' ? 5 : isCoffret ? 3 : 0;
  if (answers.has('signature')) score += product.intensity === 'high' ? 4 : 0;
  if (answers.has('balanced')) score += product.intensity === 'medium' ? 5 : 0;
  if (answers.has('intense')) score += product.intensity === 'high' ? 6 : 0;
  if (answers.has('daily')) score += product.intensity === 'medium' ? 3 : 0;
  if (answers.has('reception')) score += product.intensity === 'high' ? 3 : 0;
  if (answers.has('gift')) score += isCoffret ? 9 : 1;

  return score;
}

function recommendationMessage(answers: Set<Answer>) {
  if (answers.has('gift')) return 'Une découverte généreuse, parfaite à offrir ou à explorer à votre rythme.';
  if (answers.has('intense') || answers.has('reception')) return 'Des pièces de caractère, choisies pour une présence riche et mémorable.';
  return 'Des signatures équilibrées, sélectionnées pour une belle première expérience de l’oud.';
}

export function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [showResult, setShowResult] = useState(false);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;
    const loadCatalog = async () => {
      const result = await productsAPI.getAll({ page: 1, per_page: 24 });
      if (isCurrent) {
        setCatalog(getProductsFromResult(result));
        setCatalogLoading(false);
      }
    };
    loadCatalog();
    return () => { isCurrent = false; };
  }, []);

  const selectedAnswers = useMemo(() => new Set(Object.values(answers)), [answers]);
  const recommendations = useMemo(
    () => [...catalog].sort((a, b) => productScore(b, selectedAnswers) - productScore(a, selectedAnswers)).slice(0, 3),
    [catalog, selectedAnswers]
  );
  const question = quizQuestions[currentStep];
  const progress = ((currentStep + 1) / quizQuestions.length) * 100;
  const canContinue = Boolean(answers[question.id]);
  const isLastStep = currentStep === quizQuestions.length - 1;

  const selectAnswer = (answer: Answer) => setAnswers((current) => ({ ...current, [question.id]: answer }));
  const nextStep = () => {
    if (!canContinue) return;
    if (isLastStep) setShowResult(true);
    else setCurrentStep((step) => step + 1);
  };
  const restart = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-[#FAF7F2]">
        <Header />
        <main className="container-oud pt-28 pb-16 sm:pt-32">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center sm:mb-10">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900">
                <Sparkles className="h-4 w-4" /> Sélection Medina Oud
              </div>
              <h1 className="font-serif text-3xl text-stone-900 sm:text-5xl">Votre recommandation</h1>
              <p className="mx-auto mt-3 max-w-2xl text-stone-600">{recommendationMessage(selectedAnswers)}</p>
            </div>

            {catalogLoading ? (
              <div className="rounded-2xl border border-stone-200 bg-white px-6 py-14 text-center text-stone-600">Préparation de votre sélection…</div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <div className="rounded-2xl border border-stone-200 bg-white px-6 py-14 text-center">
                <h2 className="font-serif text-2xl text-stone-900">La collection est en cours de chargement</h2>
                <p className="mt-2 text-stone-600">Vous pouvez consulter les produits directement dans la boutique.</p>
              </div>
            )}

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button variant="outline" onClick={restart} className="w-full sm:w-auto"><RotateCcw className="mr-2 h-4 w-4" /> Refaire le quiz</Button>
              <Button asChild className="w-full sm:w-auto"><Link to="/collection">Voir toute la collection <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
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
      <main className="container-oud pt-28 pb-16 sm:pt-32">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center sm:mb-10">
            <p className="mb-3 text-sm font-medium text-amber-700">Guide Medina Oud</p>
            <h1 className="font-serif text-3xl text-stone-900 sm:text-5xl">Trouvez votre oud</h1>
            <p className="mx-auto mt-3 max-w-xl text-stone-600">Trois questions simples pour vous orienter parmi notre collection.</p>
          </div>

          <div className="mb-6 flex items-center justify-between text-sm text-stone-500">
            <span>Question {currentStep + 1} sur {quizQuestions.length}</span><span>Moins d’une minute</span>
          </div>
          <div className="mb-8 h-1.5 overflow-hidden rounded-full bg-stone-200"><div className="h-full rounded-full bg-amber-600 transition-all duration-300" style={{ width: `${progress}%` }} /></div>

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="font-serif text-2xl text-stone-900 sm:text-3xl">{question.question}</h2>
            <p className="mt-2 text-stone-600">{question.description}</p>
            <div className="mt-7 space-y-3">
              {question.options.map((option) => {
                const isSelected = answers[question.id] === option.id;
                return (
                  <button key={option.id} type="button" onClick={() => selectAnswer(option.id)} className={cn('flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors sm:p-5', isSelected ? 'border-amber-600 bg-amber-50' : 'border-stone-200 hover:border-amber-300 hover:bg-amber-50/50')}>
                    <span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border', isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300')}>
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span><span className="block font-medium text-stone-900">{option.label}</span><span className="mt-1 block text-sm text-stone-600">{option.description}</span></span>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-stone-100 pt-5">
              <Button type="button" variant="ghost" onClick={() => setCurrentStep((step) => Math.max(0, step - 1))} disabled={currentStep === 0}><ArrowLeft className="mr-2 h-4 w-4" /> Précédent</Button>
              <Button type="button" onClick={nextStep} disabled={!canContinue || (isLastStep && catalogLoading)}>
                {isLastStep ? (catalogLoading ? 'Préparation…' : 'Voir ma sélection') : 'Continuer'}{!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}
