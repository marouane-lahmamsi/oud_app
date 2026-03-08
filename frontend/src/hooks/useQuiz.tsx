import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { quizQuestions, products, bundles } from '@/data/products';
import type { QuizResult, OlfactoryProfile, Occasion } from '@/types';

interface QuizContextType {
  currentStep: number;
  answers: Record<number, string[]>;
  isActive: boolean;
  result: QuizResult | null;
  startQuiz: () => void;
  answerQuestion: (questionId: number, answers: string[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetQuiz: () => void;
  calculateResult: () => void;
  questions: typeof quizQuestions;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const startQuiz = useCallback(() => {
    setIsActive(true);
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  }, []);

  const answerQuestion = useCallback((questionId: number, selectedAnswers: string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswers,
    }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const resetQuiz = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  }, []);

  const calculateResult = useCallback(() => {
    // Analyze answers to determine profile, intensity, and occasion
    const profileCounts: Record<string, number> = {};
    const occasionCounts: Record<string, number> = {};
    let intensity: 'low' | 'medium' | 'high' = 'medium';

    // Process answers
    Object.entries(answers).forEach(([questionId, selectedAnswers]) => {
      const qId = parseInt(questionId);
      const question = quizQuestions.find(q => q.id === qId);
      if (!question) return;

      selectedAnswers.forEach(answerId => {
        const option = question.options.find(o => o.id === answerId);
        if (!option) return;

        // Count profiles
        if (option.profiles) {
          option.profiles.forEach(profile => {
            profileCounts[profile] = (profileCounts[profile] || 0) + 1;
          });
        }

        // Count occasions
        if (option.occasions) {
          option.occasions.forEach(occasion => {
            occasionCounts[occasion] = (occasionCounts[occasion] || 0) + 1;
          });
        }

        // Determine intensity
        if (option.intensity) {
          intensity = option.intensity;
        }
      });
    });

    // Get dominant profile
    const dominantProfile = (Object.entries(profileCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'boise') as OlfactoryProfile;
    
    // Get dominant occasion
    const dominantOccasion = (Object.entries(occasionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'quotidien') as Occasion;

    // Find matching products
    const matchingProducts = products.filter(p => {
      const profileMatch = p.profile === dominantProfile;
      const intensityMatch = p.intensity === intensity || Math.abs(
        (p.intensity === 'low' ? 1 : p.intensity === 'medium' ? 2 : 3) -
        (intensity === 'low' ? 1 : intensity === 'medium' ? 2 : 3)
      ) <= 1;
      return profileMatch && intensityMatch;
    }).slice(0, 3);

    // If no exact matches, get products with similar profile
    const recommendedProducts = matchingProducts.length > 0 
      ? matchingProducts 
      : products.filter(p => p.profile === dominantProfile).slice(0, 3);

    // Find matching bundle
    const recommendedBundle = bundles.find(b => 
      b.products.some(bp => recommendedProducts.some(rp => rp.id === bp.product.id))
    ) || bundles[0];

    // Generate description
    const descriptions: Record<OlfactoryProfile, string> = {
      boise: 'Vous appréciez les notes profondes et authentiques du bois. L\'oud dans sa forme la plus pure.',
      epice: 'Vous aimez les sensations fortes et les épices. Un oud charismatique et marquant.',
      doux: 'Vous préférez la douceur et la subtilité. Un oud accessible et enveloppant.',
      fume: 'Vous recherchez le mystère et l\'intensité. Un oud qui crée une ambiance unique.',
      sucre: 'Vous aimez les notes gourmandes et chaleureuses. Un oud sucré et accueillant.',
      floral: 'Vous appréciez l\'élégance et la finesse. Un oud délicat et raffiné.',
      resineux: 'Vous recherchez la spiritualité et le sacré. Un oud pour l\'élévation.',
    };

    const quizResult: QuizResult = {
      profile: dominantProfile,
      intensity,
      occasion: dominantOccasion,
      recommendedProducts,
      recommendedBundle,
      description: descriptions[dominantProfile],
    };

    setResult(quizResult);
  }, [answers]);

  return (
    <QuizContext.Provider
      value={{
        currentStep,
        answers,
        isActive,
        result,
        startQuiz,
        answerQuestion,
        nextStep,
        prevStep,
        resetQuiz,
        calculateResult,
        questions: quizQuestions,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
