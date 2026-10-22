import { useCallback, useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { OrderDetails, Product, CartVariation } from '@/types';
import {
  useLocationState,
  useCart,
  useHeroVariant,
  useCityBannerDismiss,
  useScrollReveal,
  useStoreData,
  isProductVisibleInLocation,
} from '@/state';

import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HeroSwitcher } from '@/components/HeroSwitcher';
import { CityBanner, PickupBanner } from '@/components/CityBanner';
import { CategorySection } from '@/components/CategorySection';
import { ProductModal } from '@/components/ProductModal';
import { CartDrawer } from '@/components/CartDrawer';
import { Checkout } from '@/components/Checkout';
import { OrderConfirmation } from '@/components/OrderConfirmation';
import { BlogSection } from '@/components/BlogSection';
import { AboutSection } from '@/components/AboutSection';
import { Footer } from '@/components/Footer';
import { FloatingCartBar } from '@/components/FloatingCartBar';
import { LocationSelector } from '@/components/LocationSelector';
import { AdminDashboard } from '@/components/AdminDashboard';
import { AuthModal } from '@/components/AuthModal';

type Overlay = 'location' | 'product' | 'cart' | 'checkout' | 'confirmation' | 'admin' | 'auth' | null;

export default function App() {
  const { location, saveLocation } = useLocationState();
  const { items, addItem, updateQuantity, removeItem, clearCart } = useCart();
  const { variant: heroVariant, setVariant: setHeroVariant } = useHeroVariant();
  const { dismissed: bannerDismissed, dismiss: dismissBanner } = useCityBannerDismiss();
  useScrollReveal();

  const {
    products,
    categories,
    banners,
    orders,
    addProduct,
    editProduct,
    removeProduct,
    addCategory,
    editCategory,
    removeCategory,
    updateAllBanners,
    recordOrder,
    changeOrderStatus,
    editOrder,
    removeOrder,
    refreshData,
  } = useStoreData();

  const [overlay, setOverlay] = useState<Overlay>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [barVisible, setBarVisible] = useState(true);

  // Admin authentication state with persistence
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('natura_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const handleAdminLogin = useCallback(() => {
    setIsAdminLoggedIn(true);
    try {
      localStorage.setItem('natura_admin_auth', 'true');
    } catch {
      // LocalStorage might be disabled or full
    }
    setOverlay('admin');
  }, []);

  const handleAdminLogout = useCallback(() => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('natura_admin_auth');
    } catch {
      // LocalStorage might be disabled
    }
    setOverlay(null);
  }, []);

  // force the city selector open on first load if no city chosen
  const needsLocation =
    location.mode === 'pickup'
      ? !location.pickupId
      : !location.cityId;

  useEffect(() => {
    if (needsLocation) setOverlay('location');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // lock body scroll while an overlay is open
  useEffect(() => {
    const open = overlay !== null;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [overlay]);

  // Dynamically filter categories & products based on city visibility
  const visibleCategories = useMemo(() => {
    return categories.map((c) => ({
      category: c,
      products: products.filter(
        (p) => p.categoryId === c.id && isProductVisibleInLocation(p, location)
      ),
    })).filter((group) => group.products.length > 0);
  }, [categories, products, location]);

  const openProduct = useCallback((p: Product) => {
    setActiveProduct(p);
    setOverlay('product');
  }, []);

  const quickAdd = useCallback(
    (p: Product) => {
      if (p.variations && p.variations.length > 0) {
        openProduct(p);
        return;
      }
      addItem(p, [], 1);
      setOverlay('cart');
    },
    [addItem, openProduct]
  );

  const handleAddFromModal = useCallback(
    (product: Product, variations: CartVariation[], quantity: number) => {
      addItem(product, variations, quantity);
      setOverlay('cart');
    },
    [addItem]
  );

  const handlePlaceOrder = useCallback(
    (o: OrderDetails) => {
      recordOrder(o);
      setOrder(o);
      clearCart();
      setOverlay('confirmation');
    },
    [clearCart, recordOrder]
  );

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  // show/hide floating cart bar based on scroll + open overlays
  useEffect(() => {
    if (overlay !== null) {
      setBarVisible(false);
      return;
    }
    const onScroll = () => setBarVisible(window.scrollY > 600 || window.scrollY < 120);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [overlay]);

  return (
    <div className="min-h-screen bg-cream-50">
      <Header
        location={location}
        cartCount={cartCount}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenLocation={() => setOverlay('location')}
        onOpenCart={() => setOverlay('cart')}
        onOpenAdmin={() => {
          if (isAdminLoggedIn) {
            setOverlay('admin');
          } else {
            setOverlay('auth');
          }
        }}
        onOpenAuth={() => setOverlay('auth')}
        onLogoutAdmin={handleAdminLogout}
      />

      <main>
        <Hero
          variant={heroVariant}
          slides={banners}
          onCta={() => {
            document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        <HeroSwitcher variant={heroVariant} onChange={setHeroVariant} />

        {location.mode === 'pickup' ? (
          <PickupBanner location={location} onOpenLocation={() => setOverlay('location')} />
        ) : (
          <CityBanner
            location={location}
            onOpenLocation={() => setOverlay('location')}
            dismissed={bannerDismissed}
            onDismiss={dismissBanner}
          />
        )}

        {/* Shop */}
        <div
          id="shop"
          className="scroll-mt-20 space-y-10 py-12 sm:space-y-14 sm:py-16"
        >
          {/* promise strip */}
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="reveal flex flex-wrap items-center justify-center gap-x-6 gap-y-2 rounded-3xl bg-palm-700 px-5 py-4 text-center text-sm font-semibold text-cream-50 sm:justify-between">
              <span className="inline-flex items-center gap-2">
                <Sparkles size={16} className="text-cream-300" /> 100% Fresh, no preservatives
              </span>
              <span className="inline-flex items-center gap-2">
                <Sparkles size={16} className="text-cream-300" /> Free delivery on orders over Rs. 3,000
              </span>
              <span className="inline-flex items-center gap-2">
                <Sparkles size={16} className="text-cream-300" /> Open 24/7
              </span>
            </div>
          </div>

          {visibleCategories.map(({ category, products: catProducts }) => (
            <CategorySection
              key={category.id}
              category={category}
              products={catProducts}
              onOpenProduct={openProduct}
              onQuickAdd={quickAdd}
            />
          ))}
        </div>

        <BlogSection />
        <AboutSection />
      </main>

      <Footer />

      <FloatingCartBar
        items={items}
        onOpen={() => setOverlay('cart')}
        visible={barVisible}
      />

      {/* Overlays */}
      <LocationSelector
        open={overlay === 'location'}
        onClose={() => setOverlay(null)}
        onSave={saveLocation}
        initial={location}
        forceOpen={needsLocation && overlay === 'location'}
      />

      <ProductModal
        product={overlay === 'product' ? activeProduct : null}
        onClose={() => {
          setActiveProduct(null);
          setOverlay(null);
        }}
        onAdd={handleAddFromModal}
      />

      <CartDrawer
        open={overlay === 'cart'}
        onClose={() => setOverlay(null)}
        items={items}
        location={location}
        onInc={(key) => updateQuantity(key, 1)}
        onDec={(key) => updateQuantity(key, -1)}
        onRemove={removeItem}
        onCheckout={() => setOverlay('checkout')}
        onEditItem={(p) => {
          setActiveProduct(p);
          setOverlay('product');
        }}
      />

      <Checkout
        open={overlay === 'checkout'}
        onClose={() => setOverlay(null)}
        onBack={() => setOverlay('cart')}
        items={items}
        location={location}
        onPlaceOrder={handlePlaceOrder}
      />

      <OrderConfirmation
        order={overlay === 'confirmation' ? order : null}
        onClose={() => {
          setOrder(null);
          setOverlay(null);
        }}
      />

      <AdminDashboard
        open={overlay === 'admin'}
        onClose={() => setOverlay(null)}
        products={products}
        categories={categories}
        banners={banners}
        orders={orders}
        onAddProduct={addProduct}
        onEditProduct={editProduct}
        onDeleteProduct={removeProduct}
        onAddCategory={addCategory}
        onEditCategory={editCategory}
        onDeleteCategory={removeCategory}
        onUpdateBanners={updateAllBanners}
        onUpdateOrderStatus={changeOrderStatus}
        onEditOrder={editOrder}
        onDeleteOrder={removeOrder}
        onRefresh={refreshData}
        onLogout={handleAdminLogout}
      />

      <AuthModal
        open={overlay === 'auth'}
        onClose={() => setOverlay(null)}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
      />
    </div>
  );
}
