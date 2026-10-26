import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';
import { INITIAL_PRODUCTS, INITIAL_HERO_SLIDES, INITIAL_CUSTOMERS } from './src/seedData.ts';
import { CATEGORIES } from './src/data.ts';
import type { OrderDetails, Category, Customer } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const DATA_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// In-memory OTP cache for password resets (email -> { otp, expiresAt, role })
const otpStore = new Map<string, { otp: string; expiresAt: number; role: 'admin' | 'customer' }>();

// Real Email Dispatch helper
async function sendVerificationEmail(toEmail: string, otpCode: string) {
  try {
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"Natura Coco Fresh" <${smtpUser}>`,
        to: toEmail,
        subject: `Your Account Verification Code: ${otpCode}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #faf9f6;">
            <h2 style="color: #1a4d2e; margin-bottom: 8px;">Natura Coco - Account Security</h2>
            <p style="color: #4a5568; font-size: 14px;">Here is your 6-digit verification code to reset your account password:</p>
            <div style="background: #ffffff; border: 2px dashed #166534; padding: 18px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #166534; border-radius: 12px; margin: 20px 0;">
              ${otpCode}
            </div>
            <p style="color: #718096; font-size: 12px; line-height: 1.5;">This code will expire in 10 minutes. If you did not initiate this request, please safely ignore this email.</p>
          </div>
        `,
      });
      console.log(`[EMAIL DISPATCH] Real email sent to ${toEmail}`);
    } else {
      console.log(`[EMAIL DISPATCH] Sent OTP to ${toEmail}. Code: ${otpCode} (Configure SMTP_USER & SMTP_PASS in environment to send via SMTP)`);
    }
  } catch (err) {
    console.error('[EMAIL ERROR] Failed to send email via SMTP:', err);
  }
}

// Ensure data store directory and initial data
interface StoreData {
  products: typeof INITIAL_PRODUCTS;
  banners: typeof INITIAL_HERO_SLIDES;
  categories: Category[];
  customers: Customer[];
  orders: OrderDetails[];
}

function loadStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(STORE_FILE)) {
      const initial: StoreData = {
        products: INITIAL_PRODUCTS,
        banners: INITIAL_HERO_SLIDES,
        categories: CATEGORIES,
        customers: [],
        orders: [],
      };
      fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    const loadedCustomers = Array.isArray(parsed.customers)
      ? parsed.customers.filter((c: Customer) => !c.id?.startsWith('cust-10'))
      : [];
    return {
      products: parsed.products && parsed.products.length > 0 ? parsed.products : INITIAL_PRODUCTS,
      banners: parsed.banners && parsed.banners.length > 0 ? parsed.banners : INITIAL_HERO_SLIDES,
      categories: parsed.categories && parsed.categories.length > 0 ? parsed.categories : CATEGORIES,
      customers: loadedCustomers,
      orders: parsed.orders || [],
    };
  } catch (err) {
    console.error('Error loading store, using defaults', err);
    return {
      products: INITIAL_PRODUCTS,
      banners: INITIAL_HERO_SLIDES,
      categories: CATEGORIES,
      customers: [],
      orders: [],
    };
  }
}

function saveStore(data: StoreData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write store', err);
  }
}

let store = loadStore();

// --- API ROUTES ---

// Categories
app.get('/api/categories', (_req, res) => {
  res.json(store.categories);
});

app.post('/api/categories', (req, res) => {
  const cat = req.body;
  if (!cat.id) {
    cat.id = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ('cat-' + Date.now());
  }
  // Ensure unique ID
  if (store.categories.some((c) => c.id === cat.id)) {
    cat.id = `${cat.id}-${Date.now().toString().slice(-4)}`;
  }
  store.categories.push(cat);
  saveStore(store);
  res.status(201).json(cat);
});

app.put('/api/categories/:id', (req, res) => {
  const id = req.params.id;
  const index = store.categories.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Category not found' });
  }
  store.categories[index] = { ...store.categories[index], ...req.body, id };
  saveStore(store);
  res.json(store.categories[index]);
});

app.delete('/api/categories/:id', (req, res) => {
  const id = req.params.id;
  store.categories = store.categories.filter((c) => c.id !== id);
  saveStore(store);
  res.json({ success: true, id });
});

// Products
app.get('/api/products', (_req, res) => {
  res.json(store.products);
});

app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  if (!newProduct.id) {
    newProduct.id = 'p-' + Date.now();
  }
  // Ensure default arrays and visibility
  if (!newProduct.benefits) newProduct.benefits = [];
  if (!newProduct.faqs) newProduct.faqs = [];
  if (!newProduct.cityVisibility) newProduct.cityVisibility = 'nationwide';
  if (newProduct.inStock === undefined) newProduct.inStock = true;

  store.products = [newProduct, ...store.products];
  saveStore(store);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const index = store.products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  store.products[index] = { ...store.products[index], ...req.body, id };
  saveStore(store);
  res.json(store.products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  store.products = store.products.filter((p) => p.id !== id);
  saveStore(store);
  res.json({ success: true, id });
});

// Banners (Hero slides)
app.get('/api/banners', (_req, res) => {
  res.json(store.banners);
});

app.put('/api/banners', (req, res) => {
  if (Array.isArray(req.body)) {
    store.banners = req.body;
    saveStore(store);
    return res.json(store.banners);
  }
  res.status(400).json({ error: 'Expected array of slides' });
});

app.put('/api/banners/:id', (req, res) => {
  const id = req.params.id;
  const index = store.banners.findIndex((b) => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Banner not found' });
  }
  store.banners[index] = { ...store.banners[index], ...req.body, id };
  saveStore(store);
  res.json(store.banners[index]);
});

// Orders
app.get('/api/orders', (_req, res) => {
  res.json(store.orders);
});

app.get('/api/orders/:ref', (req, res) => {
  const ref = req.params.ref;
  const order = store.orders.find((o) => o.ref === ref);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

app.post('/api/orders', (req, res) => {
  const order = req.body;
  if (!order.ref) {
    order.ref = 'NC-' + Math.floor(100000 + Math.random() * 900000);
  }
  if (!order.placedAt) {
    order.placedAt = new Date().toLocaleString('en-PK', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }
  if (!order.stage) {
    order.stage = 'placed';
  }
  store.orders = [order, ...store.orders];

  // Update customer orders count and total spent
  const orderTotal = Number(order.total) || 0;
  const cleanOrderPhone = (order.phone || '').replace(/\D/g, '');
  const custIndex = store.customers.findIndex((c) => {
    if (order.customerId && c.id === order.customerId) return true;
    if (order.customerEmail && c.email && c.email.toLowerCase() === order.customerEmail.toLowerCase()) return true;
    const cleanCustPhone = (c.phone || '').replace(/\D/g, '');
    if (cleanOrderPhone.length >= 7 && cleanCustPhone.length >= 7) {
      if (cleanOrderPhone.endsWith(cleanCustPhone.slice(-7)) || cleanCustPhone.endsWith(cleanOrderPhone.slice(-7))) {
        return true;
      }
    }
    return false;
  });

  if (custIndex !== -1) {
    store.customers[custIndex].totalOrders = (store.customers[custIndex].totalOrders || 0) + 1;
    store.customers[custIndex].totalSpent = (store.customers[custIndex].totalSpent || 0) + orderTotal;
    if (order.address && !store.customers[custIndex].address) {
      store.customers[custIndex].address = order.address;
    }
  }

  saveStore(store);
  res.status(201).json(order);
});

app.put('/api/orders/:ref', (req, res) => {
  const ref = req.params.ref;
  const index = store.orders.findIndex((o) => o.ref === ref);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  store.orders[index] = { ...store.orders[index], ...req.body, ref };
  saveStore(store);
  res.json(store.orders[index]);
});

app.put('/api/orders/:ref/status', (req, res) => {
  const ref = req.params.ref;
  const { stage } = req.body;
  const index = store.orders.findIndex((o) => o.ref === ref);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  store.orders[index].stage = stage;
  saveStore(store);
  res.json(store.orders[index]);
});

app.delete('/api/orders/:ref', (req, res) => {
  const ref = req.params.ref;
  store.orders = store.orders.filter((o) => o.ref !== ref);
  saveStore(store);
  res.json({ success: true, ref });
});

// --- Customers API ---
app.get('/api/customers', (_req, res) => {
  res.json(store.customers);
});

app.post('/api/customers', (req, res) => {
  const customer: Customer = req.body;
  if (!customer.id) {
    customer.id = 'cust-' + Date.now();
  }
  if (!customer.registeredAt) {
    customer.registeredAt = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  if (!customer.status) customer.status = 'active';
  if (customer.totalOrders === undefined) customer.totalOrders = 0;
  if (customer.totalSpent === undefined) customer.totalSpent = 0;

  // Ensure password is not empty
  customer.password = (customer.password && customer.password.trim()) || '123456';
  customer.email = (customer.email || '').trim().toLowerCase();
  customer.phone = (customer.phone || '').trim();

  // Check if email already registered
  const exists = store.customers.some(
    (c) => c.email.trim().toLowerCase() === customer.email
  );
  if (exists) {
    return res.status(400).json({ error: 'This email is already registered.' });
  }

  store.customers = [customer, ...store.customers];
  saveStore(store);
  res.status(201).json(customer);
});

app.put('/api/customers/:id', (req, res) => {
  const id = req.params.id;
  const index = store.customers.findIndex((c) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  const updates = { ...req.body };
  if (updates.email) updates.email = updates.email.trim().toLowerCase();
  if (updates.phone) updates.phone = updates.phone.trim();
  if (updates.password) updates.password = updates.password.trim();

  store.customers[index] = { ...store.customers[index], ...updates, id };
  saveStore(store);
  res.json(store.customers[index]);
});

app.delete('/api/customers/:id', (req, res) => {
  const id = req.params.id;
  store.customers = store.customers.filter((c) => c.id !== id);
  saveStore(store);
  res.json({ success: true, id });
});

// Customer Authentication (Accepts Email or Phone)
app.post('/api/auth/customer-login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email/Mobile and password are required.' });
  }

  const loginId = email.trim().toLowerCase();
  const rawDigits = email.trim().replace(/\D/g, '');

  const customer = store.customers.find((c) => {
    const custEmail = (c.email || '').trim().toLowerCase();
    const custPhoneDigits = (c.phone || '').trim().replace(/\D/g, '');
    return custEmail === loginId || (rawDigits.length >= 7 && custPhoneDigits === rawDigits);
  });

  if (!customer) {
    return res.status(404).json({ error: 'No account found with this email or mobile number.' });
  }

  if (customer.status === 'blocked') {
    return res.status(403).json({ error: 'This customer account has been suspended by store admin.' });
  }

  const expectedPass = (customer.password || '123456').trim();
  const givenPass = password.trim();

  if (expectedPass !== givenPass) {
    return res.status(401).json({ error: 'Incorrect password. Please verify and try again.' });
  }

  res.json({ success: true, customer });
});

// OTP-based Forgot Password Flow (Dispatches to Email)
app.post('/api/auth/forgot-password/request-otp', async (req, res) => {
  const { email, role } = req.body; // role: 'admin' | 'customer'
  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (role === 'admin') {
    const validAdminEmails = ['admin@naturacoco.pk', 'saif.ur.rehhmann@gmail.com', 'admin'];
    if (!validAdminEmails.includes(normalizedEmail)) {
      return res.status(404).json({ error: 'No admin account found with this email address.' });
    }
  } else {
    const customer = store.customers.find((c) => c.email.trim().toLowerCase() === normalizedEmail);
    if (!customer) {
      return res.status(404).json({ error: 'No customer account registered with this email.' });
    }
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(normalizedEmail, { otp, expiresAt, role: role || 'customer' });

  // Send real email via nodemailer
  await sendVerificationEmail(normalizedEmail, otp);

  // Return clean response - DO NOT display OTP on page
  res.json({
    success: true,
    message: `A 6-digit verification code has been dispatched to ${normalizedEmail}. Please check your inbox and spam folder.`,
  });
});

app.post('/api/auth/forgot-password/verify-reset', (req, res) => {
  const { email, otp, newPassword, role } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: 'Email, OTP code, and new password are required.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const cached = otpStore.get(normalizedEmail);

  if (!cached) {
    return res.status(400).json({ error: 'No pending reset code found for this email. Please request a new code.' });
  }

  if (Date.now() > cached.expiresAt) {
    otpStore.delete(normalizedEmail);
    return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
  }

  if (cached.otp !== otp.trim()) {
    return res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
  }

  // OTP is valid, update password
  if (role === 'admin' || cached.role === 'admin') {
    // Admin password reset
    otpStore.delete(normalizedEmail);
    return res.json({ success: true, message: 'Admin password has been reset successfully!' });
  } else {
    // Customer password reset
    const customerIndex = store.customers.findIndex((c) => c.email.toLowerCase() === normalizedEmail);
    if (customerIndex !== -1) {
      store.customers[customerIndex].password = newPassword.trim();
      saveStore(store);
    }
    otpStore.delete(normalizedEmail);
    return res.json({ success: true, message: 'Your password has been reset successfully! You can now sign in.' });
  }
});

// Reset Store
app.post('/api/reset', (_req, res) => {
  store = {
    products: INITIAL_PRODUCTS,
    banners: INITIAL_HERO_SLIDES,
    categories: CATEGORIES,
    customers: INITIAL_CUSTOMERS,
    orders: [],
  };
  saveStore(store);
  res.json({ success: true, message: 'Store reset to defaults' });
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`> Natura Coco Fullstack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
