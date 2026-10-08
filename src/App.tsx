import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/chrome/Layout';
import { POLICY_SLUGS } from '@/lib/route';
import { Home } from '@/pages/Home';
import { Shop } from '@/pages/Shop';
import { ProductPage } from '@/pages/ProductPage';
import { CartPage } from '@/pages/CartPage';
import { Checkout } from '@/pages/Checkout';
import { Wishlist } from '@/pages/Wishlist';
import { Collections } from '@/pages/Collections';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { PolicyPage } from '@/pages/PolicyPage';
import { NotFound } from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/category/:cat" element={<Shop />} />
              <Route path="/category/:cat/:type" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              {POLICY_SLUGS.map((slug) => (
                <Route key={slug} path={`/${slug}`} element={<PolicyPage />} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}
