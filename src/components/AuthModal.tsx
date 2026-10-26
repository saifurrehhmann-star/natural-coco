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
  KeyRound,
  ArrowLeft,
  AlertCircle,
  MapPin,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Customer } from '@/types';
import { loginCustomer, createCustomer, requestPasswordResetOtp, verifyOtpAndResetPassword } from '@/api';
import { CITIES } from '@/data';

interface Props {
  open: boolean;
  onClose: () => void;
  isAdminLoggedIn: boolean;
  onAdminLogin: () => void;
  onLogout: () => void;
  customerUser?: Customer | null;
  onCustomerLogin?: (cust: Customer) => void;
  onCustomerLogout?: () => void;
}

type AuthTab = 'customer' | 'admin';
type ForgotStep = 'none' | 'request_otp' | 'verify_otp' | 'success';

export function AuthModal({
  open,
  onClose,
  isAdminLoggedIn,
  onAdminLogin,
  onLogout,
  customerUser,
  onCustomerLogin,
  onCustomerLogout,
}: Props) {
  const [activeTab, setActiveTab] = useState<AuthTab>('customer');

  // Admin login fields
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  // Customer Sign In fields
  const [customerMode, setCustomerMode] = useState<'signin' | 'signup'>('signin');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Customer Sign Up fields
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpCity, setSignUpCity] = useState('Karachi');
  const [signUpAddress, setSignUpAddress] = useState('');

  // Forgot Password state
  const [forgotStep, setForgotStep] = useState<ForgotStep>('none');
  const [forgotEmail, setForgotEmail] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status & feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!open) return null;

  // Handle Admin Sign In
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
      setError('Invalid admin credentials. Please check your username/email and password.');
    }
  };

  // Handle Customer Sign In (Email or Mobile & Password)
  const handleCustomerSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await loginCustomer(signInEmail.trim(), signInPassword.trim());
    setLoading(false);

    if (res.success && res.customer) {
      if (onCustomerLogin) onCustomerLogin(res.customer);
      setSuccessMsg(`Welcome back, ${res.customer.name}!`);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 900);
    } else {
      setError(res.error || 'Invalid credentials. Please verify your email/mobile and password.');
    }
  };

  // Handle Customer Account Creation
  const handleCustomerSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!signUpEmail.includes('@')) {
      setError('Please provide a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const created = await createCustomer({
        name: signUpName.trim(),
        email: signUpEmail.trim().toLowerCase(),
        phone: signUpPhone.trim(),
        password: signUpPassword.trim() || '123456',
        city: signUpCity,
        address: signUpAddress.trim(),
        registeredAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: 'active',
      });

      setLoading(false);
      if (onCustomerLogin) onCustomerLogin(created);
      setSignInEmail(created.email);
      setSignInPassword('');
      setSuccessMsg(`Account created successfully! Welcome, ${created.name}`);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1000);
    } catch (err: unknown) {
      setLoading(false);
      setError((err as Error)?.message || 'Failed to create account.');
    }
  };

  // Handle Request OTP (Dispatched to Email - NO page display)
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const targetRole = activeTab === 'admin' ? 'admin' : 'customer';
    const res = await requestPasswordResetOtp(forgotEmail.trim(), targetRole);
    setLoading(false);

    if (res.success) {
      setForgotStep('verify_otp');
      setSuccessMsg(res.message || `Verification code sent to ${forgotEmail}`);
    } else {
      setError(res.error || res.message || 'No account found with this email.');
    }
  };

  // Handle Verify OTP and Reset Password
  const handleVerifyOtpAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    const targetRole = activeTab === 'admin' ? 'admin' : 'customer';
    const res = await verifyOtpAndResetPassword(forgotEmail.trim(), enteredOtp.trim(), newPassword.trim(), targetRole);
    setLoading(false);

    if (res.success) {
      setForgotStep('success');
      setSuccessMsg(res.message);
    } else {
      setError(res.error || res.message || 'Invalid or expired OTP code.');
    }
  };

  const resetForgotFlow = () => {
    setForgotStep('none');
    setForgotEmail('');
    setEnteredOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setSuccessMsg(null);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-palm-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md overflow-hidden rounded-4xl bg-cream-50 border border-palm-200/90 shadow-lift animate-popIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-palm-700 shadow-soft hover:bg-palm-50 active:scale-95 transition cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Top Header Card */}
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
          {/* FORGOT PASSWORD SUB-FLOW */}
          {forgotStep !== 'none' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-palm-200/80 pb-3">
                <button
                  type="button"
                  onClick={resetForgotFlow}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-palm-100 text-palm-700 hover:bg-palm-200 transition cursor-pointer"
                  title="Back to Sign In"
                >
                  <ArrowLeft size={16} />
                </button>
                <div>
                  <h3 className="font-display text-base font-extrabold text-palm-900">
                    {forgotStep === 'success' ? 'Password Reset Complete' : 'Forgot Password'}
                  </h3>
                  <p className="text-[11px] text-palm-500">
                    {activeTab === 'admin' ? 'Admin Recovery' : 'Customer Account Recovery'}
                  </p>
                </div>
              </div>

              {/* Alerts */}
              {error && (
                <div className="rounded-2xl bg-coral-50 border border-coral-200 p-3 text-xs font-semibold text-coral-700 flex items-center gap-2 animate-fadeIn">
                  <AlertCircle size={16} className="text-coral-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Email Dispatch Notice (NO OTP on-screen) */}
              {forgotStep === 'verify_otp' && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs text-emerald-900 shadow-soft animate-fadeIn">
                  <p className="font-bold mb-1 flex items-center gap-1.5 text-emerald-800">
                    <CheckCircle2 size={15} className="text-emerald-600" />
                    Verification Code Sent via Email
                  </p>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    A 6-digit confirmation code has been dispatched to <strong>{forgotEmail}</strong>. Please check your inbox and spam folder, then enter the code below to reset your password.
                  </p>
                </div>
              )}

              {/* Step 1: Request OTP */}
              {forgotStep === 'request_otp' && (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <p className="text-xs text-palm-600 leading-relaxed">
                    Enter your registered email address. We will generate and send a 6-digit OTP confirmation code to reset your password.
                  </p>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-palm-700 block mb-1">
                      Registered Email Address *
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-3.5 text-palm-400" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="checkout-input pl-10 text-xs py-2.5"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 text-xs font-bold shadow-soft flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{loading ? 'Sending Code...' : 'Send OTP Verification Code'}</span>
                    <ArrowRight size={15} />
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={resetForgotFlow}
                      className="text-xs font-bold text-palm-600 hover:text-palm-900 cursor-pointer"
                    >
                      ← Return to Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Enter OTP & New Password */}
              {forgotStep === 'verify_otp' && (
                <form onSubmit={handleVerifyOtpAndReset} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-palm-700 block mb-1">
                      Enter 6-Digit OTP Code *
                    </label>
                    <div className="relative">
                      <KeyRound size={16} className="absolute left-3.5 top-3.5 text-palm-400" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="checkout-input pl-10 text-xs py-2.5 font-mono font-bold tracking-widest text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-palm-700 block mb-1">
                      New Password *
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-3.5 text-palm-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 4 characters"
                        className="checkout-input pl-10 pr-10 text-xs py-2.5"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3.5 top-3 text-palm-400 hover:text-palm-700 cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-palm-700 block mb-1">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-3.5 text-palm-400" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type new password"
                        className="checkout-input pl-10 text-xs py-2.5"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 text-xs font-bold shadow-soft flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{loading ? 'Verifying...' : 'Confirm & Reset Password'}</span>
                    <CheckCircle2 size={16} />
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setForgotStep('request_otp')}
                      className="text-xs font-bold text-palm-600 hover:text-palm-900 cursor-pointer"
                    >
                      Didn&apos;t get code? Request Again
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Success Screen */}
              {forgotStep === 'success' && (
                <div className="text-center py-4 space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-extrabold text-palm-900">
                      Password Successfully Updated!
                    </h4>
                    <p className="mt-1 text-xs text-palm-600">
                      Your credentials have been securely updated. You can now log into your account using your new password.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetForgotFlow}
                    className="btn-primary w-full py-3 text-xs font-bold cursor-pointer"
                  >
                    Proceed to Sign In
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* If already signed in as Admin */}
              {isAdminLoggedIn && activeTab === 'admin' ? (
                <div className="text-center py-4 space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-palm-100 text-palm-800">
                    <ShieldCheck size={32} className="text-palm-700" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-palm-900">
                      Signed in as Store Admin
                    </h3>
                    <p className="mt-1 text-xs text-palm-600">
                      You have manager permissions to update products, categories, customers, banners, and orders.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-primary py-3 text-xs font-bold w-full cursor-pointer"
                    >
                      Continue to Admin Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className="btn-ghost py-2.5 text-xs font-bold text-coral-600 hover:text-coral-700 w-full flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogOut size={15} /> Sign Out of Admin
                    </button>
                  </div>
                </div>
              ) : customerUser && activeTab === 'customer' ? (
                /* If already signed in as Customer */
                <div className="text-center py-4 space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-palm-100 text-palm-800">
                    <User size={30} className="text-palm-700" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-palm-900">
                      Signed in as {customerUser.name}
                    </h3>
                    <p className="mt-1 text-xs text-palm-600">
                      {customerUser.email} · {customerUser.phone}
                    </p>
                    {customerUser.city && (
                      <p className="text-[11px] text-palm-500 mt-0.5">{customerUser.city}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-primary py-3 text-xs font-bold w-full cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                    {onCustomerLogout && (
                      <button
                        type="button"
                        onClick={() => {
                          onCustomerLogout();
                          onClose();
                        }}
                        className="btn-ghost py-2.5 text-xs font-bold text-coral-600 hover:text-coral-700 w-full flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <LogOut size={15} /> Sign Out of Account
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Top Switcher: Customer vs Admin */}
                  <div className="flex rounded-2xl bg-palm-100/70 p-1 border border-palm-200/80 mb-5">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('customer');
                        setError(null);
                        setSuccessMsg(null);
                      }}
                      className={cn(
                        'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer',
                        activeTab === 'customer'
                          ? 'bg-palm-800 text-cream-50 shadow-soft'
                          : 'text-palm-700 hover:text-palm-950'
                      )}
                    >
                      <User size={15} />
                      <span>Customer Account</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('admin');
                        setError(null);
                        setSuccessMsg(null);
                      }}
                      className={cn(
                        'flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer',
                        activeTab === 'admin'
                          ? 'bg-palm-800 text-cream-50 shadow-soft'
                          : 'text-palm-700 hover:text-palm-950'
                      )}
                    >
                      <ShieldCheck size={15} />
                      <span>Admin Login</span>
                    </button>
                  </div>

                  {/* Feedback Message Banners */}
                  {error && (
                    <div className="rounded-2xl bg-coral-50 border border-coral-200 p-2.5 text-xs font-semibold text-coral-700 mb-3 flex items-center gap-2">
                      <AlertCircle size={15} className="text-coral-600 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-2.5 text-xs font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  {/* ========================================= */}
                  {/* TAB 1: CUSTOMER ACCOUNT (EMAIL & PASSWORD) */}
                  {/* ========================================= */}
                  {activeTab === 'customer' && (
                    <div className="space-y-4">
                      {/* Sign In vs Create Account Toggle */}
                      <div className="flex justify-center gap-4 border-b border-palm-100 pb-2 mb-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCustomerMode('signin');
                            setError(null);
                          }}
                          className={cn(
                            'text-xs font-bold pb-1 transition cursor-pointer',
                            customerMode === 'signin'
                              ? 'border-b-2 border-coral-500 text-palm-900 font-extrabold'
                              : 'text-palm-400 hover:text-palm-700'
                          )}
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCustomerMode('signup');
                            setError(null);
                          }}
                          className={cn(
                            'text-xs font-bold pb-1 transition cursor-pointer',
                            customerMode === 'signup'
                              ? 'border-b-2 border-coral-500 text-palm-900 font-extrabold'
                              : 'text-palm-400 hover:text-palm-700'
                          )}
                        >
                          Create Account
                        </button>
                      </div>

                      {/* Customer Sign In Form: ONLY EMAIL AND PASSWORD */}
                      {customerMode === 'signin' && (
                        <form onSubmit={handleCustomerSignIn} className="space-y-3.5">
                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-palm-700 block mb-1">
                              Email Address or Mobile *
                            </label>
                            <div className="relative">
                              <Mail size={16} className="absolute left-3.5 top-3.5 text-palm-400" />
                              <input
                                type="text"
                                required
                                value={signInEmail}
                                onChange={(e) => setSignInEmail(e.target.value)}
                                placeholder="you@email.com or 03001234567"
                                className="checkout-input pl-10 text-xs py-2.5"
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-bold uppercase tracking-wider text-palm-700">
                                Password *
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  setForgotEmail(signInEmail);
                                  setForgotStep('request_otp');
                                }}
                                className="text-[11px] font-bold text-coral-600 hover:text-coral-700 cursor-pointer"
                              >
                                Forgot Password?
                              </button>
                            </div>
                            <div className="relative">
                              <Lock size={16} className="absolute left-3.5 top-3.5 text-palm-400" />
                              <input
                                type={showSignInPassword ? 'text' : 'password'}
                                required
                                value={signInPassword}
                                onChange={(e) => setSignInPassword(e.target.value)}
                                placeholder="Enter account password"
                                className="checkout-input pl-10 pr-10 text-xs py-2.5"
                              />
                              <button
                                type="button"
                                onClick={() => setShowSignInPassword(!showSignInPassword)}
                                className="absolute right-3.5 top-3 text-palm-400 hover:text-palm-700 cursor-pointer"
                              >
                                {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 text-xs font-bold shadow-soft flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>{loading ? 'Signing In...' : 'Sign In to My Account'}</span>
                            <ArrowRight size={15} />
                          </button>
                        </form>
                      )}

                      {/* Customer Create Account Form */}
                      {customerMode === 'signup' && (
                        <form onSubmit={handleCustomerSignUp} className="space-y-3">
                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-palm-700 block mb-1">
                              Full Name *
                            </label>
                            <div className="relative">
                              <User size={16} className="absolute left-3.5 top-3.5 text-palm-400" />
                              <input
                                type="text"
                                required
                                value={signUpName}
                                onChange={(e) => setSignUpName(e.target.value)}
                                placeholder="Your full name"
                                className="checkout-input pl-10 text-xs py-2.5"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-palm-700 block mb-1">
                              Email Address *
                            </label>
                            <div className="relative">
                              <Mail size={16} className="absolute left-3.5 top-3.5 text-palm-400" />
                              <input
                                type="email"
                                required
                                value={signUpEmail}
                                onChange={(e) => setSignUpEmail(e.target.value)}
                                placeholder="you@email.com"
                                className="checkout-input pl-10 text-xs py-2.5"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            <div>
                              <label className="text-xs font-bold uppercase tracking-wider text-palm-700 block mb-1">
                                Mobile Number *
                              </label>
                              <div className="relative">
                                <Phone size={16} className="absolute left-3.5 top-3.5 text-palm-400" />
                                <input
                                  type="tel"
                                  required
                                  value={signUpPhone}
                                  onChange={(e) => setSignUpPhone(e.target.value)}
                                  placeholder="0300 1234567"
                                  className="checkout-input pl-10 text-xs py-2.5"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-xs font-bold uppercase tracking-wider text-palm-700 block mb-1">
                                City *
                              </label>
                              <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-3 text-palm-400" />
                                <select
                                  value={signUpCity}
                                  onChange={(e) => setSignUpCity(e.target.value)}
                                  className="checkout-input pl-9 text-xs py-2.5 font-bold cursor-pointer"
                                >
                                  {CITIES.map((c) => (
                                    <option key={c.id} value={c.name}>
                                      {c.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-palm-700 block mb-1">
                              Delivery Address
                            </label>
                            <input
                              type="text"
                              value={signUpAddress}
                              onChange={(e) => setSignUpAddress(e.target.value)}
                              placeholder="House / Street / Area"
                              className="checkout-input text-xs py-2"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-palm-700 block mb-1">
                              Create Password *
                            </label>
                            <div className="relative">
                              <Lock size={16} className="absolute left-3.5 top-3.5 text-palm-400" />
                              <input
                                type={showSignUpPassword ? 'text' : 'password'}
                                required
                                value={signUpPassword}
                                onChange={(e) => setSignUpPassword(e.target.value)}
                                placeholder="Create a secure password"
                                className="checkout-input pl-10 pr-10 text-xs py-2.5"
                              />
                              <button
                                type="button"
                                onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                                className="absolute right-3.5 top-3 text-palm-400 hover:text-palm-700 cursor-pointer"
                              >
                                {showSignUpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 text-xs font-bold shadow-soft flex items-center justify-center gap-2 cursor-pointer mt-1"
                          >
                            <span>{loading ? 'Creating Account...' : 'Create Customer Account'}</span>
                            <ArrowRight size={15} />
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* ========================================= */}
                  {/* TAB 2: ADMIN LOGIN                        */}
                  {/* ========================================= */}
                  {activeTab === 'admin' && (
                    <form onSubmit={handleAdminSubmit} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-palm-700 block mb-1">
                          Admin Username or Email *
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
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-palm-700">
                            Admin Password *
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setForgotEmail(adminUsername.includes('@') ? adminUsername : 'admin@naturacoco.pk');
                              setForgotStep('request_otp');
                            }}
                            className="text-[11px] font-bold text-coral-600 hover:text-coral-700 cursor-pointer"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock size={16} className="absolute left-3.5 top-3.5 text-palm-400" />
                          <input
                            type={showAdminPassword ? 'text' : 'password'}
                            required
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="checkout-input pl-10 pr-10 text-xs py-2.5"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAdminPassword(!showAdminPassword)}
                            className="absolute right-3.5 top-3 text-palm-400 hover:text-palm-700 cursor-pointer"
                          >
                            {showAdminPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn-primary w-full py-3 text-xs font-bold shadow-soft flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Sign In to Admin Portal</span>
                        <ArrowRight size={15} />
                      </button>
                    </form>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
