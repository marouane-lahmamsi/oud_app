import type { Product, Bundle, Accessory, QuizQuestion, GuideArticle, FaqItem, Review } from '@/types';

export const products: Product[] = [
  {
    id: 'oud-1',
    name: 'Oud Al-Majlis',
    slug: 'oud-al-majlis',
    description: 'Un oud d\'exception aux notes boisées profondes et subtiles touches fumées. Issu des forêts d\'Aquilaria du Cambodge, vieilli pendant 15 ans pour développer toute sa complexité aromatique. Parfait pour les moments de recueillement et les réceptions distinguées.',
    shortDescription: 'Oud cambodgien vieilli 15 ans, notes boisées fumées',
    price: 450,
    originalPrice: 520,
    images: [
      '/images/products/oud-al-majlis-1.jpg',
      '/images/products/oud-al-majlis-2.jpg',
      '/images/products/oud-al-majlis-3.jpg',
    ],
    category: 'oud-naturel',
    intensity: 'high',
    profile: 'boise',
    occasion: ['special', 'hotes', 'priere'],
    formats: [
      { size: '10g', price: 450, originalPrice: 520, inStock: true },
      { size: '50g', price: 2100, originalPrice: 2400, inStock: true },
      { size: '100g', price: 3900, originalPrice: 4500, inStock: true },
      { size: '200g', price: 7200, originalPrice: 8400, inStock: false },
    ],
    origin: 'Cambodge',
    grade: 'elite',
    rating: 4.9,
    reviewCount: 127,
    inStock: true,
    isBestseller: true,
    tags: ['cambodge', 'vieilli', 'premium', 'boise'],
    details: {
      origin: 'Forêts d\'Aquilaria, Cambodge',
      woodType: 'Aquilaria Crassna',
      aging: '15 ans minimum',
      oilContent: 'Élevée (>20%)',
      burningTime: '45-60 minutes par gramme',
      intensity: 9,
    },
    usage: {
      preparation: 'Laisser le bois à température ambiante 30 minutes avant utilisation',
      burning: 'Utiliser un charbon de qualité, placer un petit copeau et laisser se diffuser',
      tips: [
        'Commencer par de petites quantités pour apprécier les notes',
        'Idéal en fin d\'après-midi ou soirée',
        'Conserver dans un endroit frais et sec',
      ],
      safety: [
        'Ne jamais laisser le charbon sans surveillance',
        'Utiliser dans une pièce bien ventilée',
        'Tenir hors de portée des enfants',
      ],
    },
    faq: [
      {
        question: 'Quelle est la différence avec un oud plus jeune ?',
        answer: 'Le vieillissement de 15 ans permet aux huiles de se concentrer et de développer des notes plus complexes et profondes. Un oud jeune sera plus vif et moins nuancé.',
      },
      {
        question: 'Combien de temps dure un gramme ?',
        answer: 'Un gramme peut durer entre 45 et 60 minutes de diffusion, selon la taille des copeaux et la chaleur du charbon.',
      },
    ],
  },
  {
    id: 'oud-2',
    name: 'Oud Al-Fajr',
    slug: 'oud-al-fajr',
    description: 'Un oud délicat et lumineux, parfait pour commencer la journée. Notes douces de miel et de fleurs blanches avec une base boisée subtile. Originaire d\'Indonésie, il offre une expérience olfactive apaisante et raffinée.',
    shortDescription: 'Oud indonésien doux, notes florales et miellées',
    price: 280,
    originalPrice: 320,
    images: [
      '/images/products/oud-al-fajr-1.jpg',
      '/images/products/oud-al-fajr-2.jpg',
    ],
    category: 'oud-naturel',
    intensity: 'low',
    profile: 'floral',
    occasion: ['quotidien', 'meditation', 'priere'],
    formats: [
      { size: '10g', price: 280, originalPrice: 320, inStock: true },
      { size: '50g', price: 1300, originalPrice: 1500, inStock: true },
      { size: '100g', price: 2400, originalPrice: 2800, inStock: true },
      { size: '200g', price: 4500, originalPrice: 5200, inStock: true },
    ],
    origin: 'Indonésie',
    grade: 'premium',
    rating: 4.7,
    reviewCount: 89,
    inStock: true,
    isNew: true,
    tags: ['indonesie', 'doux', 'floral', 'quotidien'],
    details: {
      origin: 'Îles de Sumatra, Indonésie',
      woodType: 'Aquilaria Malaccensis',
      aging: '8 ans',
      oilContent: 'Moyenne (12-15%)',
      burningTime: '30-40 minutes par gramme',
      intensity: 4,
    },
    usage: {
      preparation: 'Aucune préparation particulière nécessaire',
      burning: 'Utiliser un charbon doux pour préserver les notes délicates',
      tips: [
        'Idéal le matin pour une ambiance sereine',
        'Parfait pour la méditation et la prière',
        'Peut être utilisé quotidiennement',
      ],
      safety: [
        'Ventiler la pièce pendant l\'utilisation',
        'Éloigner des matériaux inflammables',
      ],
    },
    faq: [
      {
        question: 'Est-il trop léger pour une grande pièce ?',
        answer: 'Cet oud est conçu pour des espaces intimes. Pour une grande pièce, utilisez une quantité légèrement supérieure ou choisissez un oud plus intense.',
      },
    ],
  },
  {
    id: 'oud-3',
    name: 'Oud Al-Khaleej',
    slug: 'oud-al-khaleej',
    description: 'L\'essence du Golfe dans un oud puissant et charismatique. Notes épicées de safran et de cardamome sur un fond boisé intense. Un classique des majlis qui impose le respect et crée une atmosphère d\'exception.',
    shortDescription: 'Oud style khaleeji, notes épicées puissantes',
    price: 380,
    images: [
      '/images/products/oud-al-khaleej-1.jpg',
      '/images/products/oud-al-khaleej-2.jpg',
    ],
    category: 'oud-naturel',
    intensity: 'high',
    profile: 'epice',
    occasion: ['special', 'hotes', 'cadeau'],
    formats: [
      { size: '10g', price: 380, inStock: true },
      { size: '50g', price: 1800, inStock: true },
      { size: '100g', price: 3400, inStock: true },
      { size: '200g', price: 6400, inStock: true },
    ],
    origin: 'Malaisie',
    grade: 'superieure',
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    isBestseller: true,
    tags: ['khaleeji', 'epice', 'puissant', 'majlis'],
    details: {
      origin: 'Forêts de Malaisie',
      woodType: 'Aquilaria Agallocha',
      aging: '12 ans',
      oilContent: 'Élevée (18-22%)',
      burningTime: '50-70 minutes par gramme',
      intensity: 10,
    },
    usage: {
      preparation: 'Laisser respirer 15 minutes avant utilisation',
      burning: 'Charbon bien chaud pour libérer les épices',
      tips: [
        'Parfait pour les réceptions et cérémonies',
        'Une petite quantité suffit',
        'Associe bien avec le café arabe',
      ],
      safety: [
        'Charbon très chaud, manipuler avec précaution',
        'Pièce bien ventilée obligatoire',
      ],
    },
    faq: [
      {
        question: 'Convient-il aux débutants ?',
        answer: 'Cet oud est assez puissant. Les débutants devraient commencer par de très petites quantités ou opter pour un oud plus doux comme l\'Al-Fajr.',
      },
    ],
  },
  {
    id: 'oud-4',
    name: 'Oud Al-Mubarak',
    slug: 'oud-al-mubarak',
    description: 'Un oud bénit pour les moments spirituels. Notes résineuses profondes avec des touches de myrrhe et d\'encens. Parfait pour la prière, le dhikr et les moments de connexion divine.',
    shortDescription: 'Oud spirituel, notes résineuses et sacrées',
    price: 320,
    images: [
      '/images/products/oud-al-mubarak-1.jpg',
      '/images/products/oud-al-mubarak-2.jpg',
    ],
    category: 'oud-naturel',
    intensity: 'medium',
    profile: 'resineux',
    occasion: ['priere', 'meditation', 'special'],
    formats: [
      { size: '10g', price: 320, inStock: true },
      { size: '50g', price: 1500, inStock: true },
      { size: '100g', price: 2800, inStock: true },
      { size: '200g', price: 5200, inStock: false },
    ],
    origin: 'Thaïlande',
    grade: 'superieure',
    rating: 4.9,
    reviewCount: 203,
    inStock: true,
    tags: ['spirituel', 'resineux', 'priere', 'meditation'],
    details: {
      origin: 'Forêts du nord de la Thaïlande',
      woodType: 'Aquilaria Sinensis',
      aging: '10 ans',
      oilContent: 'Moyenne-Élevée (15-18%)',
      burningTime: '40-50 minutes par gramme',
      intensity: 6,
    },
    usage: {
      preparation: 'Nettoyer l\'espace avant utilisation spirituelle',
      burning: 'Utiliser avec intention et recueillement',
      tips: [
        'Idéal avant la prière',
        'Crée une ambiance propice au dhikr',
        'Offrir en cadeau pour l\'Aïd ou le Ramadan',
      ],
      safety: [
        'Utiliser un brûleur stable',
        'Ne pas déplacer pendant l\'utilisation',
      ],
    },
    faq: [
      {
        question: 'Peut-on l\'utiliser pour le vendredi ?',
        answer: 'Absolument, c\'est l\'un de nos oud les plus demandés pour la prière du vendredi et les occasions spéciales religieuses.',
      },
    ],
  },
  {
    id: 'oud-5',
    name: 'Oud Al-Yasmin',
    slug: 'oud-al-yasmin',
    description: 'Une fusion délicate entre le bois d\'oud et les fleurs de jasmin. Notes sucrées et florales qui dansent sur un fond boisé chaleureux. Un oud féminin et élégant, parfait pour les moments intimes.',
    shortDescription: 'Oud floral au jasmin, délicat et élégant',
    price: 340,
    images: [
      '/images/products/oud-al-yasmin-1.jpg',
      '/images/products/oud-al-yasmin-2.jpg',
    ],
    category: 'oud-naturel',
    intensity: 'medium',
    profile: 'floral',
    occasion: ['quotidien', 'cadeau', 'special'],
    formats: [
      { size: '10g', price: 340, inStock: true },
      { size: '50g', price: 1600, inStock: true },
      { size: '100g', price: 3000, inStock: true },
      { size: '200g', price: 5600, inStock: true },
    ],
    origin: 'Vietnam',
    grade: 'premium',
    rating: 4.6,
    reviewCount: 78,
    inStock: true,
    isNew: true,
    tags: ['floral', 'jasmin', 'feminin', 'elegant'],
    details: {
      origin: 'Région du Ninh Thuận, Vietnam',
      woodType: 'Aquilaria Crassna',
      aging: '9 ans',
      oilContent: 'Moyenne (14-16%)',
      burningTime: '35-45 minutes par gramme',
      intensity: 5,
    },
    usage: {
      preparation: 'Laisser découvert 10 minutes pour révéler les notes florales',
      burning: 'Charbon modéré pour préserver la délicatesse',
      tips: [
        'Parfait pour les après-midis ensoleillés',
        'Excellent cadeau pour les occasions spéciales',
        'Associe bien avec un thé à la rose',
      ],
      safety: [
        'Éviter les courants d\'air directs',
        'Surveiller la température du charbon',
      ],
    },
    faq: [
      {
        question: 'Le jasmin est-il naturel ?',
        answer: 'Oui, les notes de jasmin proviennent d\'une infusion naturelle dans le bois d\'oud pendant le processus de vieillissement.',
      },
    ],
  },
  {
    id: 'oud-6',
    name: 'Oud Al-Sahra',
    slug: 'oud-al-sahra',
    description: 'L\'âme du désert capturée dans l\'oud. Notes fumées et sablonneuses qui évoquent les dunes au crépuscule. Un oud mystérieux et envoûtant pour les amateurs de sensations fortes.',
    shortDescription: 'Oud fumé du désert, notes mystérieuses',
    price: 420,
    images: [
      '/images/products/oud-al-sahra-1.jpg',
      '/images/products/oud-al-sahra-2.jpg',
    ],
    category: 'oud-naturel',
    intensity: 'high',
    profile: 'fume',
    occasion: ['special', 'meditation', 'hotes'],
    formats: [
      { size: '10g', price: 420, inStock: true },
      { size: '50g', price: 2000, inStock: true },
      { size: '100g', price: 3800, inStock: false },
      { size: '200g', price: 7200, inStock: false },
    ],
    origin: 'Yémen',
    grade: 'elite',
    rating: 4.8,
    reviewCount: 94,
    inStock: true,
    tags: ['fume', 'desert', 'mysterieux', 'intense'],
    details: {
      origin: 'Hadhramout, Yémen',
      woodType: 'Aquilaria Malaccensis',
      aging: '14 ans',
      oilContent: 'Très élevée (>22%)',
      burningTime: '55-75 minutes par gramme',
      intensity: 9,
    },
    usage: {
      preparation: 'Laisser à l\'air libre pour accentuer les notes fumées',
      burning: 'Charbon chaud, patience pour la montée en puissance',
      tips: [
        'Expérience immersive garantie',
        'Parfait pour la méditation du soir',
        'Combiner avec de la musique ambiante',
      ],
      safety: [
        'Fumée dense, ventilation importante',
        'Ne pas inhaler directement',
      ],
    },
    faq: [
      {
        question: 'Pourquoi est-il plus cher ?',
        answer: 'Le vieillissement de 14 ans et l\'origine yéménite rare en font l\'un de nos oud les plus précieux et recherchés.',
      },
    ],
  },
  {
    id: 'oud-7',
    name: 'Oud Al-Misk',
    slug: 'oud-al-misk',
    description: 'Un oud sucré et enveloppant avec des notes de miel et de vanille. Parfait pour ceux qui préfèrent les parfums gourmands et chaleureux. Un oud accessible et apprécié de tous.',
    shortDescription: 'Oud sucré gourmand, notes de miel et vanille',
    price: 260,
    images: [
      '/images/products/oud-al-misk-1.jpg',
      '/images/products/oud-al-misk-2.jpg',
    ],
    category: 'oud-naturel',
    intensity: 'low',
    profile: 'sucre',
    occasion: ['quotidien', 'cadeau', 'hotes'],
    formats: [
      { size: '10g', price: 260, inStock: true },
      { size: '50g', price: 1200, inStock: true },
      { size: '100g', price: 2200, inStock: true },
      { size: '200g', price: 4000, inStock: true },
    ],
    origin: 'Inde',
    grade: 'premium',
    rating: 4.5,
    reviewCount: 112,
    inStock: true,
    tags: ['sucre', 'gourmand', 'accessible', 'miel'],
    details: {
      origin: 'Assam, Inde',
      woodType: 'Aquilaria Agallocha',
      aging: '7 ans',
      oilContent: 'Moyenne (12-14%)',
      burningTime: '30-40 minutes par gramme',
      intensity: 4,
    },
    usage: {
      preparation: 'Aucune préparation spéciale',
      burning: 'Charbon standard suffisant',
      tips: [
        'Idéal pour les débutants',
        'Parfait pour les goûters et réceptions',
        'Les enfants apprécient généralement',
      ],
      safety: [
        'Supervision recommandée avec les enfants',
        'Ne pas toucher le charbon',
      ],
    },
    faq: [
      {
        question: 'Est-il artificiellement parfumé ?',
        answer: 'Non, toutes nos notes sucrées sont naturelles, issues du processus de fermentation et vieillissement du bois.',
      },
    ],
  },
  {
    id: 'oud-8',
    name: 'Oud Al-Oud',
    slug: 'oud-al-oud',
    description: 'L\'oud dans sa forme la plus pure et traditionnelle. Sans artifice, sans ajout, juste l\'essence même du bois sacré. Pour les puristes et les connaisseurs qui recherchent l\'authenticité absolue.',
    shortDescription: 'Oud pur traditionnel, authenticité absolue',
    price: 500,
    images: [
      '/images/products/oud-al-oud-1.jpg',
      '/images/products/oud-al-oud-2.jpg',
    ],
    category: 'oud-naturel',
    intensity: 'medium',
    profile: 'boise',
    occasion: ['special', 'priere', 'meditation'],
    formats: [
      { size: '10g', price: 500, inStock: true },
      { size: '50g', price: 2400, inStock: true },
      { size: '100g', price: 4600, inStock: true },
      { size: '200g', price: 8800, inStock: false },
    ],
    origin: 'Brunei',
    grade: 'elite',
    rating: 5.0,
    reviewCount: 67,
    inStock: true,
    tags: ['pur', 'traditionnel', 'authentique', 'elite'],
    details: {
      origin: 'Forêts primaires de Brunei',
      woodType: 'Aquilaria Crassna sauvage',
      aging: '18 ans',
      oilContent: 'Exceptionnelle (>25%)',
      burningTime: '60-80 minutes par gramme',
      intensity: 7,
    },
    usage: {
      preparation: 'Respecter la tradition, purifier l\'espace',
      burning: 'Utiliser les méthodes traditionnelles',
      tips: [
        'Pour les moments les plus précieux',
        'Conserver pour les occasions spéciales',
        'Offrir en cadeau de grande valeur',
      ],
      safety: [
        'Manipuler avec le plus grand soin',
        'Stocker dans des conditions optimales',
      ],
    },
    faq: [
      {
        question: 'Pourquoi est-il si spécial ?',
        answer: 'C\'est notre oud le plus vieux et le plus pur, issu de forêts sauvages de Brunei avec un vieillissement exceptionnel de 18 ans.',
      },
    ],
  },
];

