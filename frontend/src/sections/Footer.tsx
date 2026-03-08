import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Facebook, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Shield
} from 'lucide-react';

const footerLinks = {
  produits: [
    { label: 'Tous les produits', href: '/collection' },
    { label: 'Nouveautés', href: '/collection?filter=new' },
    { label: 'Best-sellers', href: '/collection?filter=bestseller' },
  ],
  entreprise: [
    { label: 'Notre histoire', href: '/a-propos' },
    { label: 'Contact', href: '/contact' },
  ],
  support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Livraison', href: '/faq/livraison' },
    { label: 'Retours', href: '/faq/retours' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
];

export function Footer() {
  return (
    <footer className="bg-stone-900 text-white">
      {/* Main Footer */}
      <div className="container-oud py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <h2 className="font-serif text-2xl">
                Medina<span className="text-amber-400">Oud</span>
              </h2>
            </Link>
            <p className="text-stone-400 text-sm mb-6">
              L'art ancestral de l'oud, sélectionné aux quatre coins du monde.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a 
                href="tel:+212600000000" 
                className="flex items-center gap-3 text-stone-400 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">+212 6 00 00 00 00</span>
              </a>
              <a 
                href="mailto:contact@medinaoud.ma" 
                className="flex items-center gap-3 text-stone-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">contact@medinaoud.ma</span>
              </a>
              <div className="flex items-center gap-3 text-stone-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Casablanca, Maroc</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-amber-500 hover:text-stone-900 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Produits</h3>
            <ul className="space-y-3">
              {footerLinks.produits.map((link, index) => (
                <li key={`${link.href}-${index}`}>
                  <Link 
                    to={link.href} 
                    className="text-stone-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Entreprise</h3>
            <ul className="space-y-3">
              {footerLinks.entreprise.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-stone-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-stone-400 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-oud py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-stone-500 text-sm">
              © {new Date().getFullYear()} Medina Oud. Tous droits réservés.
            </p>

            {/* Trust Badges */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-stone-500 text-xs">
                <Shield className="w-4 h-4" />
                <span>Paiement Sécurisé</span>
              </div>
              <div className="flex items-center gap-2 text-stone-500 text-xs">
                <CreditCard className="w-4 h-4" />
                <span>SSL 256-bit</span>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex gap-6">
              <Link to="/confidentialite" className="text-stone-500 text-sm hover:text-white transition-colors">
                Confidentialité
              </Link>
              <Link to="/conditions" className="text-stone-500 text-sm hover:text-white transition-colors">
                CGV
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
