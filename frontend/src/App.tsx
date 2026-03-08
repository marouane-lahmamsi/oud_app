import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from '@/hooks/useCart';
import { Home } from '@/pages/Home';
import { Collection } from '@/pages/Collection';
import { Product } from '@/pages/Product';
import { Quiz } from '@/pages/Quiz';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { FAQPage } from '@/pages/FAQPage';
import { Checkout } from '@/pages/Checkout';
import { OrderSuccess } from '@/pages/OrderSuccess';
import { useState, useEffect } from 'react';

// Error Boundary Component
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'system-ui, sans-serif',
      maxWidth: '800px',
      margin: '50px auto',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: '#dc2626', fontSize: '24px', marginBottom: '16px' }}>
        ⚠️ Une erreur s'est produite
      </h1>
      <pre style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '16px', 
        borderRadius: '4px',
        overflow: 'auto',
        fontSize: '14px'
      }}>
        {error.message}
        {'\n'}
        {error.stack}
      </pre>
    </div>
  );
}

function App() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      console.error('Global error caught:', e.error);
      setError(e.error);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return <ErrorFallback error={error} />;
  }

  return (
    <CartProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/produit/:slug" element={<Product />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/commande/confirmation" element={<OrderSuccess />} />
        </Routes>
      </HashRouter>
    </CartProvider>
  );
}

export default App;