export const accessories: Accessory[] = [
  {
    id: 'acc-1',
    name: 'Brûleur Électrique Premium',
    description: 'Brûleur électrique en céramique avec thermostat réglable. Design élégant et fonctionnement silencieux.',
    price: 450,
    image: '/images/accessories/bruleur-electrique.jpg',
    category: 'bruleur',
    inStock: true,
  },
  {
    id: 'acc-2',
    name: 'Brûleur Traditionnel Laiton',
    description: 'Brûleur artisanal en laiton gravé, finition antique. Inclut le support pour charbon.',
    price: 280,
    image: '/images/accessories/bruleur-laiton.jpg',
    category: 'bruleur',
    inStock: true,
  },
  {
    id: 'acc-3',
    name: 'Charbon Premium (10 pastilles)',
    description: 'Charbon de qualité supérieure, allumage rapide, combustion sans odeur.',
    price: 45,
    image: '/images/accessories/charbon.jpg',
    category: 'charbon',
    inStock: true,
  },
  {
    id: 'acc-4',
    name: 'Charbon Premium (50 pastilles)',
    description: 'Format économique de charbon premium pour usage régulier.',
    price: 180,
    image: '/images/accessories/charbon-50.jpg',
    category: 'charbon',
    inStock: true,
  },
  {
    id: 'acc-5',
    name: 'Pince à Oud en Laiton',
    description: 'Pince élégante pour manipuler les copeaux d\'oud en toute sécurité.',
    price: 85,
    image: '/images/accessories/pince.jpg',
    category: 'pince',
    inStock: true,
  },
  {
    id: 'acc-6',
    name: 'Boîte de Conservation',
    description: 'Boîte hermétique en bois pour préserver la fraîcheur de votre oud.',
    price: 120,
    image: '/images/accessories/boite.jpg',
    category: 'ensemble',
    inStock: true,
  },
];

