import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';
import { DeliveryZoneCheckerModal } from './components/common/DeliveryZoneCheckerModal';
import { AutoPriceUpdateBanner } from './components/common/AutoPriceUpdateBanner';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { TodaysPricesPage } from './pages/TodaysPricesPage';
import { WholesalePage } from './pages/WholesalePage';
import { WholesaleQuickOrderPage } from './pages/WholesaleQuickOrderPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AboutContactPage } from './pages/AboutContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AccountPage } from './pages/AccountPage';

const AppContent: React.FC = () => {
  const { currentPage } = useStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'shop':
        return <ShopPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'product-detail':
      case 'product':
        return <ProductDetailPage />;
      case 'todays-prices':
        return <TodaysPricesPage />;
      case 'wholesale':
        return <WholesalePage />;
      case 'wholesale-quick-order':
        return <WholesaleQuickOrderPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order-confirmation':
        return <OrderConfirmationPage />;
      case 'order-tracking':
      case 'track-order':
        return <OrderTrackingPage />;
      case 'about-contact':
      case 'contact':
        return <AboutContactPage />;
      case 'admin':
      case 'admin-dashboard':
      case 'admin-login':
      case 'staff-login':
        return <AdminDashboard />;
      case 'account':
        return <AccountPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-200 selection:text-emerald-950 font-sans antialiased">
      {/* Top Header & Sticky Navigation */}
      <Navbar />

      {/* Main Dynamic View */}
      <main className="flex-1 pb-16 md:pb-0">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Persistent Widgets */}
      <MobileBottomNav />
      <WhatsAppFloatingButton />
      <DeliveryZoneCheckerModal />
      <AutoPriceUpdateBanner />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
