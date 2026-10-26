import { useState, useMemo, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  MapPin,
  Settings,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Search,
  CheckCircle2,
  Save,
  X,
  ExternalLink,
  Sliders,
  Store,
  Menu,
  Leaf,
  Sparkles,
  Upload,
  Image as ImageIcon,
  LogOut,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Receipt,
  Users,
  UserCheck,
  UserX,
  UserPlus,
  History,
  Lock,
  Mail,
  Phone,
} from 'lucide-react';
import type {
  Product,
  Category,
  HeroSlide,
  OrderDetails,
  OrderStage,
  CityVisibility,
  CityId,
  Customer,
} from '@/types';
import { CITIES, PICKUP_LOCATIONS, BRAND } from '@/data';
import { rs } from '@/utils/format';
import { cn } from '@/utils/cn';
import { OrderReceiptModal } from './OrderReceiptModal';

interface Props {
  open: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  banners: HeroSlide[];
  orders: OrderDetails[];
  customers: Customer[];
  onAddProduct: (p: Partial<Product>) => Promise<Product | unknown>;
  onEditProduct: (id: string, updates: Partial<Product>) => Promise<void | unknown>;
  onDeleteProduct: (id: string) => Promise<boolean | unknown>;
  onAddCategory: (c: Category) => Promise<Category | unknown>;
  onEditCategory: (id: string, updates: Partial<Category>) => Promise<void | unknown>;
  onDeleteCategory: (id: string) => Promise<boolean | unknown>;
  onAddCustomer: (c: Partial<Customer>) => Promise<Customer | unknown>;
  onEditCustomer: (id: string, updates: Partial<Customer>) => Promise<void | unknown>;
  onDeleteCustomer: (id: string) => Promise<boolean | unknown>;
  onUpdateBanners: (slides: HeroSlide[]) => Promise<HeroSlide[] | unknown>;
  onUpdateOrderStatus: (ref: string, stage: OrderStage) => Promise<boolean | unknown>;
  onEditOrder: (ref: string, updates: Partial<OrderDetails>) => Promise<void | unknown>;
  onDeleteOrder: (ref: string) => Promise<boolean | unknown>;
  onRefresh: () => void;
  onLogout?: () => void;
}

type SidebarTab = 'dashboard' | 'products' | 'categories' | 'orders' | 'customers' | 'cities' | 'banners' | 'settings';