export const bundles: Bundle[] = [
  {
    id: 'bundle-1',
    name: 'Starter Kit Oud',
    slug: 'starter-kit-oud',
    description: 'Tout ce dont vous avez besoin pour découvrir l\'oud. Notre sélection d\'oud doux accompagnée des accessoires essentiels.',
    image: '/images/bundles/starter-kit.jpg',
    products: [
      {
        product: products[1], // Oud Al-Fajr
        format: '10g',
        quantity: 1,
      },
      {
        product: products[6], // Oud Al-Misk
        format: '10g',
        quantity: 1,
      },
    ],
    accessories: [
      accessories[1], // Brûleur laiton
      accessories[2], // Charbon 10
      accessories[4], // Pince
    ],
    totalPrice: 750,
    bundlePrice: 599,
    savings: 151,
    isStarterKit: true,
  },
  {
    id: 'bundle-2',
    name: 'Pack Majlis',
    slug: 'pack-majlis',
    description: 'Pour recevoir avec élégance. Un oud d\'exception et tous les accessoires pour impressionner vos invités.',
    image: '/images/bundles/pack-majlis.jpg',
    products: [
      {
        product: products[0], // Oud Al-Majlis
        format: '50g',
        quantity: 1,
      },
    ],
    accessories: [
      accessories[0], // Brûleur électrique
      accessories[3], // Charbon 50
      accessories[4], // Pince
      accessories[5], // Boîte
    ],
    totalPrice: 1295,
    bundlePrice: 1099,
    savings: 196,
  },
  {
    id: 'bundle-3',
    name: 'Coffret Spirituel',
    slug: 'coffret-spirituel',
    description: 'Pour les moments de recueillement. L\'oud parfait pour la prière accompagné d\'accessoires de qualité.',
    image: '/images/bundles/coffret-spirituel.jpg',
    products: [
      {
        product: products[3], // Oud Al-Mubarak
        format: '50g',
        quantity: 1,
      },
    ],
    accessories: [
      accessories[1], // Brûleur laiton
      accessories[2], // Charbon 10
    ],
    totalPrice: 645,
    bundlePrice: 549,
    savings: 96,
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Comment décririez-vous votre expérience avec l\'oud ?',
    description: 'Cela nous aide à recommander l\'intensité adaptée',
    options: [
      { id: 'exp-1', label: 'Débutant complet', description: 'Je découvre l\'oud', intensity: 'low' },
      { id: 'exp-2', label: 'Quelques expériences', description: 'J\'ai déjà essayé', intensity: 'medium' },
      { id: 'exp-3', label: 'Connaisseur', description: 'Je connais bien', intensity: 'high' },
    ],
  },
  {
    id: 2,
    question: 'Quelles notes préférez-vous généralement ?',
    description: 'Sélectionnez vos préférences olfactives',
    multiple: true,
    options: [
      { id: 'note-1', label: 'Boisées', description: 'Chêne, cèdre, santal', profiles: ['boise'] },
      { id: 'note-2', label: 'Épicées', description: 'Safran, cardamome, poivre', profiles: ['epice'] },
      { id: 'note-3', label: 'Florales', description: 'Jasmin, rose, fleurs blanches', profiles: ['floral'] },
      { id: 'note-4', label: 'Douces', description: 'Miel, vanille, douceur', profiles: ['sucre', 'doux'] },
      { id: 'note-5', label: 'Fumées', description: 'Notes torréfiées, mystérieuses', profiles: ['fume'] },
      { id: 'note-6', label: 'Résineuses', description: 'Encens, myrrhe, sacré', profiles: ['resineux'] },
    ],
  },
  {
    id: 3,
    question: 'Pour quelle occasion principalement ?',
    options: [
      { id: 'occ-1', label: 'Usage quotidien', description: 'Tous les jours', occasions: ['quotidien'] },
      { id: 'occ-2', label: 'Réceptions', description: 'Recevoir des invités', occasions: ['hotes'] },
      { id: 'occ-3', label: 'Moments spéciaux', description: 'Cérémonies, fêtes', occasions: ['special'] },
      { id: 'occ-4', label: 'Prière & Méditation', description: 'Spiritualité', occasions: ['priere', 'meditation'] },
      { id: 'occ-5', label: 'Cadeau', description: 'Offrir', occasions: ['cadeau'] },
    ],
  },
  {
    id: 4,
    question: 'Quel est votre budget ?',
    options: [
      { id: 'budget-1', label: 'Accessible', description: 'Jusqu\'à 300 DH' },
      { id: 'budget-2', label: 'Moyen', description: '300-500 DH' },
      { id: 'budget-3', label: 'Premium', description: '500-800 DH' },
      { id: 'budget-4', label: 'Exception', description: '800+ DH' },
    ],
  },
];

