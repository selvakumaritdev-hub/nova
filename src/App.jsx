import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider } from './context/CompareContext';
import { AuthProvider } from './context/AuthContext';
import { AddressProvider } from './context/AddressContext';
import { OrdersProvider } from './context/OrdersContext';
import { NotificationProvider } from './context/NotificationContext';
import { RewardsProvider } from './context/RewardsContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';

// Global Layout Components
import { Navbar } from './components/navbar/Navbar';
import { MobileNav } from './components/navbar/MobileNav';
import { Footer } from './components/footer/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { FloatingCompareBar } from './components/common/FloatingCompareBar';
import { AIAssistantWidget } from './components/assistant/AIAssistantWidget';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Wishlist } from './pages/Wishlist';
import { Compare } from './pages/Compare';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Orders } from './pages/Orders';
import { OrderDetails } from './pages/Orders/OrderDetails';
import { Returns } from './pages/Returns';
import { Profile } from './pages/Profile';
import { Stores } from './pages/Stores';
import { Assistant } from './pages/Assistant';
import { NovaPlus } from './pages/NovaPlus';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { ForgotPassword } from './pages/Auth/ForgotPassword';
import { Error404 } from './pages/Error';

// Helper component to scroll to top on every navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function AppContent() {
  const location = useLocation();
  const isAssistantPage = location.pathname === '/assistant';

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <ScrollToTop />
      <Navbar />

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/category/:category" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/nova-plus" element={<NovaPlus />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/404" element={<Error404 />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>

      <Footer />
      <MobileNav />

      {/* Global Drawers & Floating Widgets */}
      <CartDrawer />
      <FloatingCompareBar />
      {!isAssistantPage && <AIAssistantWidget isFloating={true} />}
      <ToastContainer />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <AuthProvider>
                  <AddressProvider>
                    <OrdersProvider>
                      <NotificationProvider>
                        <RewardsProvider>
                          <RecentlyViewedProvider>
                            <Router>
                              <AppContent />
                            </Router>
                          </RecentlyViewedProvider>
                        </RewardsProvider>
                      </NotificationProvider>
                    </OrdersProvider>
                  </AddressProvider>
                </AuthProvider>
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
