import { useState } from 'react';
import { MessageCircle, X, HelpCircle, ShoppingCart, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappNumber = '212600000000';

  const quickActions = [
    {
      icon: ShoppingCart,
      label: 'Conseil achat',
      message: 'Bonjour, pouvez-vous m\'aider à choisir un oud ?',
    },
    {
      icon: BookOpen,
      label: 'Guide utilisation',
      message: 'Bonjour, j\'aimerais des conseils sur comment utiliser l\'oud.',
    },
    {
      icon: HelpCircle,
      label: 'Question produit',
      message: 'Bonjour, j\'ai une question sur un produit.',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Quick Actions Menu */}
      <div
        className={cn(
          'absolute bottom-16 right-0 mb-2 space-y-2 transition-all duration-300',
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        {quickActions.map((action, index) => (
          <a
            key={index}
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(action.message)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-white rounded-full shadow-lg px-4 py-3 hover:bg-stone-50 transition-colors whitespace-nowrap"
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <span className="text-sm text-stone-700">{action.label}</span>
            <div className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center">
              <action.icon className="w-4 h-4 text-white" />
            </div>
          </a>
        ))}
      </div>

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300',
          'bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white',
          'hover:shadow-xl hover:scale-105',
          isOpen && 'rotate-90'
        )}
        aria-label="Contact WhatsApp"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-7 h-7" fill="currentColor" />
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap">
          <div className="bg-stone-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
            Besoin d'aide ?
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-stone-900" />
          </div>
        </div>
      )}
    </div>
  );
}