export const guideArticles: GuideArticle[] = [
  {
    id: 'guide-1',
    slug: 'comment-bruler-oud',
    title: 'Comment brûler l\'oud : Le guide complet',
    excerpt: 'Tout ce que vous devez savoir pour profiter pleinement de votre oud, de la préparation du charbon à la diffusion optimale.',
    content: '',
    image: '/images/guides/bruler-oud.jpg',
    category: 'Utilisation',
    readTime: 8,
    publishedAt: '2024-01-15',
    featured: true,
  },
  {
    id: 'guide-2',
    slug: 'differences-grades-oud',
    title: 'Comprendre les grades d\'oud',
    excerpt: 'Premium, Supérieure, Élite... Découvrez ce qui distingue chaque grade et comment choisir selon vos besoins.',
    content: '',
    image: '/images/guides/grades-oud.jpg',
    category: 'Éducation',
    readTime: 6,
    publishedAt: '2024-01-10',
  },
  {
    id: 'guide-3',
    slug: 'choisir-selon-occasion',
    title: 'Choisir son oud selon l\'occasion',
    excerpt: 'Quel oud pour la prière ? Pour recevoir ? Pour offrir ? Notre guide pratique pour chaque moment.',
    content: '',
    image: '/images/guides/occasion-oud.jpg',
    category: 'Conseils',
    readTime: 5,
    publishedAt: '2024-01-05',
  },
  {
    id: 'guide-4',
    slug: 'origines-oud-monde',
    title: 'Les origines de l\'oud dans le monde',
    excerpt: 'Voyage aux sources de l\'oud : Cambodge, Indonésie, Malaisie, Yémen... Chaque terroir, une signature unique.',
    content: '',
    image: '/images/guides/origines-oud.jpg',
    category: 'Éducation',
    readTime: 10,
    publishedAt: '2024-01-01',
  },
  {
    id: 'guide-5',
    slug: 'conserver-oud',
    title: 'Comment conserver son oud',
    excerpt: 'Les secrets pour préserver la qualité et la puissance de votre oud sur le long terme.',
    content: '',
    image: '/images/guides/conserver-oud.jpg',
    category: 'Entretien',
    readTime: 4,
    publishedAt: '2023-12-28',
  },
];

