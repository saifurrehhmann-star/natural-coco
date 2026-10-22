import type { Product, HeroSlide, OrderDetails, OrderStage } from './types';
import { INITIAL_PRODUCTS, INITIAL_HERO_SLIDES } from './seedData';

const BASE_URL = '/api';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${BASE_URL}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : INITIAL_PRODUCTS;
  } catch (err) {
    console.warn('Backend unavailable, using local product data:', err);
    try {
      const saved = localStorage.getItem('natura_products_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      return INITIAL_PRODUCTS;
    }
    return INITIAL_PRODUCTS;
  }
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  try {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return await res.json();
  } catch (err) {
    console.warn('Backend create failed, storing locally:', err);
    const newProd = {
      ...product,
      id: product.id || 'p-' + Date.now(),
    } as Product;
    return newProd;
  }
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return await res.json();
  } catch (err) {
    console.warn('Backend update failed:', err);
    return { ...updates, id } as Product;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    try {
      const saved = localStorage.getItem('natura_products_v2');
      if (saved) {
        const list = JSON.parse(saved);
        localStorage.setItem('natura_products_v2', JSON.stringify(list.filter((p: Product) => p.id !== id)));
      }
    } catch {
      /* ignore */
    }
    return res.ok;
  } catch (err) {
    console.warn('Backend delete failed, removing locally:', err);
    try {
      const saved = localStorage.getItem('natura_products_v2');
      if (saved) {
        const list = JSON.parse(saved);
        localStorage.setItem('natura_products_v2', JSON.stringify(list.filter((p: Product) => p.id !== id)));
      }
    } catch {
      /* ignore */
    }
    return true;
  }
}

// --- Categories API ---
import { CATEGORIES } from './data';
import type { Category } from './types';

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : CATEGORIES;
  } catch (err) {
    console.warn('Backend categories unavailable:', err);
    try {
      const saved = localStorage.getItem('natura_categories_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      return CATEGORIES;
    }
    return CATEGORIES;
  }
}

export async function createCategory(category: Category): Promise<Category> {
  try {
    const res = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error('Failed to create category');
    return await res.json();
  } catch (err) {
    console.warn('Backend create category failed:', err);
    try {
      const saved = localStorage.getItem('natura_categories_v2');
      const list = saved ? JSON.parse(saved) : [...CATEGORIES];
      list.push(category);
      localStorage.setItem('natura_categories_v2', JSON.stringify(list));
    } catch {
      /* ignore */
    }
    return category;
  }
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  try {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update category');
    return await res.json();
  } catch (err) {
    console.warn('Backend update category failed:', err);
    return { ...updates, id } as Category;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    try {
      const saved = localStorage.getItem('natura_categories_v2');
      if (saved) {
        const list = JSON.parse(saved);
        localStorage.setItem('natura_categories_v2', JSON.stringify(list.filter((c: Category) => c.id !== id)));
      }
    } catch {
      /* ignore */
    }
    return res.ok;
  } catch (err) {
    console.warn('Backend delete category failed:', err);
    return true;
  }
}

export async function fetchBanners(): Promise<HeroSlide[]> {
  try {
    const res = await fetch(`${BASE_URL}/banners`);
    if (!res.ok) throw new Error('Failed to fetch banners');
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : INITIAL_HERO_SLIDES;
  } catch (err) {
    console.warn('Backend banners unavailable, using defaults:', err);
    try {
      const saved = localStorage.getItem('natura_banners_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      return INITIAL_HERO_SLIDES;
    }
    return INITIAL_HERO_SLIDES;
  }
}

export async function saveBanners(slides: HeroSlide[]): Promise<HeroSlide[]> {
  try {
    const res = await fetch(`${BASE_URL}/banners`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slides),
    });
    if (!res.ok) throw new Error('Failed to save banners');
    return await res.json();
  } catch (err) {
    console.warn('Backend banners save failed, saving locally:', err);
    try {
      localStorage.setItem('natura_banners_v2', JSON.stringify(slides));
    } catch {
      return slides;
    }
    return slides;
  }
}

export async function fetchOrders(): Promise<OrderDetails[]> {
  try {
    const res = await fetch(`${BASE_URL}/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  } catch (err) {
    console.warn('Backend orders unavailable:', err);
    try {
      const saved = localStorage.getItem('natura_orders_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      return [];
    }
    return [];
  }
}

export async function fetchOrderByRef(ref: string): Promise<OrderDetails | null> {
  try {
    const res = await fetch(`${BASE_URL}/orders/${ref}`);
    if (!res.ok) throw new Error('Failed to fetch order');
    return await res.json();
  } catch {
    try {
      const saved = localStorage.getItem('natura_orders_v2');
      if (saved) {
        const list = JSON.parse(saved);
        return list.find((o: OrderDetails) => o.ref === ref) || null;
      }
    } catch {
      return null;
    }
    return null;
  }
}

export async function postOrder(order: OrderDetails): Promise<OrderDetails> {
  try {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!res.ok) throw new Error('Failed to post order');
    const savedOrder = await res.json();
    try {
      const saved = localStorage.getItem('natura_orders_v2');
      const list = saved ? JSON.parse(saved) : [];
      list.unshift(savedOrder);
      localStorage.setItem('natura_orders_v2', JSON.stringify(list));
    } catch {
      /* ignore */
    }
    return savedOrder;
  } catch (err) {
    console.warn('Backend order post failed, saving locally:', err);
    try {
      const saved = localStorage.getItem('natura_orders_v2');
      const list = saved ? JSON.parse(saved) : [];
      list.unshift(order);
      localStorage.setItem('natura_orders_v2', JSON.stringify(list));
    } catch {
      return order;
    }
    return order;
  }
}

export async function updateOrder(ref: string, updates: Partial<OrderDetails>): Promise<OrderDetails> {
  try {
    const res = await fetch(`${BASE_URL}/orders/${ref}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update order');
    const updated = await res.json();
    try {
      const saved = localStorage.getItem('natura_orders_v2');
      if (saved) {
        const list = JSON.parse(saved);
        localStorage.setItem(
          'natura_orders_v2',
          JSON.stringify(list.map((o: OrderDetails) => (o.ref === ref ? { ...o, ...updates } : o)))
        );
      }
    } catch {
      /* ignore */
    }
    return updated;
  } catch (err) {
    console.warn('Backend order update failed:', err);
    return { ...updates, ref } as OrderDetails;
  }
}

export async function updateOrderStatus(ref: string, stage: OrderStage): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/orders/${ref}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage }),
    });
    try {
      const saved = localStorage.getItem('natura_orders_v2');
      if (saved) {
        const list = JSON.parse(saved);
        localStorage.setItem(
          'natura_orders_v2',
          JSON.stringify(list.map((o: OrderDetails) => (o.ref === ref ? { ...o, stage } : o)))
        );
      }
    } catch {
      /* ignore */
    }
    return res.ok;
  } catch (err) {
    console.warn('Backend order status update failed:', err);
    return true;
  }
}

export async function deleteOrder(ref: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/orders/${ref}`, {
      method: 'DELETE',
    });
    try {
      const saved = localStorage.getItem('natura_orders_v2');
      if (saved) {
        const list = JSON.parse(saved);
        localStorage.setItem(
          'natura_orders_v2',
          JSON.stringify(list.filter((o: OrderDetails) => o.ref !== ref))
        );
      }
    } catch {
      /* ignore */
    }
    return res.ok;
  } catch (err) {
    console.warn('Backend order delete failed:', err);
    return true;
  }
}
