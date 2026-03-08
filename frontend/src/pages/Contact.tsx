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

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
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
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@medinaoud.ma',
      link: 'mailto:contact@medinaoud.ma',
    },
    {
      icon: MapPin,
      title: 'Adresse',
      content: 'Casablanca, Maroc',
      link: '#',
    },
    {
      icon: Clock,
      title: 'Horaires',
      content: 'Lun-Ven: 9h - 18h',
      link: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-oud">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 mb-4">
              Contactez-Nous
            </h1>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Une question ? Notre équipe est là pour vous aider.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div>
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
                  <p>Réponse rapide</p>
                </div>
              </a>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
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
                      Nous vous répondrons rapidement.
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
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Votre message..."
                          rows={5}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-stone-900 hover:bg-stone-800"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Envoi...' : 'Envoyer'}
                      </Button>
                    </form>
                  </>
                )}
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