export const faqItems: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Paiement',
    question: 'Quels modes de paiement acceptez-vous ?',
    answer: 'Nous acceptons les paiements par carte bancaire (Visa, Mastercard), le paiement à la livraison (cash on delivery), et les virements bancaires pour les commandes importantes. Tous nos paiements sont sécurisés.',
  },
  {
    id: 'faq-2',
    category: 'Livraison',
    question: 'Quels sont les délais de livraison au Maroc ?',
    answer: 'Les délais varient selon votre ville : Casablanca et Rabat (24-48h), autres grandes villes (48-72h), villes secondaires (3-5 jours). La livraison est gratuite à partir de 500 DH d\'achat.',
  },
  {
    id: 'faq-3',
    category: 'Livraison',
    question: 'Comment suivre ma commande ?',
    answer: 'Une fois votre commande expédiée, vous recevez un numéro de suivi par SMS et email. Vous pouvez également suivre votre commande sur notre site dans la section "Suivi de commande".',
  },
  {
    id: 'faq-4',
    category: 'Retours',
    question: 'Puis-je retourner un produit ?',
    answer: 'Oui, vous disposez de 14 jours après réception pour retourner un produit non utilisé dans son emballage d\'origine. Les produits ouverts ne sont pas éligibles au retour pour des raisons d\'hygiène.',
  },
  {
    id: 'faq-5',
    category: 'Produit',
    question: 'Votre oud est-il 100% naturel ?',
    answer: 'Absolument. Tout notre oud est 100% naturel, sans additifs ni parfums artificiels. Nous fournissons des certificats d\'authenticité sur demande pour nos grades Élite.',
  },
  {
    id: 'faq-6',
    category: 'Produit',
    question: 'Quelle est la différence entre les formats 10g, 50g, 100g ?',
    answer: 'Les formats correspondent à vos besoins : 10g pour découvrir, 50g pour usage régulier, 100g/200g pour les connaisseurs ou les grands consommateurs. Plus le format est grand, plus le prix au gramme est avantageux.',
  },
  {
    id: 'faq-7',
    category: 'Produit',
    question: 'Comment savoir quel oud me convient ?',
    answer: 'Utilisez notre quiz "Trouver mon oud" qui analyse vos préférences et vous recommande les produits adaptés. Vous pouvez aussi nous contacter sur WhatsApp pour des conseils personnalisés.',
  },
  {
    id: 'faq-8',
    category: 'Commande',
    question: 'Puis-je modifier ma commande après validation ?',
    answer: 'Vous pouvez modifier votre commande dans les 2 heures suivant la validation en nous contactant par WhatsApp. Passé ce délai, la commande est traitée et ne peut plus être modifiée.',
  },
  {
    id: 'faq-9',
    category: 'Paiement',
    question: 'Le paiement à la livraison est-il sûr ?',
    answer: 'Oui, nous travaillons avec des transporteurs de confiance. Vous payez uniquement à la réception de votre colis. Des frais supplémentaires de 30 DH s\'appliquent pour cette option.',
  },
  {
    id: 'faq-10',
    category: 'Produit',
    question: 'Quelle est la durée de conservation de l\'oud ?',
    answer: 'Un oud bien conservé dans une boîte hermétique, à l\'abri de la lumière et de l\'humidité, peut se conserver plusieurs années et même s\'améliorer avec le temps.',
  },
  {
    id: 'faq-11',
    category: 'Livraison',
    question: 'Livrez-vous en dehors du Maroc ?',
    answer: 'Actuellement, nous livrons uniquement au Maroc. Nous prévoyons d\'ouvrir la livraison internationale (Europe, Golfe) dans les prochains mois.',
  },
  {
    id: 'faq-12',
    category: 'Commande',
    question: 'Proposez-vous des coffrets cadeaux ?',
    answer: 'Oui, nous proposons plusieurs coffrets cadeaux avec emballage premium. Vous pouvez également ajouter un message personnalisé lors de la commande.',
  },
  {
    id: 'faq-13',
    category: 'Produit',
    question: 'L\'oud est-il adapté aux débutants ?',
    answer: 'Oui ! Nous recommandons de commencer par nos ouds classés "intensité faible" comme l\'Al-Fajr ou l\'Al-Misk. Notre Starter Kit est parfait pour débuter.',
  },
  {
    id: 'faq-14',
    category: 'Paiement',
    question: 'Proposez-vous des facilités de paiement ?',
    answer: 'Pour les commandes supérieures à 2000 DH, nous proposons un paiement en 2 ou 3 fois sans frais. Contactez-nous pour plus d\'informations.',
  },
  {
    id: 'faq-15',
    category: 'Retours',
    question: 'Comment fonctionne le remboursement ?',
    answer: 'Après réception et vérification du retour, le remboursement est effectué sous 5-7 jours ouvrés sur le même moyen de paiement utilisé lors de la commande.',
  },
];

