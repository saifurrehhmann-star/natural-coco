import { useCallback, useEffect, useState } from 'react';
import type {
  CartItem,
  CartVariation,
  FulfillmentMode,
  LocationState,
  Product,
  Category,
  HeroSlide,
  OrderDetails,
  OrderStage,
} from './types';
import { CITIES, PICKUP_LOCATIONS, CATEGORIES } from './data';
import { INITIAL_PRODUCTS, INITIAL_HERO_SLIDES } from './seedData';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  fetchBanners,
  saveBanners,
  fetchOrders,
  postOrder,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} from './api';

const LOCATION_KEY = 'natura-location-v1';
const CART_KEY = 'natura-cart-v1';
const HERO_KEY = 'natura-hero-v1';
const BANNER_DISMISS_KEY = 'natura-banner-v1';

const defaultLocation: LocationState = {
  mode: 'delivery',
  cityId: null,
  pickupId: null,
  phone: '',
};

export function useLocationState() {
  const [location, setLocation] = useState<LocationState>(() => {
    if (typeof window === 'undefined') return defaultLocation;
    try {
      const raw = window.localStorage.getItem(LOCATION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as LocationState;
        return { ...defaultLocation, ...parsed };
      }
    } catch {
      /* ignore */
    }
    return defaultLocation;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCATION_KEY, JSON.stringify(location));
    } catch {
      /* ignore */
    }
  }, [location]);

  const saveLocation = useCallback((next: Partial<LocationState>) => {
    setLocation((prev) => {
      const merged = { ...prev, ...next };
      if (next.mode === 'pickup') {
        merged.pickupId = merged.pickupId ?? PICKUP_LOCATIONS[0]?.id ?? null;
        merged.cityId = null;
      }
      if (next.mode === 'delivery') {
        merged.pickupId = null;
      }
      return merged;
    });
  }, []);

  return { location, setLocation, saveLocation };
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem(CART_KEY);
      if (raw) return JSON.parse(raw) as CartItem[];
    } catch {
      /* ignore */
    }
    return [];
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const addItem = useCallback(
    (product: Product, variations: CartVariation[], quantity: number) => {
      const key = cartKey(product.id, variations);
      setItems((prev) => {
        const existing = prev.find((i) => i.key === key);
        if (existing) {
          return prev.map((i) =>
            i.key === key ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [
          ...prev,
          {
            key,
            productId: product.id,
            name: product.name,
            image: product.image,
            basePrice: product.price,
            variations,
            quantity,
          },
        ];
      });
    },
    []
  );

  const updateQuantity = useCallback((key: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.key === key ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, quantity: Math.max(0, quantity) } : i))
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  return { items, addItem, updateQuantity, setQuantity, removeItem, clearCart };
}

export function useHeroVariant() {
  const [variant, setVariant] = useState<'full' | 'split' | 'cards'>(() => {
    if (typeof window === 'undefined') return 'full';
    try {
      const raw = window.localStorage.getItem(HERO_KEY);
      if (raw === 'full' || raw === 'split' || raw === 'cards') return raw;
    } catch {
      /* ignore */
    }
    return 'full';
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(HERO_KEY, variant);
    } catch {
      /* ignore */
    }
  }, [variant]);

  return { variant, setVariant };
}

export function useCityBannerDismiss() {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.localStorage.getItem(BANNER_DISMISS_KEY) === '1';
    } catch {
      return false;
    }
  });

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      window.localStorage.setItem(BANNER_DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
  }, []);

  return { dismissed, dismiss };
}

export function cartKey(productId: string, variations: CartVariation[]): string {
  const v = variations
    .map((x) => `${x.groupId}:${x.optionId}`)
    .sort()
    .join('|');
  return `${productId}__${v}`;
}

export function cartItemUnitPrice(item: CartItem): number {
  const delta = item.variations.reduce((sum, v) => sum + v.priceDelta, 0);
  return item.basePrice + delta;
}

