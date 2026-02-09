import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/components/ui/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export function Contact() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Téléphone',
      content: '+212 6 00 00 00 00',
      link: 'tel:+212600000000',
      description: 'Lun-Ven, 9h-18h',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@oudpremium.ma',
      link: 'mailto:contact@oudpremium.ma',
      description: 'Réponse sous 24h',
    },
    {
      icon: MapPin,
      title: 'Adresse',
      content: 'Casablanca, Maroc',
      link: '#',
      description: 'Showroom sur rendez-vous',
    },
    {
      icon: Clock,
      title: 'Horaires',
      content: 'Lun-Ven: 9h - 18h',
      link: '#',
      description: 'Sam: 10h - 14h',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-oud">
          {/* Page Header */}
          <div
            ref={ref}
            className={`text-center mb-12 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span className="text-amber-600 text-sm font-medium uppercase tracking-wider mb-2 block">
              Contact
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 mb-4">
              Contactez-Nous
            </h1>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Une question ? Besoin de conseils ? Notre équipe est là pour vous aider. 
              Contactez-nous par téléphone, email ou WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div
              className={`transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {contactInfo.map((info, index) => (
                  <a
                    key={index}
                    href={info.link}
                    className="flex items-start gap-4 p-5 bg-white rounded-xl border border-stone-100 hover:shadow-md transition-all"
                  >
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-stone-900">{info.title}</h3>
                      <p className="text-stone-700">{info.content}</p>
                      <p className="text-sm text-stone-400">{info.description}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/212600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 bg-[#25D366] text-white rounded-xl mt-4 hover:bg-[#128C7E] transition-colors"
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium">WhatsApp</h3>
                  <p>Réponse rapide garantie</p>
                </div>
              </a>
            </div>

            {/* Contact Form */}
            <div
              className={`lg:col-span-2 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <div className="bg-white rounded-2xl p-6 lg:p-8 border border-stone-100">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="font-serif text-2xl text-stone-900 mb-2">
                      Message Envoyé !
                    </h3>
                    <p className="text-stone-600">
                      Nous vous répondrons dans les plus brefs délais.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="font-serif text-2xl text-stone-900 mb-6">
                      Envoyez-nous un Message
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Prénom</Label>
                          <Input id="firstName" placeholder="Votre prénom" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nom</Label>
                          <Input id="lastName" placeholder="Votre nom" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="votre@email.com" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input id="phone" type="tel" placeholder="+212 6 00 00 00 00" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Sujet</Label>
                        <Input id="subject" placeholder="Comment pouvons-nous vous aider ?" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Décrivez votre demande en détail..."
                          rows={5}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-stone-900 hover:bg-stone-800"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          'Envoi en cours...'
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Envoyer le Message
                          </>
                        )}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div
            className={`mt-12 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="aspect-[21/9] bg-stone-200 rounded-2xl overflow-hidden">
              <img
                src="/images/contact/map.jpg"
                alt="Notre localisation"
                className="w-full h-full object-cover"
              />
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