export const reviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'oud-1',
    author: 'Karim B.',
    rating: 5,
    date: '2024-01-20',
    title: 'Une expérience d\'exception',
    content: 'L\'Al-Majlis est tout simplement sublime. Les notes boisées sont profondes et durables. Mes invités ont été conquis. Je recommande vivement le format 50g pour un usage régulier.',
    verified: true,
    helpful: 24,
  },
  {
    id: 'rev-2',
    productId: 'oud-2',
    author: 'Fatima Z.',
    rating: 5,
    date: '2024-01-18',
    title: 'Parfait pour commencer la journée',
    content: 'L\'Al-Fajr est devenu mon rituel du matin. Doux, floral, apaisant. Idéal pour la méditation avant de commencer la journée. Livraison rapide et emballage soigné.',
    verified: true,
    helpful: 18,
  },
  {
    id: 'rev-3',
    productId: 'oud-3',
    author: 'Ahmed L.',
    rating: 5,
    date: '2024-01-15',
    title: 'Le vrai oud khaleeji',
    content: 'Ayant vécu à Dubaï, je cherchais un oud de cette qualité. L\'Al-Khaleej est authentique, puissant, parfait pour les majlis. Service client excellent sur WhatsApp.',
    verified: true,
    helpful: 31,
  },
  {
    id: 'rev-4',
    productId: 'oud-4',
    author: 'Youssef M.',
    rating: 5,
    date: '2024-01-12',
    title: 'Pour la prière du vendredi',
    content: 'L\'Al-Mubarak accompagne toutes mes prières. Les notes résineuses créent une ambiance spirituelle unique. C\'est mon 3ème achat, toujours satisfait.',
    verified: true,
    helpful: 22,
  },
  {
    id: 'rev-5',
    productId: 'bundle-1',
    author: 'Sofia R.',
    rating: 5,
    date: '2024-01-10',
    title: 'Starter Kit parfait pour débuter',
    content: 'Je ne connaissais pas l\'oud, ce kit m\'a permis de découvrir en toute sérénité. Le guide inclus est très utile. Maintenant fan de l\'Al-Fajr !',
    verified: true,
    helpful: 45,
  },
  {
    id: 'rev-6',
    productId: 'oud-5',
    author: 'Laila K.',
    rating: 4,
    date: '2024-01-08',
    title: 'Délicat et féminin',
    content: 'L\'Al-Yasmin est très agréable, notes florales subtiles. Parfait pour les après-midis entre amies. Je trouve juste qu\'il manque un peu de tenue.',
    verified: true,
    helpful: 12,
  },
  {
    id: 'rev-7',
    productId: 'oud-6',
    author: 'Omar H.',
    rating: 5,
    date: '2024-01-05',
    title: 'Mystique et envoûtant',
    content: 'L\'Al-Sahra crée une ambiance unique. On voyage immédiatement. Pour les amateurs de sensations fortes. Qualité exceptionnelle.',
    verified: true,
    helpful: 19,
  },
  {
    id: 'rev-8',
    productId: 'oud-7',
    author: 'Nadia T.',
    rating: 5,
    date: '2024-01-03',
    title: 'Toute la famille adore',
    content: 'L\'Al-Misk est devenu l\'oud familial. Même les enfants apprécient ses notes douces. Excellent rapport qualité-prix.',
    verified: true,
    helpful: 28,
  },
  {
    id: 'rev-9',
    productId: 'oud-8',
    author: 'Hassan E.',
    rating: 5,
    date: '2023-12-28',
    title: 'Le nec plus ultra',
    content: 'L\'Al-Oud est réservé pour les grandes occasions. Pureté absolue, complexité incroyable. Un investissement mais quel bonheur !',
    verified: true,
    helpful: 15,
  },
  {
    id: 'rev-10',
    productId: 'bundle-2',
    author: 'Mounir A.',
    rating: 5,
    date: '2023-12-25',
    title: 'Pack Majlis impeccable',
    content: 'Tout est inclus pour recevoir. Le brûleur électrique est top, l\'oud Al-Majlis exceptionnel. Mes invités ont adoré.',
    verified: true,
    helpful: 33,
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(p => p.slug === slug);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(p => p.category === category);
};

export const getBestsellers = (): Product[] => {
  return products.filter(p => p.isBestseller);
};

export const getNewProducts = (): Product[] => {
  return products.filter(p => p.isNew);
};

export const getRelatedProducts = (product: Product, limit: number = 4): Product[] => {
  return products
    .filter(p => p.id !== product.id && (p.profile === product.profile || p.intensity === product.intensity))
    .slice(0, limit);
};

export const getBundleBySlug = (slug: string): Bundle | undefined => {
  return bundles.find(b => b.slug === slug);
};

export const getReviewsByProduct = (productId: string): Review[] => {
  return reviews.filter(r => r.productId === productId);
};