export function cartItemLineTotal(item: CartItem): number {
  return cartItemUnitPrice(item) * item.quantity;
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + cartItemLineTotal(i), 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function activeCityName(location: LocationState): string | null {
  if (location.mode === 'pickup') return 'Karachi (Pickup)';
  if (!location.cityId) return null;
  return CITIES.find((c) => c.id === location.cityId)?.name ?? null;
}

export function activeCity(location: LocationState) {
  return CITIES.find((c) => c.id === location.cityId) ?? null;
}

export function activePickup(location: LocationState) {
  return PICKUP_LOCATIONS.find((p) => p.id === location.pickupId) ?? null;
}

export function getDeliveryFee(location: LocationState): number {
  if (location.mode === 'pickup') return 0;
  return activeCity(location)?.deliveryFee ?? 0;
}

export function getEta(location: LocationState): string {
  if (location.mode === 'pickup') {
    return activePickup(location)?.readyIn ?? '20–30 min';
  }
  return activeCity(location)?.deliveryEta ?? '—';
}

export function isKarachiCatalog(location: LocationState): boolean {
  if (location.mode === 'pickup') return true;
  return location.cityId === 'karachi';
}

export function useScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal'));
    if (!('IntersectionObserver' in window) || els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

export function generateOrderRef(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `NC-${n}`;
}

export const FULFILLMENT_MODES: { id: FulfillmentMode; label: string; hint: string }[] = [
  { id: 'delivery', label: 'Delivery', hint: 'To your address' },
  { id: 'pickup', label: 'Pickup', hint: 'Collect from store' },
];

export function isProductVisibleInLocation(product: Product, location: LocationState): boolean {
  if (product.inStock === false) return false;
  const isKarachi = location.mode === 'pickup' || location.cityId === 'karachi';

  if (product.cityVisibility === 'nationwide') return true;
  if (product.cityVisibility === 'karachi_only') return isKarachi;
  if (product.cityVisibility === 'custom') {
    if (location.mode === 'pickup') return true;
    if (!location.cityId) return true;
    return product.allowedCityIds?.includes(location.cityId) ?? false;
  }
  // Default fallback based on category
  if (product.categoryId === 'fresh-coconuts') return true;
  return isKarachi;
}

export function useStoreData() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [banners, setBanners] = useState<HeroSlide[]>(INITIAL_HERO_SLIDES);
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const [p, c, b, o] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchBanners(),
        fetchOrders(),
      ]);
      if (p && p.length > 0) setProducts(p);
      if (c && c.length > 0) setCategories(c);
      if (b && b.length > 0) setBanners(b);
      if (o) setOrders(o);
    } catch (err) {
      console.warn('Refresh error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addProduct = useCallback(async (p: Partial<Product>) => {
    const created = await createProduct(p);
    setProducts((prev) => [created, ...prev]);
    return created;
  }, []);

  const editProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    await updateProduct(id, updates);
  }, []);

  const removeProduct = useCallback(async (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    await deleteProduct(id);
  }, []);

  const addCategory = useCallback(async (c: Category) => {
    const created = await createCategory(c);
    setCategories((prev) => [...prev, created]);
    return created;
  }, []);

  const editCategory = useCallback(async (id: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    await updateCategory(id, updates);
  }, []);

  const removeCategory = useCallback(async (id: string) => {
    setCategories((prev) => prev.filter((item) => item.id !== id));
    await deleteCategory(id);
  }, []);

  const updateAllBanners = useCallback(async (newSlides: HeroSlide[]) => {
    setBanners(newSlides);
    await saveBanners(newSlides);
  }, []);

  const recordOrder = useCallback(async (order: OrderDetails) => {
    setOrders((prev) => [order, ...prev]);
    await postOrder(order);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('natura-order-updated', { detail: { ref: order.ref, stage: order.stage || 'placed' } })
      );
    }
  }, []);

  const changeOrderStatus = useCallback(async (ref: string, stage: OrderStage) => {
    setOrders((prev) => prev.map((o) => (o.ref === ref ? { ...o, stage } : o)));
    await updateOrderStatus(ref, stage);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('natura-order-updated', { detail: { ref, stage } })
      );
    }
  }, []);

  const editOrder = useCallback(async (ref: string, updates: Partial<OrderDetails>) => {
    setOrders((prev) => prev.map((o) => (o.ref === ref ? { ...o, ...updates } : o)));
    await updateOrder(ref, updates);
    if (updates.stage && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('natura-order-updated', { detail: { ref, stage: updates.stage } })
      );
    }
  }, []);

  const removeOrder = useCallback(async (ref: string) => {
    setOrders((prev) => prev.filter((o) => o.ref !== ref));
    await deleteOrder(ref);
  }, []);

  return {
    products,
    categories,
    banners,
    orders,
    loading,
    refreshData,
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
  };
}
