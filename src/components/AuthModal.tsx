import { useState } from 'react';
import {
  X,
  Leaf,
  ShieldCheck,
  User,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface Props {
  open: boolean;
  onClose: () => void;
  isAdminLoggedIn: boolean;
  onAdminLogin: () => void;
  onLogout: () => void;
}

type AuthTab = 'admin' | 'customer';

export function AuthModal({
  open,
  onClose,
  isAdminLoggedIn,
  onAdminLogin,
  onLogout,
}: Props) {
  const [activeTab, setActiveTab] = useState<AuthTab>('admin');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Customer tab fields
  const [customerMode, setCustomerMode] = useState<'signin' | 'signup'>('signin');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerLoggedIn, setCustomerLoggedIn] = useState(false);

  if (!open) return null;

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const user = adminUsername.trim().toLowerCase();
    const pass = adminPassword.trim();

    if (
      (user === 'admin' || user === 'admin@naturacoco.pk' || user === 'saif' || user === 'saif.ur.rehhmann@gmail.com') &&
      (pass === 'admin123' || pass === 'admin')
    ) {
      onAdminLogin();
      onClose();
    } else {
      setError('Invalid username or password. Please check your credentials.');
    }
  };

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerLoggedIn(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-palm-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-4xl bg-cream-50 border border-palm-200/90 shadow-lift animate-popIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-palm-700 shadow-soft hover:bg-palm-50 active:scale-95 transition"
        >
          <X size={18} />
        </button>

        {/* Top Header Card with Brand Logo */}
        <div className="bg-gradient-to-br from-palm-800 to-palm-900 p-6 text-center text-cream-50">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur shadow-soft ring-2 ring-white/20">
            <Leaf size={28} className="text-cream-300" />
          </div>
          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-white">
            Natura <span className="text-cream-300">Coco</span>
          </h2>
          <p className="mt-1 text-xs text-cream-200/90 font-medium">
            Natural Coconut Delivery across Pakistan
          </p>
        </div>

        {/* Main Body */}
        <div className="p-6">
          {/* If already logged in as Admin */}
          {isAdminLoggedIn ? (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-palm-100 text-palm-800">
                <ShieldCheck size={32} className="text-palm-700" />
              </div>
              <div>
                <h3 className="font-display text-lg font-extrabold text-palm-900">
                  Signed in as Store Admin
                </h3>
                <p className="mt-1 text-xs text-palm-600">
                  You have full manager permissions to update products, city visibility, banners, and orders.
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                  }}
                  className="btn-primary py-3 text-xs font-bold w-full"
                >
                  Continue to Store & Admin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="btn-ghost py-2.5 text-xs font-bold text-coral-600 hover:text-coral-700 w-full flex items-center justify-center gap-1.5"
                >
                  <LogOut size={15} /> Sign Out of Admin
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Selector: Admin vs Customer */}
              <div className="flex rounded-2xl bg-palm-100/70 p-1 border border-palm-200/80 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('admin');
                    setError(null);
                  }}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all',
                    activeTab === 'admin'
                      ? 'bg-palm-800 text-cream-50 shadow-soft'
                      : 'text-palm-700 hover:text-palm-950'
                  )}
                >
                  <ShieldCheck size={15} />
                  <span>Admin Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('customer');
                    setError(null);
                  }}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all',
                    activeTab === 'customer'
                      ? 'bg-palm-800 text-cream-50 shadow-soft'
                      : 'text-palm-700 hover:text-palm-950'
                  )}
                >
                  <User size={15} />
                  <span>Customer Account</span>
                </button>
              </div>

              {/* ADMIN LOGIN FORM */}
              {activeTab === 'admin' && (
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-palm-700 block mb-1">
                      Admin Username / Email
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-3.5 text-palm-400" />
                      <input
                        type="text"
                        required
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        className="checkout-input pl-10 text-xs py-2.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-palm-700 block mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-3.5 text-palm-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="checkout-input pl-10 pr-10 text-xs py-2.5"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-palm-400 hover:text-palm-700"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-xl bg-coral-50 border border-coral-200 p-2.5 text-xs font-semibold text-coral-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary w-full py-3 text-xs font-bold shadow-soft flex items-center justify-center gap-2"
                  >
                    <span>Sign In to Admin Portal</span>
                    <ArrowRight size={15} />
                  </button>
                </form>
              )}

              {/* CUSTOMER LOGIN/REGISTER */}
              {activeTab === 'customer' && (
                <form onSubmit={handleCustomerSubmit} className="space-y-4">
                  <div className="flex justify-center gap-4 border-b border-palm-100 pb-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setCustomerMode('signin')}
                      className={cn(
                        'text-xs font-bold pb-1 transition',
                        customerMode === 'signin'
                          ? 'border-b-2 border-coral-500 text-palm-900 font-extrabold'
                          : 'text-palm-400'
                      )}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerMode('signup')}
                      className={cn(
                        'text-xs font-bold pb-1 transition',
                        customerMode === 'signup'
                          ? 'border-b-2 border-coral-500 text-palm-900 font-extrabold'
                          : 'text-palm-400'
                      )}
                    >
                      Create Account
                    </button>
                  </div>

                  {customerMode === 'signup' && (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-palm-700 block mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-3.5 text-palm-400" />
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Your full name"
                          className="checkout-input pl-10 text-xs py-2.5"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-palm-700 block mb-1">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-3.5 text-palm-400" />
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="0300 1234567"
                        className="checkout-input pl-10 text-xs py-2.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-palm-700 block mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-3.5 text-palm-400" />
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="checkout-input pl-10 text-xs py-2.5"
                      />
                    </div>
                  </div>

                  {customerLoggedIn ? (
                    <div className="rounded-xl bg-palm-100 p-3 text-center text-xs font-bold text-palm-800 flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} className="text-palm-700" />
                      <span>Welcome to Natura Coco!</span>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="btn-primary w-full py-3 text-xs font-bold shadow-soft"
                    >
                      {customerMode === 'signup' ? 'Create Account' : 'Sign In'}
                    </button>
                  )}
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
