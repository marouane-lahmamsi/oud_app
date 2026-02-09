import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Facebook, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Shield
} from 'lucide-react';

const footerLinks = {
  produits: [
    { label: 'Collection Complète', href: '/collection' },
    { label: 'Nouveautés', href: '/collection?filter=new' },
    { label: 'Best-Sellers', href: '/collection?filter=bestseller' },
    { label: 'Packs & Coffrets', href: '/packs' },
    { label: 'Accessoires', href: '/accessoires' },
  ],
  guides: [
    { label: 'Comment brûler l\'oud', href: '/guide/comment-bruler-oud' },
    { label: 'Différences de grades', href: '/guide/differences-grades-oud' },
    { label: 'Choisir selon l\'occasion', href: '/guide/choisir-selon-occasion' },
    { label: 'Tous les guides', href: '/guide' },
  ],
  entreprise: [
    { label: 'À propos', href: '/a-propos' },
    { label: 'Notre histoire', href: '/a-propos#histoire' },
    { label: 'Sourcing', href: '/a-propos#sourcing' },
    { label: 'Contact', href: '/contact' },
  ],
  support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Livraison', href: '/faq?category=Livraison' },
    { label: 'Retours', href: '/faq?category=Retours' },
    { label: 'Paiement', href: '/faq?category=Paiement' },
    { label: 'Suivi commande', href: '/suivi' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className="bg-stone-900 text-white">
      {/* Main Footer */}
      <div className="container-oud py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <h2 className="font-serif text-2xl font-semibold">
                Oud<span className="text-amber-400">Premium</span>
              </h2>
            </Link>
            <p className="text-stone-400 text-sm mb-6 max-w-sm">
              Oud 100% naturel sélectionné aux quatre coins du monde. 
              Livraison partout au Maroc. Authenticité garantie.
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
                href="mailto:contact@oudpremium.ma" 
                className="flex items-center gap-3 text-stone-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">contact@oudpremium.ma</span>
              </a>
              <div className="flex items-center gap-3 text-stone-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Casablanca, Maroc</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
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
              {footerLinks.produits.map((link) => (
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
            <h3 className="font-medium text-sm uppercase tracking-wider mb-4">Guides</h3>
            <ul className="space-y-3">
              {footerLinks.guides.map((link) => (
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
              © {new Date().getFullYear()} Oud Premium. Tous droits réservés.
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
