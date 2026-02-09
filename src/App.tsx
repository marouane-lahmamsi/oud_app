import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/hooks/useCart';
import { Home } from '@/pages/Home';
import { Collection } from '@/pages/Collection';
import { Product } from '@/pages/Product';
import { Quiz } from '@/pages/Quiz';
import { Guide } from '@/pages/Guide';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { FAQPage } from '@/pages/FAQPage';

function App() {
  return (
    <CartProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/produit/:slug" element={<Product />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/guide/:slug" element={<Guide />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
      </HashRouter>
    </CartProvider>
  );
}

export default App;
