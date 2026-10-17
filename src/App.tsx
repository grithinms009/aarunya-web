import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/chrome/Layout';
import { Home } from '@/pages/Home';
import { Shop } from '@/pages/Shop';
import { ProductPage } from '@/pages/ProductPage';
import { CartPage } from '@/pages/CartPage';
import { Checkout } from '@/pages/Checkout';
import { Wishlist } from '@/pages/Wishlist';
import { Collections } from '@/pages/Collections';
import { NotFound } from '@/pages/NotFound';
import { AboutUs } from '@/pages/policies/AboutUs';
import { ContactUs } from '@/pages/policies/ContactUs';
import { Terms } from '@/pages/policies/Terms';
import { Privacy } from '@/pages/policies/Privacy';
import { Shipping } from '@/pages/policies/Shipping';
import { RefundCancellation } from '@/pages/policies/RefundCancellation';
import { Returns } from '@/pages/policies/Returns';
import { Faq } from '@/pages/policies/Faq';
import { TrackOrder } from '@/pages/policies/TrackOrder';
import { Grievance } from '@/pages/policies/Grievance';

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

              {/* Information and policy pages. */}
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/terms-and-conditions" element={<Terms />} />
              <Route path="/privacy-policy" element={<Privacy />} />
              <Route path="/shipping-policy" element={<Shipping />} />
              <Route path="/refund-and-cancellation-policy" element={<RefundCancellation />} />
              <Route path="/returns-and-replacements" element={<Returns />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/grievance-redressal" element={<Grievance />} />

              {/* The paths this site used before, kept working so existing links and any
                  indexed URLs land on the page that replaced them. */}
              <Route path="/about" element={<Navigate to="/about-us" replace />} />
              <Route path="/contact" element={<Navigate to="/contact-us" replace />} />
              <Route path="/return-policy" element={<Navigate to="/returns-and-replacements" replace />} />
              <Route path="/terms" element={<Navigate to="/terms-and-conditions" replace />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
}
