import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INITIAL_PRODUCTS, INITIAL_HERO_SLIDES } from './src/seedData.ts';
import { CATEGORIES } from './src/data.ts';
import type { OrderDetails, Category } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const DATA_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data store directory and initial data
interface StoreData {
  products: typeof INITIAL_PRODUCTS;
  banners: typeof INITIAL_HERO_SLIDES;
  categories: Category[];
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
        orders: [],
      };
      fs.writeFileSync(STORE_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      products: parsed.products && parsed.products.length > 0 ? parsed.products : INITIAL_PRODUCTS,
      banners: parsed.banners && parsed.banners.length > 0 ? parsed.banners : INITIAL_HERO_SLIDES,
      categories: parsed.categories && parsed.categories.length > 0 ? parsed.categories : CATEGORIES,
      orders: parsed.orders || [],
    };
  } catch (err) {
    console.error('Error loading store, using defaults', err);
    return {
      products: INITIAL_PRODUCTS,
      banners: INITIAL_HERO_SLIDES,
      categories: CATEGORIES,
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

// Reset Store
app.post('/api/reset', (_req, res) => {
  store = {
    products: INITIAL_PRODUCTS,
    banners: INITIAL_HERO_SLIDES,
    categories: CATEGORIES,
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
