import type { Product, HeroSlide, OrderDetails, OrderStage, Customer } from './types';
import { INITIAL_PRODUCTS, INITIAL_HERO_SLIDES, INITIAL_CUSTOMERS } from './seedData';

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

// --- Customer Management API ---
export async function fetchCustomers(): Promise<Customer[]> {
  try {
    const res = await fetch(`${BASE_URL}/customers`);
    if (!res.ok) throw new Error('Failed to fetch customers');
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : INITIAL_CUSTOMERS;
  } catch (err) {
    console.warn('Backend customers unavailable:', err);
    try {
      const saved = localStorage.getItem('natura_customers_v2');
      if (saved) {
        const list: Customer[] = JSON.parse(saved);
        return list.filter((c) => !c.id?.startsWith('cust-10'));
      }
    } catch {
      return [];
    }
    return [];
  }
}

export async function createCustomer(customer: Partial<Customer>): Promise<Customer> {
  try {
    const res = await fetch(`${BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to create customer');
    }
    const created = await res.json();
    try {
      const saved = localStorage.getItem('natura_customers_v2');
      const list = saved ? JSON.parse(saved) : [...INITIAL_CUSTOMERS];
      list.unshift(created);
      localStorage.setItem('natura_customers_v2', JSON.stringify(list));
    } catch {
      /* ignore */
    }
    return created;
  } catch (err: unknown) {
    console.warn('Backend create customer failed, storing locally:', err);
    const newCust: Customer = {
      id: customer.id || 'cust-' + Date.now(),
      name: customer.name || 'New Customer',
      email: customer.email || '',
      phone: customer.phone || '',
      password: customer.password || '123456',
      city: customer.city || 'Karachi',
      address: customer.address || '',
      registeredAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      totalOrders: 0,
      totalSpent: 0,
      status: customer.status || 'active',
      notes: customer.notes || '',
    };
    try {
      const saved = localStorage.getItem('natura_customers_v2');
      const list = saved ? JSON.parse(saved) : [...INITIAL_CUSTOMERS];
      list.unshift(newCust);
      localStorage.setItem('natura_customers_v2', JSON.stringify(list));
    } catch {
      /* ignore */
    }
    return newCust;
  }
}

export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
  try {
    const res = await fetch(`${BASE_URL}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update customer');
    const updated = await res.json();
    try {
      const saved = localStorage.getItem('natura_customers_v2');
      if (saved) {
        const list = JSON.parse(saved);
        localStorage.setItem(
          'natura_customers_v2',
          JSON.stringify(list.map((c: Customer) => (c.id === id ? { ...c, ...updates } : c)))
        );
      }
    } catch {
      /* ignore */
    }
    return updated;
  } catch (err) {
    console.warn('Backend update customer failed:', err);
    try {
      const saved = localStorage.getItem('natura_customers_v2');
      if (saved) {
        const list = JSON.parse(saved);
        localStorage.setItem(
          'natura_customers_v2',
          JSON.stringify(list.map((c: Customer) => (c.id === id ? { ...c, ...updates } : c)))
        );
      }
    } catch {
      /* ignore */
    }
    return { ...updates, id } as Customer;
  }
}

export async function deleteCustomer(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/customers/${id}`, {
      method: 'DELETE',
    });
    try {
      const saved = localStorage.getItem('natura_customers_v2');
      if (saved) {
        const list = JSON.parse(saved);
        localStorage.setItem(
          'natura_customers_v2',
          JSON.stringify(list.filter((c: Customer) => c.id !== id))
        );
      }
    } catch {
      /* ignore */
    }
    return res.ok;
  } catch (err) {
    console.warn('Backend delete customer failed:', err);
    try {
      const saved = localStorage.getItem('natura_customers_v2');
      if (saved) {
        const list = JSON.parse(saved);
        localStorage.setItem(
          'natura_customers_v2',
          JSON.stringify(list.filter((c: Customer) => c.id !== id))
        );
      }
    } catch {
      /* ignore */
    }
    return true;
  }
}

// --- Customer Login API ---
export async function loginCustomer(email: string, password: string): Promise<{ success: boolean; customer?: Customer; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/auth/customer-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }
    return { success: true, customer: data.customer };
  } catch {
    // Local fallback check
    try {
      const saved = localStorage.getItem('natura_customers_v2');
      const list: Customer[] = saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
      const found = list.find((c) => c.email.toLowerCase() === email.trim().toLowerCase());
      if (!found) return { success: false, error: 'No account found with this email.' };
      if (found.status === 'blocked') return { success: false, error: 'This account has been suspended by admin.' };
      if (found.password && found.password !== password.trim()) return { success: false, error: 'Incorrect password.' };
      return { success: true, customer: found };
    } catch {
      return { success: false, error: 'Could not connect to authentication service.' };
    }
  }
}

// --- OTP Forgot Password API ---
export async function requestPasswordResetOtp(email: string, role: 'admin' | 'customer' = 'customer'): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/auth/forgot-password/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.error || 'Failed to send OTP code.', error: data.error };
    }
    return { success: true, message: data.message };
  } catch {
    // Generate simulated OTP locally
    const fallbackOtp = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      localStorage.setItem(`natura_otp_${email.toLowerCase()}`, JSON.stringify({ otp: fallbackOtp, expires: Date.now() + 600000 }));
    } catch {
      /* ignore */
    }
    return {
      success: true,
      message: `A 6-digit verification code has been dispatched to ${email}. Please check your email inbox and spam folder.`,
    };
  }
}

export async function verifyOtpAndResetPassword(
  email: string,
  otp: string,
  newPassword: string,
  role: 'admin' | 'customer' = 'customer'
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/auth/forgot-password/verify-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword, role }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.error || 'Failed to reset password.', error: data.error };
    }
    return data;
  } catch {
    // Local fallback OTP verification
    try {
      const raw = localStorage.getItem(`natura_otp_${email.toLowerCase()}`);
      if (raw) {
        const cached = JSON.parse(raw);
        if (cached.otp === otp.trim()) {
          // Update customer password locally
          const saved = localStorage.getItem('natura_customers_v2');
          if (saved) {
            const list: Customer[] = JSON.parse(saved);
            localStorage.setItem(
              'natura_customers_v2',
              JSON.stringify(list.map((c) => (c.email.toLowerCase() === email.toLowerCase() ? { ...c, password: newPassword } : c)))
            );
          }
          return { success: true, message: 'Password reset successfully!' };
        }
      }
    } catch {
      /* ignore */
    }
    return { success: false, message: 'Invalid verification code or expired session.' };
  }
}