const PRESET_IMAGES = [
  { label: 'Green Tender Coconuts', url: 'https://images.pexels.com/photos/16005627/pexels-photo-16005627.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { label: 'Fresh Coconut Water & Meat', url: 'https://images.pexels.com/photos/8995296/pexels-photo-8995296.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { label: 'Packed Coconut Crate', url: 'https://images.pexels.com/photos/18139256/pexels-photo-18139256.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { label: 'Chilled Coconut Bottle', url: 'https://images.pexels.com/photos/1413469/pexels-photo-1413469.png?auto=compress&cs=tinysrgb&h=650&w=940' },
  { label: 'Fresh Mango Juice', url: 'https://images.pexels.com/photos/6174874/pexels-photo-6174874.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { label: 'Tropical Juice Variety', url: 'https://images.pexels.com/photos/8557143/pexels-photo-8557143.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { label: 'Family Hydration Pack', url: 'https://images.pexels.com/photos/38853682/pexels-photo-38853682.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
];

export function AdminDashboard({
  open,
  onClose,
  products,
  categories,
  banners,
  orders,
  customers = [],
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onUpdateBanners,
  onUpdateOrderStatus,
  onEditOrder,
  onDeleteOrder,
  onRefresh,
  onLogout,
}: Props) {
  const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [productCityFilter, setProductCityFilter] = useState<'all' | 'nationwide' | 'karachi_only'>('all');
  
  // Customer state & modals
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerStatusFilter, setCustomerStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [viewingCustomerOrders, setViewingCustomerOrders] = useState<Customer | null>(null);

  // Product modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Category modals
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Order modals
  const [editingOrder, setEditingOrder] = useState<OrderDetails | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<OrderDetails | null>(null);
  const [viewingSlipOrder, setViewingSlipOrder] = useState<OrderDetails | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Local editable banner state
  const [localBanners, setLocalBanners] = useState<HeroSlide[]>(banners);
  const [savingBanners, setSavingBanners] = useState(false);

  // Store Settings state
  const [storeName, setStoreName] = useState(BRAND.name);
  const [storePhone, setStorePhone] = useState(BRAND.phone);
  const [storeEmail, setStoreEmail] = useState(BRAND.email);
  const [storeAddress, setStoreAddress] = useState(PICKUP_LOCATIONS[0].address);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState('3000');

  useEffect(() => {
    if (banners && banners.length > 0) {
      setLocalBanners(banners);
    }
  }, [banners]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddNewSlide = () => {
    const newSlide: HeroSlide = {
      id: 'h-' + Date.now(),
      eyebrow: 'Fresh Special',
      title: 'Tender Coconut Water & Fresh Malai',
      subtitle: 'Pure hydration, sweet refreshing electrolytes delivered cold across Pakistan.',
      price: 'From Rs. 350',
      cta: 'Order Now',
      tone: 'palm',
      image: PRESET_IMAGES[0].url,
      align: 'right',
    };
    const updated = [...localBanners, newSlide];
    setLocalBanners(updated);
    showToast('New banner slide added! Click "Save All Banners Live" to publish.');
  };

  const handleDeleteSlide = (index: number) => {
    if (localBanners.length <= 1) {
      showToast('At least one hero banner is required for the store.');
      return;
    }
    const updated = localBanners.filter((_, i) => i !== index);
    setLocalBanners(updated);
    showToast(`Banner slide #${index + 1} deleted. Click "Save All Banners Live" to save.`);
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localBanners.length) return;
    const copy = [...localBanners];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    setLocalBanners(copy);
    showToast(`Banner slide moved ${direction}. Click "Save All Banners" to apply order.`);
  };

  const handleSaveSingleSlide = async (slideIndex: number) => {
    setSavingBanners(true);
    await onUpdateBanners(localBanners);
    setSavingBanners(false);
    showToast(`Banner #${slideIndex + 1} saved and live on homepage!`);
  };

  const handleSaveStoreSettings = () => {
    showToast('Store & brand settings saved successfully!');
  };

  // Stats calculation
  const stats = useMemo(() => {
    const nationwideCount = products.filter((p) => p.cityVisibility === 'nationwide').length;
    const karachiOnlyCount = products.filter((p) => p.cityVisibility === 'karachi_only').length;
    const inStockCount = products.filter((p) => p.inStock !== false).length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const pendingOrders = orders.filter((o) => !o.stage || o.stage === 'placed' || o.stage === 'prep').length;

    const totalCustomers = (customers || []).length;
    const activeCustomers = (customers || []).filter((c) => c.status === 'active').length;
    const blockedCustomers = (customers || []).filter((c) => c.status === 'blocked').length;
    const customerSpendTotal = (customers || []).reduce((sum, c) => {
      const cleanCustPhone = (c.phone || '').replace(/\D/g, '');
      const custOrders = orders.filter((o) => {
        if (o.customerId && o.customerId === c.id) return true;
        if (o.customerEmail && c.email && o.customerEmail.toLowerCase() === c.email.toLowerCase()) return true;
        const cleanOrderPhone = (o.phone || '').replace(/\D/g, '');
        if (cleanCustPhone.length >= 7 && cleanOrderPhone.length >= 7) {
          if (cleanOrderPhone.endsWith(cleanCustPhone.slice(-7)) || cleanCustPhone.endsWith(cleanOrderPhone.slice(-7))) return true;
        }
        return false;
      });
      const orderSpend = custOrders.reduce((s, o) => s + (Number(o.total) || 0), 0);
      return sum + Math.max(c.totalSpent || 0, orderSpend);
    }, 0);

    return {
      totalProducts: products.length,
      totalCategories: categories.length,
      nationwideCount,
      karachiOnlyCount,
      inStockCount,
      stockRate: products.length > 0 ? Math.round((inStockCount / products.length) * 100) : 100,
      totalOrders: orders.length,
      pendingOrders,
      totalRevenue,
      activeBanners: banners.length,
      totalCustomers,
      activeCustomers,
      blockedCustomers,
      customerSpendTotal,
    };
  }, [products, categories, orders, banners, customers]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.badge && p.badge.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCity =
        productCityFilter === 'all'
          ? true
          : productCityFilter === 'nationwide'
          ? p.cityVisibility === 'nationwide'
          : p.cityVisibility === 'karachi_only';

      return matchesSearch && matchesCity;
    });
  }, [products, searchQuery, productCityFilter]);

  const filteredCategories = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      c.tagline.toLowerCase().includes(categorySearch.toLowerCase()) ||
      c.id.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categories, categorySearch]);

  const filteredCustomers = useMemo(() => {
    return (customers || []).filter((c) => {
      const q = customerSearch.trim().toLowerCase();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.city && c.city.toLowerCase().includes(q));

      const matchesStatus =
        customerStatusFilter === 'all'
          ? true
          : customerStatusFilter === 'active'
          ? c.status === 'active'
          : c.status === 'blocked';

      return matchesSearch && matchesStatus;
    });
  }, [customers, customerSearch, customerStatusFilter]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex bg-cream-100 text-palm-950 font-body antialiased overflow-hidden">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-2.5 rounded-full bg-palm-900 text-cream-50 px-6 py-3 shadow-lift text-xs font-bold animate-popIn border border-palm-700">
          <CheckCircle2 size={16} className="text-coral-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* --- LEFT SIDEBAR --- */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-palm-200/80 bg-white transition-transform duration-300 ease-in-out md:static md:translate-x-0 shadow-soft',
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-palm-100 px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-palm-600 text-white shadow-soft">
              <Leaf size={19} />
            </span>
            <div className="flex flex-col leading-none">
              <span className="font-display text-base font-extrabold text-palm-900">
                Natura <span className="text-palm-600">Coco</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-palm-500">
                Admin Portal
              </span>
            </div>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden text-palm-400 hover:text-palm-700 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 p-3.5 overflow-y-auto no-scrollbar">
          <SidebarItem
            active={activeTab === 'dashboard'}
            onClick={() => {
              setActiveTab('dashboard');
              setMobileSidebarOpen(false);
            }}
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
          />

          <SidebarItem
            active={activeTab === 'products'}
            onClick={() => {
              setActiveTab('products');
              setMobileSidebarOpen(false);
            }}
            icon={<Package size={18} />}
            label="Products & Stock"
            badge={products.length.toString()}
          />

          <SidebarItem
            active={activeTab === 'categories'}
            onClick={() => {
              setActiveTab('categories');
              setMobileSidebarOpen(false);
            }}
            icon={<FolderTree size={18} />}
            label="Categories"
            badge={categories.length.toString()}
          />

          <SidebarItem
            active={activeTab === 'orders'}
            onClick={() => {
              setActiveTab('orders');
              setMobileSidebarOpen(false);
            }}
            icon={<ShoppingBag size={18} />}
            label="Customer Orders"
            badge={orders.length > 0 ? orders.length.toString() : undefined}
          />

          <SidebarItem
            active={activeTab === 'customers'}
            onClick={() => {
              setActiveTab('customers');
              setMobileSidebarOpen(false);
            }}
            icon={<Users size={18} />}
            label="Customers"
            badge={(customers || []).length.toString()}
          />

          <SidebarItem
            active={activeTab === 'cities'}
            onClick={() => {
              setActiveTab('cities');
              setMobileSidebarOpen(false);
            }}
            icon={<MapPin size={18} />}
            label="City Delivery"
          />

          <SidebarItem
            active={activeTab === 'banners'}
            onClick={() => {
              setLocalBanners(banners);
              setActiveTab('banners');
              setMobileSidebarOpen(false);
            }}
            icon={<Sliders size={18} />}
            label="Hero Banners"
            badge={banners.length.toString()}
          />

          <SidebarItem
            active={activeTab === 'settings'}
            onClick={() => {
              setActiveTab('settings');
              setMobileSidebarOpen(false);
            }}
            icon={<Settings size={18} />}
            label="Website Settings"
          />
        </nav>

        <div className="border-t border-palm-100 p-3.5 space-y-2">
          <button
            onClick={onClose}
            className="flex w-full items-center justify-between rounded-2xl bg-cream-50 border border-palm-200 px-4 py-2.5 text-xs font-bold text-palm-900 hover:bg-palm-50 active:scale-95 transition shadow-soft cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Store size={16} className="text-palm-700" />
              <span>Back to Store</span>
            </span>
            <ExternalLink size={14} className="text-palm-400" />
          </button>

          {onLogout && (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-coral-200 bg-coral-50/50 px-4 py-2 text-xs font-bold text-coral-600 hover:bg-coral-50 transition cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out of Admin</span>
            </button>
          )}
        </div>
      </aside>

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-palm-950/40 backdrop-blur-xs md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* --- RIGHT MAIN PANEL --- */}
      <div className="flex flex-1 flex-col overflow-hidden bg-cream-50">
        <header className="flex h-16 items-center justify-between border-b border-palm-200/70 bg-white/90 backdrop-blur px-4 md:px-8 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-palm-200 text-palm-700 md:hidden cursor-pointer"
            >
              <Menu size={18} />
            </button>
            <span className="text-xs font-semibold text-palm-500">
              Admin Portal <span className="mx-1 text-palm-300">/</span>{' '}
              <span className="font-extrabold text-palm-900 capitalize font-display">
                {activeTab === 'banners'
                  ? 'Hero Banners'
                  : activeTab === 'settings'
                  ? 'Website Settings'
                  : activeTab === 'categories'
                  ? 'Categories Management'
                  : activeTab === 'customers'
                  ? 'Customer Accounts & CRM'
                  : activeTab}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                onRefresh();
                showToast('Synchronized with backend server');
              }}
              className="btn-ghost py-2 px-3.5 text-xs font-semibold cursor-pointer"
            >
              <RefreshCw size={13} className="text-palm-600" />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <div className="flex items-center gap-2 rounded-full border border-palm-200 bg-white px-2.5 py-1 shadow-soft">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-palm-600 text-xs font-extrabold text-white">
                A
              </div>
              <div className="hidden sm:flex flex-col text-left text-[11px] leading-tight pr-1">
                <span className="font-extrabold text-palm-900 font-display">Admin</span>
                <span className="text-palm-500 text-[10px]">Manager</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn-primary py-2 px-4 text-xs font-bold cursor-pointer"
            >
              Store View
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
          {/* ========================================================= */}
          {/* TAB 1: DASHBOARD                                          */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-3xl font-extrabold tracking-tight text-palm-900">
                    Admin Dashboard
                  </h1>
                  <p className="mt-1 text-xs text-palm-600 font-medium">
                    Overview of fresh coconuts, categories, city visibility, banners, and customer orders.
                  </p>
                </div>
                <button
                  onClick={() => {
                    onRefresh();
                    showToast('Stats updated');
                  }}
                  className="btn-ghost py-2 px-4 text-xs font-bold self-start sm:self-auto cursor-pointer"
                >
                  <RefreshCw size={14} className="text-palm-600" />
                  <span>Refresh Stats</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <NaturaMetricCard label="Total Products" value={stats.totalProducts.toString()} badge="Catalog Active" />
                <NaturaMetricCard label="Categories" value={stats.totalCategories.toString()} badge="Sections" />
                <NaturaMetricCard label="Nationwide Shipping" value={stats.nationwideCount.toString()} badge="Coconuts" />
                <NaturaMetricCard label="Karachi Express Only" value={stats.karachiOnlyCount.toString()} badge="Juices & Shakes" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <NaturaMetricCard label="In-Stock Rate" value={`${stats.stockRate}%`} badge="Inventory" />
                <NaturaMetricCard label="Hero Banners" value={stats.activeBanners.toString()} badge="Homepage" />
                <NaturaMetricCard label="Pending Orders" value={stats.pendingOrders.toString()} badge="Fulfillment" />
                <NaturaMetricCard label="Gross Revenue (COD)" value={rs(stats.totalRevenue)} badge="Orders Total" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <NaturaActionCard
                  title="Manage Products"
                  highlight={`${stats.totalProducts} Items`}
                  actionText="View catalog →"
                  onClick={() => setActiveTab('products')}
                />
                <NaturaActionCard
                  title="Categories Setup"
                  highlight={`${stats.totalCategories} Groups`}
                  actionText="Edit categories →"
                  onClick={() => setActiveTab('categories')}
                />
                <NaturaActionCard
                  title="Customer Orders"
                  highlight={`${orders.length} Placed`}
                  actionText="Review orders →"
                  onClick={() => setActiveTab('orders')}
                />
                <NaturaActionCard
                  title="Hero Banners"
                  highlight={`${stats.activeBanners} Live`}
                  actionText="Update sliders →"
                  onClick={() => setActiveTab('banners')}
                />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: PRODUCTS & STOCK                                   */}
          {/* ========================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-extrabold tracking-tight text-palm-900">
                    Products & Inventory ({products.length})
                  </h1>
                  <p className="mt-1 text-xs text-palm-600 font-medium">
                    Add new products, upload pictures from your computer/mobile, manage city visibility, size details, and FAQs.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreatingProduct(true)}
                  className="btn-primary py-2.5 px-6 text-xs font-bold shadow-soft self-start sm:self-auto cursor-pointer"
                >
                  <Plus size={16} /> Add New Product
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-3xl border border-palm-200/80 shadow-soft">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3.5 top-3 text-palm-400" />
                  <input
                    type="text"
                    placeholder="Search by name, category, or badge..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-2xl border border-palm-200 bg-cream-50/60 py-2.5 pl-9 pr-3 text-xs font-medium text-palm-900 outline-none focus:border-palm-500 focus:bg-white"
                  />
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <span className="text-xs font-bold text-palm-600 mr-1">City Filter:</span>
                  <button
                    onClick={() => setProductCityFilter('all')}
                    className={cn(
                      'chip transition cursor-pointer',
                      productCityFilter === 'all'
                        ? 'bg-palm-800 text-cream-50'
                        : 'bg-palm-50 text-palm-700 hover:bg-palm-100'
                    )}
                  >
                    All ({products.length})
                  </button>
                  <button
                    onClick={() => setProductCityFilter('nationwide')}
                    className={cn(
                      'chip transition cursor-pointer',
                      productCityFilter === 'nationwide'
                        ? 'bg-coral-500 text-white'
                        : 'bg-palm-50 text-palm-700 hover:bg-palm-100'
                    )}
                  >
                    Nationwide
                  </button>
                  <button
                    onClick={() => setProductCityFilter('karachi_only')}
                    className={cn(
                      'chip transition cursor-pointer',
                      productCityFilter === 'karachi_only'
                        ? 'bg-palm-600 text-white'
                        : 'bg-palm-50 text-palm-700 hover:bg-palm-100'
                    )}
                  >
                    Karachi Only
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((p) => {
                  const isNationwide = p.cityVisibility === 'nationwide';
                  const isKarachi = p.cityVisibility === 'karachi_only';

                  return (
                    <div
                      key={p.id}
                      className="flex flex-col justify-between rounded-3xl border border-palm-200/80 bg-white p-4 shadow-card hover:shadow-lift transition-all duration-300"
                    >
                      <div>
                        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-palm-100">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute top-2 left-2 flex flex-col gap-1">
                            <span
                              className={cn(
                                'chip text-[10px] uppercase font-bold tracking-wider backdrop-blur shadow-soft',
                                isNationwide
                                  ? 'bg-coral-500 text-white'
                                  : isKarachi
                                  ? 'bg-palm-700/90 text-cream-50'
                                  : 'bg-blue-600 text-white'
                              )}
                            >
                              {isNationwide ? 'Nationwide' : isKarachi ? 'Karachi Only' : 'Custom'}
                            </span>
                          </div>
                          <span className="absolute bottom-2 right-2 rounded-xl bg-black/70 px-2.5 py-1 text-xs font-extrabold text-white backdrop-blur">
                            {rs(p.price)}
                          </span>
                        </div>

                        <div className="mt-3.5">
                          <div className="flex items-center justify-between text-[11px] text-palm-500 font-bold uppercase tracking-wider">
                            <span>{p.categoryId.replace(/-/g, ' ')}</span>
                            <span>{p.size || p.unit || 'Standard'}</span>
                          </div>
                          <h3 className="mt-1 font-display text-base font-extrabold text-palm-900 line-clamp-1">
                            {p.name}
                          </h3>
                          <p className="mt-1 text-xs text-palm-600 line-clamp-2 leading-relaxed">
                            {p.description}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px] font-semibold text-palm-700">
                            <span className="chip bg-palm-50 border border-palm-200 py-0.5">
                              {p.faqs?.length || 0} FAQs
                            </span>
                            <span className="chip bg-palm-50 border border-palm-200 py-0.5">
                              {p.benefits?.length || 0} Benefits
                            </span>
                            {p.inStock === false && (
                              <span className="chip bg-coral-50 text-coral-600 border border-coral-200 font-bold py-0.5">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons with reliable in-app delete modal trigger */}
                      <div className="mt-4 pt-3 border-t border-palm-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-palm-200 bg-palm-50/80 py-2 text-xs font-bold text-palm-900 hover:bg-palm-100 hover:border-palm-300 transition cursor-pointer"
                        >
                          <Edit2 size={13} /> Edit Specs & Picture
                        </button>
                        <button
                          onClick={() => setDeletingProduct(p)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-coral-200 text-coral-600 hover:bg-coral-50 active:scale-95 transition cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: CATEGORIES MANAGEMENT (NEW DEDICATED TAB)          */}
          {/* ========================================================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-extrabold tracking-tight text-palm-900">
                    Categories Management ({categories.length})
                  </h1>
                  <p className="mt-1 text-xs text-palm-600 font-medium">
                    Add new categories, edit names and delivery rules, view how many products are inside each category, and manage catalog groups.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreatingCategory(true)}
                  className="btn-primary py-2.5 px-6 text-xs font-bold shadow-soft self-start sm:self-auto cursor-pointer"
                >
                  <Plus size={16} /> Add New Category
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-3xl border border-palm-200/80 shadow-soft">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3.5 top-3 text-palm-400" />
                  <input
                    type="text"
                    placeholder="Search categories by name, tagline, or id..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full rounded-2xl border border-palm-200 bg-cream-50/60 py-2.5 pl-9 pr-3 text-xs font-medium text-palm-900 outline-none focus:border-palm-500 focus:bg-white"
                  />
                </div>
                <div className="text-xs font-bold text-palm-600">
                  Total Groups: <span className="font-extrabold text-palm-900">{categories.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCategories.map((c) => {
                  const catProducts = products.filter((p) => p.categoryId === c.id);

                  return (
                    <div
                      key={c.id}
                      className="rounded-3xl border border-palm-200/80 bg-white p-6 shadow-card hover:shadow-lift transition-all duration-300 space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3 border-b border-palm-100 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-palm-100 text-palm-800 font-display font-extrabold text-lg shadow-soft">
                            {c.name.slice(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-display text-base font-extrabold text-palm-900">
                                {c.name}
                              </h3>
                              <span
                                className={cn(
                                  'chip text-[10px] font-bold py-0.5 px-2',
                                  c.nationwide
                                    ? 'bg-coral-50 text-coral-600 border border-coral-200'
                                    : 'bg-palm-50 text-palm-700 border border-palm-200'
                                )}
                              >
                                {c.nationwide ? 'Nationwide' : 'Karachi Only'}
                              </span>
                            </div>
                            <p className="text-xs text-palm-500 mt-0.5 line-clamp-1">{c.tagline}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditingCategory(c)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-palm-200 text-palm-700 hover:bg-palm-50 cursor-pointer"
                            title="Edit Category"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => setDeletingCategory(c)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-coral-200 text-coral-600 hover:bg-coral-50 cursor-pointer"
                            title="Delete Category"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Products preview */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-palm-700 mb-2">
                          <span>Products in Category:</span>
                          <span className="chip bg-palm-50 border border-palm-200 text-palm-900 text-[11px] font-extrabold py-0.5">
                            {catProducts.length} {catProducts.length === 1 ? 'Product' : 'Products'}
                          </span>
                        </div>

                        {catProducts.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-palm-200 bg-cream-50/50 p-4 text-center text-xs text-palm-400">
                            No products currently assigned to this category.
                          </div>
                        ) : (
                          <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar pr-1">
                            {catProducts.map((p) => (
                              <div
                                key={p.id}
                                className="flex items-center justify-between gap-2.5 rounded-xl bg-cream-50 p-2 text-xs border border-palm-100/80"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="h-7 w-7 rounded-lg object-cover shrink-0"
                                  />
                                  <span className="font-bold text-palm-900 truncate">{p.name}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="font-extrabold text-coral-600 text-[11px]">
                                    {rs(p.price)}
                                  </span>
                                  {p.inStock === false && (
                                    <span className="text-[9px] font-bold text-coral-600">OOS</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: CUSTOMER ORDERS (With Edit, Delete, and Slip Icons) */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-3xl font-extrabold tracking-tight text-palm-900">
                    Customer Orders ({orders.length})
                  </h1>
                  <p className="mt-1 text-xs text-palm-600 font-medium">
                    Review and update order stages in real time (instant live sync to customer confirmation screen), edit details, print invoice slips, or remove orders.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-palm-700">Real-Time Sync Active</span>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-palm-200 bg-white p-12 text-center shadow-soft">
                  <ShoppingBag size={40} className="mx-auto text-palm-300" />
                  <h3 className="mt-3 font-display text-base font-extrabold text-palm-900">No orders placed yet</h3>
                  <p className="mt-1 text-xs text-palm-500">
                    When customers place orders from the store, they will appear here in real time.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div
                      key={o.ref}
                      className={cn(
                        "rounded-3xl border p-5 shadow-card space-y-4 transition",
                        o.stage === 'delivered'
                          ? 'border-emerald-300 bg-emerald-50/20 hover:border-emerald-400'
                          : 'border-palm-200/80 bg-white hover:border-palm-300'
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-palm-100 pb-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="chip bg-palm-100 font-mono text-xs font-bold text-palm-900">
                            {o.ref}
                          </span>
                          <span className="text-xs text-palm-400 font-medium">{o.placedAt}</span>
                          {o.stage === 'delivered' ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 py-1 px-3 text-xs font-black shadow-xs">
                              <CheckCircle2 size={14} className="text-emerald-600" />
                              <span>Done (Completed)</span>
                            </span>
                          ) : (
                            <span
                              className={cn(
                                'chip text-[10px] font-bold py-0.5 px-2.5',
                                o.stage === 'transit'
                                  ? 'bg-blue-50 text-blue-700'
                                  : o.stage === 'prep'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-coral-50 text-coral-700'
                              )}
                            >
                              {o.stage === 'transit'
                                ? 'In Transit / Ready'
                                : o.stage === 'prep'
                                ? 'In Preparation'
                                : 'Order Placed'}
                            </span>
                          )}
                        </div>

                        {/* Order Action Controls: Stage Dropdown + Quick Done + Edit + Slip + Delete */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-palm-600 hidden sm:inline">Stage:</span>
                          <select
                            value={o.stage || 'placed'}
                            onChange={async (e) => {
                              const newStage = e.target.value as OrderStage;
                              await onUpdateOrderStatus(o.ref, newStage);
                              showToast(
                                newStage === 'delivered'
                                  ? `Order ${o.ref} marked as Done & Delivered!`
                                  : `Order ${o.ref} status set to ${newStage} (Live updated)`
                              );
                            }}
                            className={cn(
                              "rounded-full border px-3.5 py-1 text-xs font-bold cursor-pointer transition",
                              o.stage === 'delivered'
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-black'
                                : 'border-palm-200 bg-cream-50 text-palm-900'
                            )}
                          >
                            <option value="placed">1. Placed (Order Confirmed)</option>
                            <option value="prep">2. In Preparation (Kitchen)</option>
                            <option value="transit">3. In Transit / Ready for Pickup</option>
                            <option value="delivered">4. Delivered / Collected (✅ Done)</option>
                          </select>

                          {/* Quick Done Toggle / Indicator */}
                          {o.stage === 'delivered' ? (
                            <span
                              className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-1 text-xs font-extrabold text-emerald-800"
                              title="Order is marked as complete"
                            >
                              <Check size={13} className="stroke-[3] text-emerald-600" />
                              <span>Done</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={async () => {
                                await onUpdateOrderStatus(o.ref, 'delivered');
                                showToast(`Order ${o.ref} marked as Done & Delivered!`);
                              }}
                              className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition cursor-pointer active:scale-95 shadow-xs"
                              title="Click to instantly complete order (Mark as Done)"
                            >
                              <CheckCircle2 size={13} className="text-emerald-600" />
                              <span className="hidden sm:inline">Mark as</span> Done
                            </button>
                          )}

                          {/* Print / View Slip Icon Button */}
                          <button
                            onClick={() => setViewingSlipOrder(o)}
                            className="flex items-center gap-1.5 rounded-full border border-palm-200 bg-palm-50 px-3 py-1 text-xs font-bold text-palm-800 hover:bg-palm-100 transition cursor-pointer"
                            title="Print Tax Slip / PDF Invoice"
                          >
                            <Receipt size={14} className="text-palm-600" />
                            <span className="hidden sm:inline">Slip</span>
                          </button>

                          {/* Edit Order Icon Button */}
                          <button
                            onClick={() => setEditingOrder(o)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-palm-200 text-palm-700 hover:bg-palm-100 transition cursor-pointer"
                            title="Edit Order Details"
                          >
                            <Edit2 size={13} />
                          </button>

                          {/* Delete Order Icon Button */}
                          <button
                            onClick={() => setDeletingOrder(o)}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-coral-200 text-coral-600 hover:bg-coral-50 transition cursor-pointer"
                            title="Delete Order"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <span className="font-bold text-palm-500 uppercase tracking-wider block">Customer</span>
                          {o.customerName && (
                            <div className="mt-1 flex items-center gap-1.5 font-extrabold text-palm-900">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-coral-500 text-[10px] text-white font-black">
                                {o.customerName.charAt(0).toUpperCase()}
                              </span>
                              <span>{o.customerName}</span>
                              {o.customerEmail && (
                                <span className="text-palm-400 font-normal text-[10px]">({o.customerEmail})</span>
                              )}
                            </div>
                          )}
                          <p className={cn("text-xs font-bold text-palm-800", o.customerName ? "mt-0.5" : "mt-1")}>
                            {o.phone}
                          </p>
                          <p className="mt-0.5 text-palm-600">
                            {o.mode === 'pickup' ? 'Flagship Store Pickup' : `Address: ${o.address || 'Karachi'}`}
                          </p>
                          {o.notes && (
                            <p className="mt-1 text-[11px] text-palm-500 italic">Notes: {o.notes}</p>
                          )}
                        </div>

                        <div>
                          <span className="font-bold text-palm-500 uppercase tracking-wider block">Items Ordered</span>
                          <div className="mt-1 space-y-1">
                            {o.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-palm-800">
                                <span>{item.quantity}x {item.name}</span>
                                <span className="font-bold">{rs(item.basePrice * item.quantity)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="font-bold text-palm-500 uppercase tracking-wider block">Total & Payment</span>
                          <p className="mt-1 text-palm-700">Payment: <strong className="text-palm-900">{o.paymentMethod || 'COD'}</strong></p>
                          <p className="text-palm-700">Delivery Fee: {rs(o.deliveryFee)}</p>
                          <p className="mt-1 font-display text-base font-extrabold text-coral-600">
                            Total: {rs(o.total)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: CUSTOMER ACCOUNTS (FULL CRUD & CRM)                  */}
          {/* ========================================================= */}
          {activeTab === 'customers' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-extrabold tracking-tight text-palm-900">
                    Customer Accounts ({customers.length})
                  </h1>
                  <p className="mt-1 text-xs text-palm-600 font-medium">
                    Manage customer accounts, track orders and spend, edit contact details, reset passwords, or activate/block access.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreatingCustomer(true)}
                  className="btn-primary py-2.5 px-6 text-xs font-bold shadow-soft self-start sm:self-auto cursor-pointer flex items-center gap-2"
                >
                  <UserPlus size={16} /> Add New Customer
                </button>
              </div>

              {/* Customer Metric Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <NaturaMetricCard label="Total Customers" value={stats.totalCustomers.toString()} badge="Registered" />
                <NaturaMetricCard label="Active Accounts" value={stats.activeCustomers.toString()} badge="Verified" />
                <NaturaMetricCard label="Blocked / Inactive" value={stats.blockedCustomers.toString()} badge="Access Suspended" />
                <NaturaMetricCard label="Total Customer Spend" value={rs(stats.customerSpendTotal)} badge="Lifetime GMV" />
              </div>

              {/* Search and Status Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-3xl border border-palm-200/80 shadow-soft">
                <div className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3.5 top-3 text-palm-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, or city..."
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    className="w-full rounded-2xl border border-palm-200 bg-cream-50/60 py-2.5 pl-9 pr-3 text-xs font-medium text-palm-900 outline-none focus:border-palm-500 focus:bg-white"
                  />
                  {customerSearch && (
                    <button
                      onClick={() => setCustomerSearch('')}
                      className="absolute right-3 top-3 text-xs text-palm-400 hover:text-palm-700 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <span className="text-xs font-bold text-palm-600 mr-1">Status:</span>
                  <button
                    onClick={() => setCustomerStatusFilter('all')}
                    className={cn(
                      'chip transition cursor-pointer',
                      customerStatusFilter === 'all'
                        ? 'bg-palm-800 text-cream-50'
                        : 'bg-palm-50 text-palm-700 hover:bg-palm-100'
                    )}
                  >
                    All ({customers.length})
                  </button>
                  <button
                    onClick={() => setCustomerStatusFilter('active')}
                    className={cn(
                      'chip transition cursor-pointer',
                      customerStatusFilter === 'active'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-palm-50 text-palm-700 hover:bg-palm-100'
                    )}
                  >
                    Active ({stats.activeCustomers})
                  </button>
                  <button
                    onClick={() => setCustomerStatusFilter('blocked')}
                    className={cn(
                      'chip transition cursor-pointer',
                      customerStatusFilter === 'blocked'
                        ? 'bg-coral-600 text-white'
                        : 'bg-palm-50 text-palm-700 hover:bg-palm-100'
                    )}
                  >
                    Blocked ({stats.blockedCustomers})
                  </button>
                </div>
              </div>

              {/* Customer List / Table */}
              {filteredCustomers.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-palm-200 bg-white p-12 text-center shadow-soft">
                  <Users size={40} className="mx-auto text-palm-300" />
                  <h3 className="mt-3 font-display text-base font-extrabold text-palm-900">
                    No customers found
                  </h3>
                  <p className="mt-1 text-xs text-palm-500">
                    {customerSearch
                      ? `No customer matched your search query "${customerSearch}".`
                      : 'No customer profiles in this category.'}
                  </p>
                  <button
                    onClick={() => {
                      setCustomerSearch('');
                      setCustomerStatusFilter('all');
                      setIsCreatingCustomer(true);
                    }}
                    className="mt-4 btn-primary py-2 px-5 text-xs font-bold inline-flex items-center gap-2"
                  >
                    <UserPlus size={14} /> Add Customer
                  </button>
                </div>
              ) : (
                <div className="rounded-3xl border border-palm-200/80 bg-white shadow-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-palm-200/80 bg-palm-50/50 text-palm-600 uppercase font-bold tracking-wider">
                          <th className="py-3.5 px-5">Customer</th>
                          <th className="py-3.5 px-4">Contact</th>
                          <th className="py-3.5 px-4">City & Address</th>
                          <th className="py-3.5 px-4">Orders & Spend</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-palm-100 font-medium text-palm-900">
                        {filteredCustomers.map((c) => {
                          const cleanCustPhone = (c.phone || '').replace(/\D/g, '');
                          const customerOrders = orders.filter((o) => {
                            if (o.customerId && o.customerId === c.id) return true;
                            if (o.customerEmail && c.email && o.customerEmail.toLowerCase() === c.email.toLowerCase()) return true;
                            const cleanOrderPhone = (o.phone || '').replace(/\D/g, '');
                            if (cleanCustPhone.length >= 7 && cleanOrderPhone.length >= 7) {
                              if (cleanOrderPhone.endsWith(cleanCustPhone.slice(-7)) || cleanCustPhone.endsWith(cleanOrderPhone.slice(-7))) {
                                return true;
                              }
                            }
                            return false;
                          });
                          const sumOrdersSpend = customerOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
                          const calculatedOrders = Math.max(c.totalOrders || 0, customerOrders.length);
                          const calculatedSpend = Math.max(c.totalSpent || 0, sumOrdersSpend);

                          return (
                            <tr key={c.id} className="hover:bg-palm-50/40 transition">
                              {/* Customer Identity */}
                              <td className="py-3.5 px-5">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-palm-100 text-palm-800 font-display font-extrabold text-sm shadow-soft">
                                    {c.name.slice(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <h4 className="font-display font-extrabold text-sm text-palm-900 leading-tight">
                                      {c.name}
                                    </h4>
                                    <span className="text-[11px] text-palm-400 font-medium">
                                      Joined {c.registeredAt || 'Recently'}
                                    </span>
                                    {c.notes && (
                                      <p className="text-[10px] text-amber-700 italic max-w-xs truncate">
                                        Note: {c.notes}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Contact Information */}
                              <td className="py-3.5 px-4">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5 text-palm-800 font-bold">
                                    <Phone size={12} className="text-palm-400" />
                                    <span>{c.phone}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-palm-600 text-[11px]">
                                    <Mail size={12} className="text-palm-400" />
                                    <span>{c.email}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 text-palm-600 text-[11px] pt-0.5">
                                    <Lock size={11} className="text-palm-400" />
                                    <span>Password: <code className="bg-palm-100 text-palm-800 font-mono font-bold px-1.5 py-0.5 rounded text-[10px] select-all">{c.password || '123456'}</code></span>
                                  </div>
                                </div>
                              </td>

                              {/* Location */}
                              <td className="py-3.5 px-4">
                                <div>
                                  <span className="font-bold text-palm-900 block">{c.city || 'Karachi'}</span>
                                  <p className="text-[11px] text-palm-500 line-clamp-1 max-w-xs">
                                    {c.address || 'Standard City Delivery'}
                                  </p>
                                </div>
                              </td>

                              {/* Orders & Total Spend */}
                              <td className="py-3.5 px-4">
                                <div>
                                  <span className="font-bold text-palm-900 block">
                                    {calculatedOrders} {calculatedOrders === 1 ? 'Order' : 'Orders'}
                                  </span>
                                  <span className="font-extrabold text-coral-600 text-xs">
                                    {rs(calculatedSpend)}
                                  </span>
                                </div>
                              </td>

                              {/* Status with Quick Toggle */}
                              <td className="py-3.5 px-4">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const nextStatus = c.status === 'active' ? 'blocked' : 'active';
                                    await onEditCustomer(c.id, { status: nextStatus });
                                    showToast(
                                      `Customer ${c.name} status updated to ${nextStatus.toUpperCase()}`
                                    );
                                  }}
                                  className={cn(
                                    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold border transition cursor-pointer active:scale-95',
                                    c.status === 'active'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                      : 'bg-coral-50 text-coral-700 border-coral-200 hover:bg-coral-100'
                                  )}
                                  title="Click to toggle status"
                                >
                                  {c.status === 'active' ? (
                                    <>
                                      <UserCheck size={12} />
                                      <span>Active</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserX size={12} />
                                      <span>Blocked</span>
                                    </>
                                  )}
                                </button>
                              </td>

                              {/* Action Buttons: Orders History, Edit, Delete */}
                              <td className="py-3.5 px-5 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  {/* View Customer Orders */}
                                  <button
                                    type="button"
                                    onClick={() => setViewingCustomerOrders(c)}
                                    className="flex items-center gap-1 rounded-xl bg-palm-50 border border-palm-200 px-2.5 py-1.5 text-xs font-bold text-palm-700 hover:bg-palm-100 transition cursor-pointer"
                                    title="View Customer Order History"
                                  >
                                    <History size={13} />
                                    <span className="hidden sm:inline">Orders</span>
                                  </button>

                                  {/* Edit Customer Modal */}
                                  <button
                                    type="button"
                                    onClick={() => setEditingCustomer(c)}
                                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-palm-200 text-palm-700 hover:bg-palm-100 transition cursor-pointer"
                                    title="Edit Customer Profile"
                                  >
                                    <Edit2 size={13} />
                                  </button>

                                  {/* Delete Customer Confirmation */}
                                  <button
                                    type="button"
                                    onClick={() => setDeletingCustomer(c)}
                                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-coral-200 text-coral-600 hover:bg-coral-50 transition cursor-pointer"
                                    title="Delete Customer"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: CITY COVERAGE & DELIVERY                           */}
          {/* ========================================================= */}
          {activeTab === 'cities' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div>
                <h1 className="font-display text-3xl font-extrabold tracking-tight text-palm-900">
                  City Coverage & Delivery
                </h1>
                <p className="mt-1 text-xs text-palm-600 font-medium">
                  Delivery rules for Karachi vs Nationwide cities across Pakistan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-3xl border border-palm-200/80 bg-white p-6 shadow-card space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="chip bg-palm-100 text-palm-800 font-bold">
                      Local Hub — Express Delivery
                    </span>
                    <span className="text-xs font-bold text-palm-500">30–45 mins</span>
                  </div>
                  <h3 className="font-display text-lg font-extrabold text-palm-900">Karachi City</h3>
                  <p className="text-xs text-palm-600 leading-relaxed">
                    Full product line available: Fresh whole coconuts, cold bottled coconut waters, Sindhri mango and natural juices, bundles, and freshly scraped malai tubs.
                  </p>
                  <div className="rounded-2xl bg-cream-50 border border-palm-100 p-3.5 text-xs text-palm-800">
                    <strong>Pickup Store:</strong> {PICKUP_LOCATIONS[0].name} ({PICKUP_LOCATIONS[0].address})
                  </div>
                </div>

                <div className="rounded-3xl border border-palm-200/80 bg-white p-6 shadow-card space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="chip bg-coral-50 text-coral-600 font-bold">
                      Nationwide Shipping
                    </span>
                    <span className="text-xs font-bold text-palm-500">2–3 Days</span>
                  </div>
                  <h3 className="font-display text-lg font-extrabold text-palm-900">Nationwide Pakistan</h3>
                  <p className="text-xs text-palm-600 leading-relaxed">
                    Whole tender coconuts and malai coconuts shipped in shock-absorbing crates to Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, and Quetta.
                  </p>
                  <div className="rounded-2xl bg-cream-50 border border-palm-100 p-3.5 text-xs text-palm-800">
                    <strong>Protective Packing:</strong> Heavy-duty ventilated crates with 100% freshness guarantee.
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-palm-200/80 bg-white p-6 shadow-card">
                <h3 className="font-display text-base font-extrabold text-palm-900 mb-3">Serviceable Cities</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-palm-200 text-palm-400 uppercase font-bold tracking-wider">
                        <th className="py-2.5">City Name</th>
                        <th className="py-2.5">Province</th>
                        <th className="py-2.5">Delivery ETA</th>
                        <th className="py-2.5">Delivery Fee</th>
                        <th className="py-2.5">Eligible Products</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-palm-100 font-medium text-palm-900">
                      {CITIES.map((c) => (
                        <tr key={c.id}>
                          <td className="py-3 font-bold">{c.name}</td>
                          <td className="py-3 text-palm-500">{c.province}</td>
                          <td className="py-3">{c.deliveryEta}</td>
                          <td className="py-3 font-extrabold text-palm-900">{rs(c.deliveryFee)}</td>
                          <td className="py-3">
                            <span className={cn('chip py-0.5 text-[10px] font-bold', c.karachiOnly ? 'bg-palm-100 text-palm-800' : 'bg-coral-50 text-coral-600')}>
                              {c.karachiOnly ? 'All Items (Full Catalog)' : 'Nationwide Fresh Coconuts'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: HERO BANNERS & SLIDERS                             */}
          {/* ========================================================= */}
          {activeTab === 'banners' && (
            <div className="space-y-6 max-w-7xl mx-auto animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-display text-3xl font-extrabold tracking-tight text-palm-900">
                    Hero Banners
                  </h1>
                  <p className="mt-1 text-xs text-palm-600 font-medium">
                    Manage homepage slider slides ({localBanners.length} active), pictures, discounts, headlines, and calls to action.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={async () => {
                      setSavingBanners(true);
                      await onUpdateBanners(localBanners);
                      setSavingBanners(false);
                      showToast('All Hero Banners saved and published live to homepage!');
                    }}
                    disabled={savingBanners}
                    className="btn-primary py-2.5 px-6 text-xs font-bold shadow-soft flex items-center gap-2 cursor-pointer"
                  >
                    <Save size={15} />
                    <span>{savingBanners ? 'Publishing...' : 'Save All Banners Live'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {localBanners.map((slide, sIndex) => (
                  <BannerSlideEditor
                    key={slide.id || `slide-${sIndex}`}
                    slide={slide}
                    index={sIndex}
                    totalSlides={localBanners.length}
                    canMoveUp={sIndex > 0}
                    canMoveDown={sIndex < localBanners.length - 1}
                    onMoveUp={() => handleMoveSlide(sIndex, 'up')}
                    onMoveDown={() => handleMoveSlide(sIndex, 'down')}
                    onDelete={() => handleDeleteSlide(sIndex)}
                    onSaveThisSlide={() => handleSaveSingleSlide(sIndex)}
                    onChange={(updatedSlide) => {
                      const copy = [...localBanners];
                      copy[sIndex] = updatedSlide;
                      setLocalBanners(copy);
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center justify-center pt-2">
                <button
                  type="button"
                  onClick={handleAddNewSlide}
                  className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-palm-300 bg-white/80 px-6 py-3 text-xs font-bold text-palm-800 hover:border-palm-500 hover:bg-palm-50 shadow-soft transition cursor-pointer"
                >
                  <Plus size={16} className="text-coral-500" />
                  <span>Add Another Banner Slide</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: WEBSITE SETTINGS                                   */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
              <div>
                <h1 className="font-display text-3xl font-extrabold tracking-tight text-palm-900">
                  Website Settings
                </h1>
                <p className="mt-1 text-xs text-palm-600 font-medium">
                  General store contact details, free delivery threshold, and physical location.
                </p>
              </div>

              <div className="rounded-3xl border border-palm-200/80 bg-white p-6 shadow-card space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-palm-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Store size={18} className="text-palm-700" />
                    <div>
                      <h3 className="font-display text-base font-extrabold text-palm-900">
                        Store Information
                      </h3>
                      <p className="text-xs text-palm-500">Contact hotlines, pickup address, and shipping thresholds</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveStoreSettings}
                    className="btn-primary py-2 px-5 text-xs font-bold shadow-soft self-start sm:self-auto flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save size={14} />
                    <span>Save Settings</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-palm-700 block mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="checkout-input py-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-palm-700 block mb-1">WhatsApp & Phone Hotline</label>
                    <input
                      type="text"
                      value={storePhone}
                      onChange={(e) => setStorePhone(e.target.value)}
                      className="checkout-input py-2.5 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-palm-700 block mb-1">Customer Support Email</label>
                    <input
                      type="text"
                      value={storeEmail}
                      onChange={(e) => setStoreEmail(e.target.value)}
                      className="checkout-input py-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-palm-700 block mb-1">Free Delivery Threshold (Rs.)</label>
                    <input
                      type="number"
                      value={freeShippingThreshold}
                      onChange={(e) => setFreeShippingThreshold(e.target.value)}
                      className="checkout-input py-2.5 text-xs font-bold"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-bold text-palm-700 block mb-1">Store Pickup Flagship Address</label>
                    <input
                      type="text"
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                      className="checkout-input py-2.5 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: RESET FACTORY DATA */}
              <div className="rounded-3xl border border-palm-200/80 bg-white p-6 shadow-card space-y-3">
                <div className="flex items-center gap-2 text-coral-600">
                  <AlertCircle size={18} />
                  <h3 className="font-display text-base font-extrabold">Factory Reset Catalog Data</h3>
                </div>
                <p className="text-xs text-palm-600">
                  Restore all products, categories, sizes, benefits, and FAQs to default fresh coconut catalog.
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    await fetch('/api/reset', { method: 'POST' });
                    onRefresh();
                    showToast('Store reset to factory default data');
                  }}
                  className="rounded-full border border-coral-200 bg-coral-50 px-5 py-2.5 text-xs font-bold text-coral-700 hover:bg-coral-100 transition active:scale-95 cursor-pointer"
                >
                  Reset All to Factory Defaults
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* --- IN-APP PRODUCT DELETE CONFIRMATION MODAL --- */}
      {deletingProduct && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-palm-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lift border border-palm-200 space-y-4">
            <div className="flex items-center gap-3 text-coral-600">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coral-100 text-coral-600">
                <Trash2 size={20} />
              </span>
              <div>
                <h3 className="font-display text-base font-extrabold text-palm-900">
                  Delete Product?
                </h3>
                <p className="text-xs text-palm-500">This action cannot be undone.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-cream-50 p-3 border border-palm-100">
              <img
                src={deletingProduct.image}
                alt={deletingProduct.name}
                className="h-12 w-12 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-extrabold text-xs text-palm-900 truncate">{deletingProduct.name}</h4>
                <p className="text-[11px] text-palm-500">{rs(deletingProduct.price)} · {deletingProduct.categoryId}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="btn-ghost py-2.5 px-5 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const name = deletingProduct.name;
                  await onDeleteProduct(deletingProduct.id);
                  setDeletingProduct(null);
                  showToast(`Product "${name}" deleted successfully!`);
                }}
                className="rounded-full bg-coral-600 hover:bg-coral-700 text-white px-6 py-2.5 text-xs font-bold shadow-soft transition active:scale-95 cursor-pointer"
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- IN-APP CATEGORY DELETE CONFIRMATION MODAL --- */}
      {deletingCategory && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-palm-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lift border border-palm-200 space-y-4">
            <div className="flex items-center gap-3 text-coral-600">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coral-100 text-coral-600">
                <Trash2 size={20} />
              </span>
              <div>
                <h3 className="font-display text-base font-extrabold text-palm-900">
                  Delete Category?
                </h3>
                <p className="text-xs text-palm-500">Remove &quot;{deletingCategory.name}&quot; from store.</p>
              </div>
            </div>

            {products.filter((p) => p.categoryId === deletingCategory.id).length > 0 && (
              <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-600 shrink-0" />
                <span>
                  Notice: {products.filter((p) => p.categoryId === deletingCategory.id).length} products are currently linked to this category.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="btn-ghost py-2.5 px-5 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const name = deletingCategory.name;
                  await onDeleteCategory(deletingCategory.id);
                  setDeletingCategory(null);
                  showToast(`Category "${name}" deleted!`);
                }}
                className="rounded-full bg-coral-600 hover:bg-coral-700 text-white px-6 py-2.5 text-xs font-bold shadow-soft transition active:scale-95 cursor-pointer"
              >
                Yes, Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- IN-APP ORDER DELETE CONFIRMATION MODAL --- */}
      {deletingOrder && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-palm-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lift border border-palm-200 space-y-4">
            <div className="flex items-center gap-3 text-coral-600">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coral-100 text-coral-600">
                <Trash2 size={20} />
              </span>
              <div>
                <h3 className="font-display text-base font-extrabold text-palm-900">
                  Delete Customer Order?
                </h3>
                <p className="text-xs text-palm-500">Order Ref: {deletingOrder.ref}</p>
              </div>
            </div>

            <p className="text-xs text-palm-600">
              Are you sure you want to delete order <strong>{deletingOrder.ref}</strong> placed by <strong>{deletingOrder.phone}</strong>?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingOrder(null)}
                className="btn-ghost py-2.5 px-5 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const ref = deletingOrder.ref;
                  await onDeleteOrder(ref);
                  setDeletingOrder(null);
                  showToast(`Order ${ref} deleted successfully!`);
                }}
                className="rounded-full bg-coral-600 hover:bg-coral-700 text-white px-6 py-2.5 text-xs font-bold shadow-soft transition active:scale-95 cursor-pointer"
              >
                Yes, Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT / CREATE PRODUCT MODAL --- */}
      {(editingProduct || isCreatingProduct) && (
        <ProductEditorModal
          key={editingProduct ? `product-edit-${editingProduct.id}` : 'product-create-new'}
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setEditingProduct(null);
            setIsCreatingProduct(false);
          }}
          onSave={async (savedData) => {
            if (editingProduct) {
              await onEditProduct(editingProduct.id, savedData);
              showToast(`Product "${savedData.name}" updated successfully!`);
            } else {
              await onAddProduct(savedData);
              showToast(`New product "${savedData.name}" added!`);
            }
            setEditingProduct(null);
            setIsCreatingProduct(false);
          }}
        />
      )}

      {/* --- EDIT / CREATE CATEGORY MODAL --- */}
      {(editingCategory || isCreatingCategory) && (
        <CategoryEditorModal
          key={editingCategory ? `cat-edit-${editingCategory.id}` : 'cat-create-new'}
          category={editingCategory}
          onClose={() => {
            setEditingCategory(null);
            setIsCreatingCategory(false);
          }}
          onSave={async (catData) => {
            if (editingCategory) {
              await onEditCategory(editingCategory.id, catData);
              showToast(`Category "${catData.name}" updated!`);
            } else {
              await onAddCategory(catData);
              showToast(`Category "${catData.name}" created!`);
            }
            setEditingCategory(null);
            setIsCreatingCategory(false);
          }}
        />
      )}

      {/* --- EDIT ORDER MODAL --- */}
      {editingOrder && (
        <OrderEditorModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={async (updates) => {
            await onEditOrder(editingOrder.ref, updates);
            setEditingOrder(null);
            showToast(`Order ${editingOrder.ref} updated successfully!`);
          }}
        />
      )}

      {/* --- PRINT / SAVE PDF SLIP MODAL --- */}
      <OrderReceiptModal
        order={viewingSlipOrder}
        open={!!viewingSlipOrder}
        onClose={() => setViewingSlipOrder(null)}
      />

      {/* --- IN-APP CUSTOMER DELETE CONFIRMATION MODAL --- */}
      {deletingCustomer && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-palm-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-lift border border-palm-200 space-y-4">
            <div className="flex items-center gap-3 text-coral-600">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coral-100 text-coral-600">
                <Trash2 size={20} />
              </span>
              <div>
                <h3 className="font-display text-base font-extrabold text-palm-900">
                  Delete Customer Account?
                </h3>
                <p className="text-xs text-palm-500">{deletingCustomer.name} ({deletingCustomer.email})</p>
              </div>
            </div>

            <p className="text-xs text-palm-600 leading-relaxed">
              Are you sure you want to permanently delete customer account <strong>{deletingCustomer.name}</strong> ({deletingCustomer.phone})? This will revoke their account access.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCustomer(null)}
                className="btn-ghost py-2.5 px-5 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const name = deletingCustomer.name;
                  await onDeleteCustomer(deletingCustomer.id);
                  setDeletingCustomer(null);
                  showToast(`Customer "${name}" removed successfully!`);
                }}
                className="rounded-full bg-coral-600 hover:bg-coral-700 text-white px-6 py-2.5 text-xs font-bold shadow-soft transition active:scale-95 cursor-pointer"
              >
                Yes, Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT / CREATE CUSTOMER MODAL --- */}
      {(editingCustomer || isCreatingCustomer) && (
        <CustomerEditorModal
          key={editingCustomer ? `customer-edit-${editingCustomer.id}` : 'customer-create-new'}
          customer={editingCustomer}
          onClose={() => {
            setEditingCustomer(null);
            setIsCreatingCustomer(false);
          }}
          onSave={async (savedData) => {
            if (editingCustomer) {
              await onEditCustomer(editingCustomer.id, savedData);
              showToast(`Customer "${savedData.name}" updated successfully!`);
            } else {
              await onAddCustomer(savedData);
              showToast(`New customer "${savedData.name}" created!`);
            }
            setEditingCustomer(null);
            setIsCreatingCustomer(false);
          }}
        />
      )}

      {/* --- CUSTOMER ORDERS PREVIEW MODAL --- */}
      {viewingCustomerOrders && (
        <CustomerOrdersModal
          customer={viewingCustomerOrders}
          orders={orders.filter((o) => {
            if (o.customerId && o.customerId === viewingCustomerOrders.id) return true;
            if (o.customerEmail && viewingCustomerOrders.email && o.customerEmail.toLowerCase() === viewingCustomerOrders.email.toLowerCase()) return true;
            const cleanCustPhone = (viewingCustomerOrders.phone || '').replace(/\D/g, '');
            const cleanOrderPhone = (o.phone || '').replace(/\D/g, '');
            if (cleanCustPhone.length >= 7 && cleanOrderPhone.length >= 7) {
              if (cleanOrderPhone.endsWith(cleanCustPhone.slice(-7)) || cleanCustPhone.endsWith(cleanOrderPhone.slice(-7))) {
                return true;
              }
            }
            return false;
          })}
          onClose={() => setViewingCustomerOrders(null)}
          onViewSlip={(o) => {
            setViewingCustomerOrders(null);
            setViewingSlipOrder(o);
          }}
        />
      )}
    </div>
  );
}

// Banner Slide Editor Component
function BannerSlideEditor({
  slide,
  index,
  totalSlides,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDelete,
  onSaveThisSlide,
  onChange,
}: {
  slide: HeroSlide;
  index: number;
  totalSlides: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onSaveThisSlide: () => void;
  onChange: (s: HeroSlide) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDeviceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange({ ...slide, image: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="rounded-3xl border border-palm-200/80 bg-white p-6 shadow-card space-y-4 hover:border-palm-300 transition">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-palm-100 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="chip bg-palm-800 text-cream-50 font-bold text-xs px-2.5 py-1">
            Slide #{index + 1} of {totalSlides}
          </span>
          <span className="font-display text-sm sm:text-base font-extrabold text-palm-900 truncate max-w-[12rem] sm:max-w-xs">
            {slide.title || 'Untitled Banner'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-palm-50 border border-palm-200 p-0.5">
            <button
              type="button"
              disabled={!canMoveUp}
              onClick={onMoveUp}
              title="Move Slide Up"
              className="p-1 text-palm-700 hover:text-palm-900 disabled:opacity-30 disabled:hover:text-palm-700 cursor-pointer"
            >
              <ArrowUp size={15} />
            </button>
            <button
              type="button"
              disabled={!canMoveDown}
              onClick={onMoveDown}
              title="Move Slide Down"
              className="p-1 text-palm-700 hover:text-palm-900 disabled:opacity-30 disabled:hover:text-palm-700 cursor-pointer"
            >
              <ArrowDown size={15} />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs font-bold text-palm-600 hidden sm:inline">Color Tone:</label>
            <select
              value={slide.tone}
              onChange={(e) => onChange({ ...slide, tone: e.target.value as HeroSlide['tone'] })}
              className="rounded-xl border border-palm-200 bg-cream-50 px-2.5 py-1 text-xs font-bold text-palm-900 cursor-pointer"
            >
              <option value="palm">Palm Green</option>
              <option value="cream">Cream Natural</option>
              <option value="coral">Coral Vibrant</option>
            </select>
          </div>

          <button
            type="button"
            onClick={onDelete}
            title="Delete this banner slide"
            className="flex h-7 w-7 items-center justify-center rounded-xl border border-coral-200 bg-coral-50/70 text-coral-600 hover:bg-coral-100 transition active:scale-95 cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <label className="text-xs font-extrabold uppercase tracking-wider text-palm-600 block">
            Banner Picture & Preview
          </label>

          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-palm-100 border border-palm-200 shadow-soft">
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = PRESET_IMAGES[0].url;
              }}
            />
            <span className="absolute bottom-2 left-2 chip bg-black/70 text-white text-[10px] backdrop-blur font-bold">
              Current Live Photo
            </span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleDeviceUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-palm-200 bg-palm-50/80 py-2.5 text-xs font-extrabold text-palm-900 hover:bg-palm-100 hover:border-palm-300 transition shadow-soft cursor-pointer"
          >
            <Upload size={14} className="text-coral-500" />
            <span>Upload Picture from Computer / Mobile</span>
          </button>

          <div>
            <span className="text-[10px] font-bold text-palm-500 block mb-1">Or Paste Image URL:</span>
            <input
              type="url"
              value={slide.image}
              onChange={(e) => onChange({ ...slide, image: e.target.value })}
              className="checkout-input py-2 text-xs"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="space-y-3 md:col-span-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-palm-700 block mb-1">Badge / Eyebrow</label>
              <input
                type="text"
                value={slide.eyebrow}
                onChange={(e) => onChange({ ...slide, eyebrow: e.target.value })}
                placeholder="e.g. Bundle Deal, Fresh Squeeze"
                className="checkout-input py-2 text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-palm-700 block mb-1">Price Tag Text</label>
              <input
                type="text"
                value={slide.price}
                onChange={(e) => onChange({ ...slide, price: e.target.value })}
                placeholder="e.g. From Rs. 1,200"
                className="checkout-input py-2 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-palm-700 block mb-1">Headline Title</label>
            <input
              type="text"
              value={slide.title}
              onChange={(e) => onChange({ ...slide, title: e.target.value })}
              placeholder="e.g. Coconut Water 6-Pack"
              className="checkout-input py-2 text-xs font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-palm-700 block mb-1">Subtitle Text</label>
            <input
              type="text"
              value={slide.subtitle}
              onChange={(e) => onChange({ ...slide, subtitle: e.target.value })}
              placeholder="e.g. Six chilled bottles of pure coconut water delivered across Pakistan."
              className="checkout-input py-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-palm-700 block mb-1">CTA Button Text</label>
              <input
                type="text"
                value={slide.cta}
                onChange={(e) => onChange({ ...slide, cta: e.target.value })}
                placeholder="e.g. Order Bundle Now"
                className="checkout-input py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-palm-700 block mb-1">Image Alignment</label>
              <select
                value={slide.align || 'right'}
                onChange={(e) => onChange({ ...slide, align: e.target.value as HeroSlide['align'] })}
                className="checkout-input py-2 text-xs cursor-pointer"
              >
                <option value="right">Right Side</option>
                <option value="left">Left Side</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="button"
              onClick={onSaveThisSlide}
              className="btn-primary py-2 px-5 text-xs font-bold shadow-soft flex items-center gap-1.5 cursor-pointer"
            >
              <Save size={13} />
              <span>Save This Slide Live</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sidebar Item
function SidebarItem({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group flex w-full items-center justify-between rounded-2xl px-4 py-2.5 text-xs font-bold transition-all duration-200 cursor-pointer',
        active
          ? 'bg-palm-800 text-cream-50 shadow-soft font-extrabold'
          : 'text-palm-700 hover:bg-palm-100/70 hover:text-palm-950'
      )}
    >
      <span className="flex items-center gap-3">
        <span className={cn('transition-colors', active ? 'text-cream-300' : 'text-palm-500 group-hover:text-palm-800')}>
          {icon}
        </span>
        <span className="font-display">{label}</span>
      </span>
      {badge && (
        <span
          className={cn(
            'chip text-[10px] font-bold py-0.5 px-2',
            active ? 'bg-palm-700 text-cream-100' : 'bg-palm-100 text-palm-700'
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

// Metric Card
function NaturaMetricCard({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div className="relative rounded-3xl border border-palm-200/80 bg-white p-5 shadow-card hover:shadow-lift transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-palm-500">{label}</span>
        {badge && (
          <span className="chip bg-palm-50 text-palm-700 text-[10px] py-0.5 font-bold border border-palm-200">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-2.5 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-palm-900">
        {value}
      </div>
    </div>
  );
}

// Action Card
function NaturaActionCard({
  title,
  highlight,
  actionText,
  onClick,
}: {
  title: string;
  highlight: string;
  actionText: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-3xl border border-palm-200/80 bg-white p-5 shadow-card hover:border-coral-400 hover:shadow-lift transition-all duration-300"
    >
      <span className="text-xs font-bold uppercase tracking-wider text-palm-500">{title}</span>
      <div className="mt-2 font-display text-2xl font-extrabold text-coral-600">
        {highlight}
      </div>
      <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-palm-800 group-hover:text-coral-600 transition">
        <span>{actionText}</span>
      </div>
    </div>
  );
}

// Full Product Specs Editor Modal
function ProductEditorModal({
  product,
  categories,
  onClose,
  onSave,
}: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (p: Partial<Product>) => Promise<Product | unknown>;
}) {
  const isEdit = !!product;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(product?.name || '');
  const [categoryId, setCategoryId] = useState(product?.categoryId || categories[0]?.id || 'fresh-coconuts');
  const [price, setPrice] = useState(product?.price !== undefined ? product.price.toString() : '');
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice ? product.originalPrice.toString() : '');
  const [unit, setUnit] = useState(product?.unit || '');
  const [badge, setBadge] = useState(product?.badge || '');
  const [image, setImage] = useState(product?.image || '');
  const [size, setSize] = useState(product?.size || '');
  const [description, setDescription] = useState(product?.description || '');
  const [howToUse, setHowToUse] = useState(product?.howToUse || '');
  const [cityVisibility, setCityVisibility] = useState<CityVisibility>(product?.cityVisibility || 'nationwide');
  const [allowedCityIds, setAllowedCityIds] = useState<CityId[]>(product?.allowedCityIds || ['karachi']);
  const [inStock, setInStock] = useState(product?.inStock !== false);

  const [benefits, setBenefits] = useState<string[]>(product?.benefits ? product.benefits : []);
  const [newBenefitText, setNewBenefitText] = useState('');

  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>(
    product?.faqs ? product.faqs : []
  );

  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleDeviceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
          setFormError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBenefit = () => {
    if (!newBenefitText.trim()) return;
    setBenefits([...benefits, newBenefitText.trim()]);
    setNewBenefitText('');
  };

  const handleRemoveBenefit = (idx: number) => {
    setBenefits(benefits.filter((_, i) => i !== idx));
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!name.trim()) {
      setFormError('Please enter product name');
      return;
    }
    if (!price.trim()) {
      setFormError('Please enter product price (Rs.)');
      return;
    }
    if (!image.trim()) {
      setFormError('Please upload a product picture from your computer/phone or enter an image URL');
      return;
    }

    setSaving(true);
    await onSave({
      name: name.trim(),
      categoryId: categoryId as Product['categoryId'],
      price: parseFloat(price) || 0,
      originalPrice: originalPrice.trim() ? parseFloat(originalPrice) : undefined,
      unit: unit.trim() || undefined,
      badge: badge.trim() || undefined,
      image: image.trim(),
      size: size.trim() || undefined,
      description: description.trim(),
      howToUse: howToUse.trim() || undefined,
      benefits: benefits.filter((b) => b.trim().length > 0),
      faqs: faqs.filter((f) => f.question.trim().length > 0 && f.answer.trim().length > 0),
      cityVisibility,
      allowedCityIds: cityVisibility === 'custom' ? allowedCityIds : undefined,
      inStock,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-palm-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative flex flex-col h-full max-h-[92vh] w-full max-w-4xl bg-cream-50 rounded-4xl shadow-lift overflow-hidden border border-palm-200">
        <div className="flex items-center justify-between border-b border-palm-200 px-6 py-4 bg-white">
          <div>
            <h2 className="font-display text-lg font-extrabold text-palm-900">
              {isEdit ? `Edit Product: ${product?.name}` : 'Add New Product'}
            </h2>
            <p className="text-xs text-palm-500">
              Set category, city visibility, picture, size specs, description, benefits, and FAQs
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-palm-100 text-palm-700 hover:bg-palm-200 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {formError && (
            <div className="rounded-2xl bg-coral-50 border border-coral-200 p-3 text-xs font-bold text-coral-700 animate-fadeIn flex items-center gap-2">
              <AlertCircle size={16} className="text-coral-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="rounded-3xl border border-palm-200 bg-white p-5 space-y-4 shadow-soft">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-palm-500">
              1. Basic Information & Pricing
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-palm-700 block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tender Young Coconuts"
                  className="checkout-input py-2.5 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-palm-700 block mb-1">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="checkout-input py-2.5 text-xs font-bold cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.nationwide ? 'Nationwide' : 'Karachi'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-palm-700 block mb-1">Price (Rs.) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="checkout-input py-2.5 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-palm-700 block mb-1">Original Price (Rs.) (for discount tag)</label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="e.g. 1500"
                  className="checkout-input py-2.5 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-palm-700 block mb-1">Unit / Packaging</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. pack of 6 or 500ml bottle"
                  className="checkout-input py-2.5 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-palm-700 block mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. Nationwide, Bestseller"
                  className="checkout-input py-2.5 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-palm-200 bg-white p-5 space-y-4 shadow-soft">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-palm-500">
                2. City Visibility & Availability
              </h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="h-4 w-4 rounded text-palm-600 focus:ring-palm-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-palm-800">In Stock</span>
              </label>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-palm-700 block">Target Delivery Area:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setCityVisibility('nationwide')}
                  className={cn(
                    'flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition cursor-pointer',
                    cityVisibility === 'nationwide'
                      ? 'border-coral-500 bg-coral-50 text-coral-700 font-bold shadow-soft'
                      : 'border-palm-200 bg-white text-palm-700 hover:border-palm-300'
                  )}
                >
                  <MapPin size={18} className="text-coral-500 mb-1" />
                  <span className="text-xs font-extrabold">Nationwide</span>
                  <span className="text-[10px] text-palm-500">All Pakistan Cities</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCityVisibility('karachi_only')}
                  className={cn(
                    'flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition cursor-pointer',
                    cityVisibility === 'karachi_only'
                      ? 'border-palm-600 bg-palm-50 text-palm-800 font-bold shadow-soft'
                      : 'border-palm-200 bg-white text-palm-700 hover:border-palm-300'
                  )}
                >
                  <MapPin size={18} className="text-palm-600 mb-1" />
                  <span className="text-xs font-extrabold">Karachi Only</span>
                  <span className="text-[10px] text-palm-500">Express / Pickup</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCityVisibility('custom')}
                  className={cn(
                    'flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition cursor-pointer',
                    cityVisibility === 'custom'
                      ? 'border-palm-800 bg-palm-100 text-palm-900 font-bold shadow-soft'
                      : 'border-palm-200 bg-white text-palm-700 hover:border-palm-300'
                  )}
                >
                  <Sliders size={18} className="text-palm-700 mb-1" />
                  <span className="text-xs font-extrabold">Custom Selected</span>
                  <span className="text-[10px] text-palm-500">Pick specific cities</span>
                </button>
              </div>

              {cityVisibility === 'custom' && (
                <div className="mt-3 p-3.5 rounded-2xl bg-cream-50 border border-palm-200">
                  <span className="text-xs font-bold text-palm-800 block mb-2">Select Allowed Cities:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CITIES.map((c) => {
                      const selected = allowedCityIds.includes(c.id);
                      return (
                        <label key={c.id} className="flex items-center gap-1.5 text-xs text-palm-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAllowedCityIds([...allowedCityIds, c.id]);
                              } else {
                                setAllowedCityIds(allowedCityIds.filter((id) => id !== c.id));
                              }
                            }}
                            className="rounded text-palm-600 cursor-pointer"
                          />
                          <span>{c.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-palm-200 bg-white p-5 space-y-4 shadow-soft">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-palm-500">
              3. Picture & Size Specification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-3">
                <label className="text-xs font-bold text-palm-700 block">
                  Product Picture (Live Preview & Upload)
                </label>

                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-palm-100 border-2 border-dashed border-palm-300 shadow-soft flex items-center justify-center">
                  {image ? (
                    <img
                      src={image}
                      alt="Product preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 p-4 text-center text-palm-400">
                      <ImageIcon size={32} className="text-palm-300" />
                      <span className="text-xs font-bold text-palm-700">No picture selected yet</span>
                      <span className="text-[11px] text-palm-500">Upload from computer/phone or enter image URL below</span>
                    </div>
                  )}
                  {image && (
                    <span className="absolute top-2 left-2 chip bg-palm-900/80 text-cream-50 text-[10px] backdrop-blur font-bold">
                      {isEdit ? 'Current Photo' : 'Selected Photo'}
                    </span>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleDeviceImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border border-palm-200 bg-palm-50/80 py-2.5 text-xs font-extrabold text-palm-900 hover:bg-palm-100 hover:border-palm-300 transition shadow-soft cursor-pointer"
                >
                  <Upload size={15} className="text-coral-500" />
                  <span>Upload Picture from Computer / Phone</span>
                </button>

                <div>
                  <span className="text-[10px] font-bold text-palm-500 block mb-1">Or Paste Image URL:</span>
                  <input
                    type="text"
                    value={image.startsWith('data:') ? '' : image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder={image.startsWith('data:') ? 'Image uploaded from device (ready)' : 'https://...'}
                    className="checkout-input py-2 text-xs"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-palm-400 font-bold block mb-1.5">Preset Coconut Photos (Click to Select):</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {PRESET_IMAGES.slice(0, 4).map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setImage(preset.url)}
                        className={cn(
                          'relative aspect-square rounded-xl overflow-hidden border-2 transition cursor-pointer',
                          image === preset.url ? 'border-coral-500 ring-2 ring-coral-300' : 'border-palm-200 opacity-70 hover:opacity-100'
                        )}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-palm-700 block mb-1">Size / Volume Details *</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. Pack of 6 (Approx 2L Water) or 500ml Bottle"
                    className="checkout-input py-2.5 text-xs"
                  />
                  <p className="mt-1 text-[11px] text-palm-500">
                    Displayed prominently on the product card and modal (e.g. 500ml, 1 Litre, Pack of 6).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-palm-200 bg-white p-5 space-y-4 shadow-soft">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-palm-500">
              4. Description & How to Use
            </h3>
            <div>
              <label className="text-xs font-bold text-palm-700 block mb-1">Full Description *</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write rich details about coconut sourcing, sweetness, taste, and freshness..."
                className="checkout-input py-2.5 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-palm-700 block mb-1">How to Use / Serving Instructions</label>
              <textarea
                rows={2}
                value={howToUse}
                onChange={(e) => setHowToUse(e.target.value)}
                placeholder="e.g. Chill in fridge for 2 hours, cut top crown with knife, drink chilled..."
                className="checkout-input py-2.5 text-xs"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-palm-200 bg-white p-5 space-y-3 shadow-soft">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-coral-500" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-palm-500">
                5. Product Benefits ({benefits.length})
              </h3>
            </div>
            {benefits.length === 0 ? (
              <p className="text-xs text-palm-400 italic py-1">No benefits added yet. Type below and press Enter or click &quot;Add Benefit&quot;.</p>
            ) : (
              <div className="space-y-2">
                {benefits.map((b, bIdx) => (
                  <div key={bIdx} className="flex items-center gap-2 rounded-2xl bg-cream-50 p-2.5 text-xs border border-palm-100">
                    <CheckCircle2 size={16} className="text-palm-600 shrink-0" />
                    <input
                      type="text"
                      value={b}
                      onChange={(e) => {
                        const updated = [...benefits];
                        updated[bIdx] = e.target.value;
                        setBenefits(updated);
                      }}
                      className="flex-1 bg-transparent text-xs font-medium text-palm-900 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(bIdx)}
                      className="text-palm-400 hover:text-coral-600 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add another key health benefit..."
                value={newBenefitText}
                onChange={(e) => setNewBenefitText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddBenefit();
                  }
                }}
                className="checkout-input py-2 text-xs flex-1"
              />
              <button
                type="button"
                onClick={handleAddBenefit}
                className="btn-ghost py-2 text-xs cursor-pointer"
              >
                <Plus size={14} /> Add Benefit
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-palm-200 bg-white p-5 space-y-4 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-palm-500">
                  6. Unique FAQs ({faqs.length} configured)
                </h3>
                <p className="text-[11px] text-palm-400">Each product can have its own custom FAQs</p>
              </div>
              <button
                type="button"
                onClick={handleAddFaq}
                className="btn-ghost py-1.5 px-3 text-xs cursor-pointer"
              >
                <Plus size={14} /> Add FAQ
              </button>
            </div>

            {faqs.length === 0 ? (
              <p className="text-xs text-palm-400 italic py-1">No FAQs added yet. Click &quot;Add FAQ&quot; above.</p>
            ) : (
              <div className="space-y-3">
                {faqs.map((faq, fIdx) => (
                  <div key={fIdx} className="rounded-2xl border border-palm-100 bg-cream-50/70 p-3.5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-extrabold text-palm-800">FAQ #{fIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaq(fIdx)}
                        className="text-palm-400 hover:text-coral-600 text-xs font-semibold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleUpdateFaq(fIdx, 'question', e.target.value)}
                      placeholder="Question?"
                      className="checkout-input py-2 text-xs font-bold"
                    />
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => handleUpdateFaq(fIdx, 'answer', e.target.value)}
                      placeholder="Detailed answer..."
                      className="checkout-input py-2 text-xs"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="btn-ghost py-3 px-6 text-xs cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary py-3 px-8 text-xs font-bold shadow-soft cursor-pointer">
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Category Editor Modal (Create & Edit)
function CategoryEditorModal({
  category,
  onClose,
  onSave,
}: {
  category: Category | null;
  onClose: () => void;
  onSave: (c: Category) => Promise<void>;
}) {
  const isEdit = !!category;
  const [name, setName] = useState(category?.name || '');
  const [tagline, setTagline] = useState(category?.tagline || '');
  const [nationwide, setNationwide] = useState(category?.nationwide ?? true);
  const [emoji, setEmoji] = useState(category?.emoji || 'coconut');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide category name');
      return;
    }
    setSaving(true);
    const id = category?.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await onSave({
      id: id || 'cat-' + Date.now(),
      name: name.trim(),
      tagline: tagline.trim() || 'Fresh and 100% natural',
      nationwide,
      emoji: emoji || 'coconut',
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-palm-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-lift border border-palm-200 space-y-5">
        <div className="flex items-center justify-between border-b border-palm-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-palm-600 text-white">
              <FolderTree size={18} />
            </span>
            <h3 className="font-display text-base font-extrabold text-palm-900">
              {isEdit ? `Edit Category: ${category?.name}` : 'Add New Category'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-palm-100 text-palm-700 hover:bg-palm-200 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="rounded-2xl bg-coral-50 border border-coral-200 p-3 text-xs font-bold text-coral-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-palm-700 block mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Organic Coconut Snacks"
              className="checkout-input py-2.5 text-xs font-bold"
            />
          </div>

          <div>
            <label className="font-bold text-palm-700 block mb-1">Tagline / Brief Subtitle</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Sourced pure, delivered fresh across Pakistan"
              className="checkout-input py-2.5 text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-palm-700 block mb-1">Delivery Scope</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNationwide(true)}
                className={cn(
                  'p-3 rounded-2xl border text-center transition cursor-pointer',
                  nationwide
                    ? 'border-coral-500 bg-coral-50 text-coral-700 font-bold'
                    : 'border-palm-200 bg-white text-palm-700'
                )}
              >
                <div className="font-extrabold">Nationwide</div>
                <div className="text-[10px] text-palm-500">Shippable to all cities</div>
              </button>

              <button
                type="button"
                onClick={() => setNationwide(false)}
                className={cn(
                  'p-3 rounded-2xl border text-center transition cursor-pointer',
                  !nationwide
                    ? 'border-palm-600 bg-palm-50 text-palm-800 font-bold'
                    : 'border-palm-200 bg-white text-palm-700'
                )}
              >
                <div className="font-extrabold">Karachi Only</div>
                <div className="text-[10px] text-palm-500">Chilled express delivery</div>
              </button>
            </div>
          </div>

          <div>
            <label className="font-bold text-palm-700 block mb-1">Category Icon Theme</label>
            <select
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="checkout-input py-2 text-xs font-bold cursor-pointer"
            >
              <option value="coconut">Coconut (Default)</option>
              <option value="bottle">Bottle (Coconut Water)</option>
              <option value="juice">Juice (Cold-pressed)</option>
              <option value="bundle">Bundle & Packs</option>
              <option value="extra">Extras / Treats</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-palm-100">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost py-2.5 px-5 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-2.5 px-6 text-xs font-bold shadow-soft cursor-pointer"
            >
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Order Editor Modal (Edit stage, phone, address, notes, payment)
function OrderEditorModal({
  order,
  onClose,
  onSave,
}: {
  order: OrderDetails;
  onClose: () => void;
  onSave: (updates: Partial<OrderDetails>) => Promise<void>;
}) {
  const [stage, setStage] = useState<OrderStage>(order.stage || 'placed');
  const [phone, setPhone] = useState(order.phone || '');
  const [address, setAddress] = useState(order.address || '');
  const [paymentMethod, setPaymentMethod] = useState(order.paymentMethod || 'Cash on Delivery (COD)');
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus || 'Pending on Delivery');
  const [notes, setNotes] = useState(order.notes || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      stage,
      phone: phone.trim(),
      address: address.trim(),
      paymentMethod,
      paymentStatus,
      notes: notes.trim(),
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-palm-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-lift border border-palm-200 space-y-5">
        <div className="flex items-center justify-between border-b border-palm-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-palm-600 text-white">
              <ShoppingBag size={18} />
            </span>
            <div>
              <h3 className="font-display text-base font-extrabold text-palm-900">
                Edit Order: {order.ref}
              </h3>
              <p className="text-[11px] text-palm-500">Placed on {order.placedAt}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-palm-100 text-palm-700 hover:bg-palm-200 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-palm-700 block mb-1">Order Fulfillment Stage *</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value as OrderStage)}
              className="checkout-input py-2.5 text-xs font-bold cursor-pointer"
            >
              <option value="placed">1. Placed (Order Confirmed)</option>
              <option value="prep">2. In Preparation (Kitchen Scrapes Malai & Bottles)</option>
              <option value="transit">3. In Transit / Ready for Store Pickup</option>
              <option value="delivered">4. Delivered / Collected by Customer</option>
            </select>
            <p className="mt-1 text-[11px] text-palm-500">
              Live updates to customer confirmation screen in real time.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-palm-700 block mb-1">Customer Mobile</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="checkout-input py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-palm-700 block mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="checkout-input py-2 text-xs font-bold cursor-pointer"
              >
                <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                <option value="JazzCash / EasyPaisa">JazzCash / EasyPaisa</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-palm-700 block mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="checkout-input py-2 text-xs font-bold cursor-pointer"
              >
                <option value="Pending on Delivery">Pending on Delivery (COD)</option>
                <option value="Paid in Cash">Paid in Cash</option>
                <option value="Bank / JazzCash Transferred">Bank / JazzCash Transferred</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-palm-700 block mb-1">Delivery Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="checkout-input py-2 text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-palm-700 block mb-1">Admin / Fulfillment Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Customer requested extra cold bottles or morning dispatch..."
              className="checkout-input py-2 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-palm-100">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost py-2.5 px-5 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-2.5 px-6 text-xs font-bold shadow-soft cursor-pointer"
            >
              {saving ? 'Updating...' : 'Save Order Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =========================================================================
// CUSTOMER EDITOR MODAL (ADD & EDIT CUSTOMER PROFILES)
// =========================================================================
function CustomerEditorModal({
  customer,
  onClose,
  onSave,
}: {
  customer: Customer | null;
  onClose: () => void;
  onSave: (data: Partial<Customer>) => Promise<void>;
}) {
  const isEditing = !!customer;
  const [name, setName] = useState(customer?.name || '');
  const [email, setEmail] = useState(customer?.email || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [password, setPassword] = useState(customer?.password || (isEditing ? '' : '123456'));
  const [showPassword, setShowPassword] = useState(false);
  const [city, setCity] = useState(customer?.city || 'Karachi');
  const [address, setAddress] = useState(customer?.address || '');
  const [status, setStatus] = useState<'active' | 'blocked'>(customer?.status || 'active');
  const [notes, setNotes] = useState(customer?.notes || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide customer full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setError('Please provide a phone / mobile number.');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password: password.trim() || (isEditing ? (customer?.password || '123456') : '123456'),
        city: city.trim(),
        address: address.trim(),
        status,
        notes: notes.trim(),
        registeredAt: customer?.registeredAt || new Date().toISOString().split('T')[0],
        totalOrders: customer?.totalOrders || 0,
        totalSpent: customer?.totalSpent || 0,
      });
    } catch {
      setError('An error occurred while saving customer profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-palm-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-lift border border-palm-200 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between border-b border-palm-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-palm-100 text-palm-700">
              {isEditing ? <Edit2 size={18} /> : <UserPlus size={18} />}
            </span>
            <div>
              <h3 className="font-display text-base font-extrabold text-palm-900">
                {isEditing ? 'Edit Customer Profile' : 'Add New Customer'}
              </h3>
              <p className="text-[11px] text-palm-500">
                {isEditing
                  ? `Update info and credentials for ${customer.name}`
                  : 'Register a new store customer directly from admin portal'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-palm-100 text-palm-700 hover:bg-palm-200 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="rounded-2xl bg-coral-50 border border-coral-200 p-3 text-xs text-coral-700 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-palm-700 block mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bilal Ahmed"
              className="checkout-input py-2 text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-palm-700 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. bilal@gmail.com"
                className="checkout-input py-2 text-xs"
              />
            </div>
            <div>
              <label className="font-bold text-palm-700 block mb-1">Mobile / WhatsApp *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0300-1234567"
                className="checkout-input py-2 text-xs font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-palm-700 block mb-1">
                Account Password {isEditing && <span className="font-normal text-palm-400">(leave blank to keep)</span>}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isEditing ? '••••••••' : '123456 (default)'}
                  className="checkout-input py-2 pr-9 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-palm-400 hover:text-palm-700 cursor-pointer"
                >
                  <Lock size={13} />
                </button>
              </div>
              <p className="mt-1 text-[10px] text-palm-500">
                Customer logs in with this password + Email or Phone. Default: <span className="font-mono font-bold text-palm-800">123456</span>
              </p>
            </div>

            <div>
              <label className="font-bold text-palm-700 block mb-1">City *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="checkout-input py-2 text-xs font-bold cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.province})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-palm-700 block mb-1">Delivery Street Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. House 42, Block 5, Clifton, Karachi"
              className="checkout-input py-2 text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-palm-700 block mb-1.5">Account Status</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="customer_status"
                  value="active"
                  checked={status === 'active'}
                  onChange={() => setStatus('active')}
                  className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="font-bold text-emerald-800">Active (Can Login & Order)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="customer_status"
                  value="blocked"
                  checked={status === 'blocked'}
                  onChange={() => setStatus('blocked')}
                  className="text-coral-600 focus:ring-coral-500 cursor-pointer"
                />
                <span className="font-bold text-coral-700">Blocked / Suspended</span>
              </label>
            </div>
          </div>

          <div>
            <label className="font-bold text-palm-700 block mb-1">Admin CRM Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. VIP regular customer, prefers fresh malai coconuts on Sundays..."
              className="checkout-input py-2 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-palm-100">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost py-2.5 px-5 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-2.5 px-6 text-xs font-bold shadow-soft cursor-pointer"
            >
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// =========================================================================
// CUSTOMER ORDERS PREVIEW MODAL
// =========================================================================
function CustomerOrdersModal({
  customer,
  orders,
  onClose,
  onViewSlip,
}: {
  customer: Customer;
  orders: OrderDetails[];
  onClose: () => void;
  onViewSlip: (order: OrderDetails) => void;
}) {
  return (
    <div className="fixed inset-0 z-[125] flex items-center justify-center p-4 bg-palm-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-lift border border-palm-200 space-y-4 max-h-[88vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-palm-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-palm-100 text-palm-800 font-display font-extrabold text-base shadow-soft">
              {customer.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-extrabold text-palm-900">
                  {customer.name}
                </h3>
                <span
                  className={cn(
                    'chip text-[10px] font-bold py-0.5 px-2',
                    customer.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-coral-50 text-coral-700 border border-coral-200'
                  )}
                >
                  {customer.status === 'active' ? 'Active' : 'Blocked'}
                </span>
              </div>
              <p className="text-xs text-palm-500">
                {customer.phone} · {customer.email} · {customer.city}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-palm-100 text-palm-700 hover:bg-palm-200 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Orders summary bar */}
        <div className="flex items-center justify-between bg-cream-50 rounded-2xl p-3 border border-palm-100 text-xs">
          <div>
            <span className="text-palm-500 font-medium">Total Orders: </span>
            <strong className="text-palm-900 font-bold">{orders.length}</strong>
          </div>
          <div>
            <span className="text-palm-500 font-medium">Total Spend: </span>
            <strong className="text-coral-600 font-extrabold">
              {rs(orders.reduce((sum, o) => sum + (o.total || 0), 0))}
            </strong>
          </div>
        </div>

        {/* Orders list */}
        <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pr-1">
          {orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-palm-200 p-8 text-center text-palm-500 text-xs">
              <ShoppingBag size={32} className="mx-auto text-palm-300 mb-2" />
              <p className="font-bold text-palm-800">No orders placed under this customer phone yet</p>
              <p className="mt-1 text-[11px] text-palm-400">
                Orders matching {customer.phone} will appear here with instant printable slips.
              </p>
            </div>
          ) : (
            orders.map((o) => (
              <div
                key={o.ref}
                className="rounded-2xl border border-palm-200 bg-white p-4 shadow-soft space-y-2.5 hover:border-palm-300 transition text-xs"
              >
                <div className="flex items-center justify-between border-b border-palm-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="chip bg-palm-100 font-mono text-[11px] font-bold text-palm-900">
                      {o.ref}
                    </span>
                    <span className="text-palm-400 text-[11px]">{o.placedAt}</span>
                    <span
                      className={cn(
                        'chip text-[10px] font-bold py-0.5 px-2',
                        o.stage === 'delivered'
                          ? 'bg-palm-100 text-palm-800'
                          : o.stage === 'transit'
                          ? 'bg-blue-50 text-blue-700'
                          : o.stage === 'prep'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-coral-50 text-coral-700'
                      )}
                    >
                      {o.stage === 'delivered'
                        ? 'Delivered'
                        : o.stage === 'transit'
                        ? 'In Transit'
                        : o.stage === 'prep'
                        ? 'Preparation'
                        : 'Placed'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onViewSlip(o)}
                    className="flex items-center gap-1 rounded-full border border-palm-200 bg-palm-50 px-2.5 py-1 text-[11px] font-bold text-palm-800 hover:bg-palm-100 transition cursor-pointer"
                  >
                    <Receipt size={12} className="text-palm-600" />
                    <span>View Slip</span>
                  </button>
                </div>

                <div className="flex justify-between items-start text-palm-700 text-[11px]">
                  <div>
                    {o.items.map((item, idx) => (
                      <div key={idx} className="leading-snug">
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                  <div className="text-right">
                    <span className="text-palm-400 block">{o.paymentMethod || 'COD'}</span>
                    <span className="font-extrabold text-coral-600 text-xs">{rs(o.total)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-palm-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost py-2 px-5 text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

