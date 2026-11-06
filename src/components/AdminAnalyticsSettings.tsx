import { useState } from 'react';
import {
  Activity,
  Globe,
  HelpCircle,
  Radio,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Props {
  googleAnalyticsId: string;
  setGoogleAnalyticsId: (val: string) => void;
  googleTagManagerId: string;
  setGoogleTagManagerId: (val: string) => void;
  googleSiteVerification: string;
  setGoogleSiteVerification: (val: string) => void;
  metaPixelId: string;
  setMetaPixelId: (val: string) => void;
  tiktokPixelId: string;
  setTiktokPixelId: (val: string) => void;
  customHeadScript: string;
  setCustomHeadScript: (val: string) => void;
  trackingEnabled: boolean;
  setTrackingEnabled: (val: boolean) => void;
  onSave: () => Promise<void>;
  saving: boolean;
  onTest: () => void;
  testing: boolean;
  testResult: {
    ga?: { active: boolean; id: string };
    meta?: { active: boolean; id: string };
    siteKit?: { active: boolean; token: string };
  } | null;
}

export function AdminAnalyticsSettings({
  googleAnalyticsId,
  setGoogleAnalyticsId,
  googleTagManagerId,
  setGoogleTagManagerId,
  googleSiteVerification,
  setGoogleSiteVerification,
  metaPixelId,
  setMetaPixelId,
  tiktokPixelId,
  setTiktokPixelId,
  customHeadScript,
  setCustomHeadScript,
  trackingEnabled,
  setTrackingEnabled,
  onSave,
  saving,
  onTest,
  testing,
  testResult,
}: Props) {
  const [showGaGuide, setShowGaGuide] = useState(false);
  const [showMetaGuide, setShowMetaGuide] = useState(false);
  const [showSiteKitGuide, setShowSiteKitGuide] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const isGaConfigured = Boolean(googleAnalyticsId.trim());
  const isMetaConfigured = Boolean(metaPixelId.trim());
  const isSiteKitConfigured = Boolean(googleSiteVerification.trim() || googleTagManagerId.trim());

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-palm-200/80 shadow-card">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-palm-800 text-white shadow-soft">
              <Activity size={20} className="text-coral-400" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-palm-950">
                Analytics & Tracking Pixels
              </h1>
              <p className="text-xs text-palm-600 font-medium">
                Connect Google Analytics (GA4), Google Site Kit, Meta (Facebook) Pixel, and custom scripts.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* MASTER TOGGLE */}
          <button
            type="button"
            onClick={() => setTrackingEnabled(!trackingEnabled)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-extrabold border transition cursor-pointer ${
              trackingEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-cream-100 text-palm-500 border-palm-200'
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                trackingEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-palm-300'
              }`}
            />
            <span>Tracking Engine: {trackingEnabled ? 'Active' : 'Disabled'}</span>
          </button>

          {/* TEST TRACKING BUTTON */}
          <button
            type="button"
            onClick={onTest}
            disabled={testing}
            className="rounded-2xl border border-palm-200 bg-cream-50 px-3.5 py-2 text-xs font-bold text-palm-800 hover:bg-palm-100 active:scale-95 transition cursor-pointer flex items-center gap-1.5"
          >
            <Radio size={14} className={testing ? 'animate-spin text-coral-600' : 'text-palm-600'} />
            <span>{testing ? 'Testing Pixels...' : 'Verify Active Pixels'}</span>
          </button>

          {/* SAVE BUTTON */}
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="btn-primary py-2 px-5 text-xs font-bold shadow-soft flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save size={14} />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* TEST RESULT REPORT MODAL/ALERT */}
      {testResult && (
        <div className="rounded-2xl border-2 border-palm-300 bg-palm-900 text-cream-50 p-4 shadow-card animate-popIn">
          <div className="flex items-center justify-between border-b border-palm-700 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" />
              <h4 className="font-display font-extrabold text-sm text-white">Live Browser Diagnostics Result</h4>
            </div>
            <span className="text-[10px] text-palm-300 font-mono">Real-time Check</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-palm-950/60 p-3 border border-palm-800">
              <span className="text-[10px] uppercase tracking-wider text-palm-400 font-bold block mb-1">
                Google Analytics 4
              </span>
              <div className="flex items-center gap-1.5">
                {testResult.ga?.active ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-emerald-300">
                      Active ({testResult.ga.id || 'Initialized'})
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} className="text-amber-400 shrink-0" />
                    <span className="text-xs font-medium text-amber-200">
                      {testResult.ga?.id ? 'Configured (Will load on save)' : 'No ID configured'}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-palm-950/60 p-3 border border-palm-800">
              <span className="text-[10px] uppercase tracking-wider text-palm-400 font-bold block mb-1">
                Meta (Facebook) Pixel
              </span>
              <div className="flex items-center gap-1.5">
                {testResult.meta?.active ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-emerald-300">
                      Active ({testResult.meta.id || 'Initialized'})
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} className="text-amber-400 shrink-0" />
                    <span className="text-xs font-medium text-amber-200">
                      {testResult.meta?.id ? 'Configured (Will load on save)' : 'No Pixel ID'}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-palm-950/60 p-3 border border-palm-800">
              <span className="text-[10px] uppercase tracking-wider text-palm-400 font-bold block mb-1">
                Google Site Verification
              </span>
              <div className="flex items-center gap-1.5">
                {testResult.siteKit?.active ? (
                  <>
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-emerald-300">Verified in &lt;head&gt;</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} className="text-amber-400 shrink-0" />
                    <span className="text-xs font-medium text-amber-200">
                      {googleSiteVerification ? 'Ready (Applies on save)' : 'Not entered'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATUS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* GA4 CARD SUMMARY */}
        <div className="rounded-2xl border border-palm-200 bg-white p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 font-black text-sm">
              GA4
            </div>
            <div>
              <h4 className="font-display font-extrabold text-xs text-palm-900">Google Analytics</h4>
              <p className="text-[11px] text-palm-500 font-medium">
                {isGaConfigured ? googleAnalyticsId : 'Not connected'}
              </p>
            </div>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border ${
              isGaConfigured
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-cream-100 text-palm-500 border-palm-200'
            }`}
          >
            {isGaConfigured ? 'Ready' : 'Setup'}
          </span>
        </div>

        {/* GOOGLE SITE KIT / SEARCH CONSOLE SUMMARY */}
        <div className="rounded-2xl border border-palm-200 bg-white p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 font-black text-sm">
              <Globe size={18} />
            </div>
            <div>
              <h4 className="font-display font-extrabold text-xs text-palm-900">Google Site Kit</h4>
              <p className="text-[11px] text-palm-500 font-medium">
                {isSiteKitConfigured ? 'Tag Injected' : 'Verification pending'}
              </p>
            </div>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border ${
              isSiteKitConfigured
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-cream-100 text-palm-500 border-palm-200'
            }`}
          >
            {isSiteKitConfigured ? 'Injected' : 'Setup'}
          </span>
        </div>

        {/* META PIXEL SUMMARY */}
        <div className="rounded-2xl border border-palm-200 bg-white p-4 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 font-black text-sm">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="font-display font-extrabold text-xs text-palm-900">Meta (FB) Pixel</h4>
              <p className="text-[11px] text-palm-500 font-medium">
                {isMetaConfigured ? metaPixelId : 'Not connected'}
              </p>
            </div>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold border ${
              isMetaConfigured
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-cream-100 text-palm-500 border-palm-200'
            }`}
          >
            {isMetaConfigured ? 'Active' : 'Setup'}
          </span>
        </div>
      </div>

      {/* 1. GOOGLE ANALYTICS 4 (GA4) SECTION */}
      <div className="rounded-3xl border border-palm-200/80 bg-white p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-palm-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-soft">
              <Activity size={16} />
            </div>
            <div>
              <h3 className="font-display text-base font-extrabold text-palm-950">
                Google Analytics 4 (GA4)
              </h3>
              <p className="text-xs text-palm-500">Track visitors, traffic sources, page views, and e-commerce conversions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowGaGuide(!showGaGuide)}
            className="text-xs font-bold text-palm-700 hover:text-palm-900 flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle size={14} className="text-amber-600" />
            <span>{showGaGuide ? 'Hide Instructions' : 'How to find your GA4 ID'}</span>
            {showGaGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* GA4 GUIDE ACCORDION */}
        {showGaGuide && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs space-y-2 text-amber-950">
            <div className="font-extrabold flex items-center justify-between">
              <span>Step-by-Step: How to connect Google Analytics 4 in 60 seconds:</span>
              <a
                href="https://analytics.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-amber-800 underline font-bold flex items-center gap-1 hover:text-amber-950"
              >
                <span>analytics.google.com</span>
                <ExternalLink size={12} />
              </a>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-amber-900 font-medium">
              <li>Open <strong>Google Analytics</strong> and select your property (or create a new one).</li>
              <li>Click on the <strong>Admin (Gear icon)</strong> at bottom-left.</li>
              <li>Under Property settings, click <strong>Data Streams</strong> and choose <strong>Web</strong>.</li>
              <li>Copy the <strong>Measurement ID</strong> (it looks like <code className="bg-white/80 px-1.5 py-0.5 rounded border border-amber-300 font-mono text-[11px]">G-XXXXXXXXXX</code>).</li>
              <li>Paste the ID into the field below and click <strong>Save Settings</strong>.</li>
            </ol>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-palm-800 block mb-1.5">
              Google Analytics Measurement ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={googleAnalyticsId}
                onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="checkout-input py-2.5 text-xs font-mono pr-20"
              />
              {googleAnalyticsId && (
                <button
                  type="button"
                  onClick={() => handleCopy(googleAnalyticsId, 'ga')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-cream-100 hover:bg-cream-200 px-2 py-1 text-[10px] font-bold text-palm-700 flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'ga' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copiedField === 'ga' ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <p className="mt-1 text-[11px] text-palm-500">
              Format: <span className="font-mono text-palm-700 font-bold">G-XXXXXXXXXX</span>. Automatically enables global site tracking.
            </p>
          </div>

          <div className="rounded-2xl border border-palm-100 bg-cream-50/70 p-3.5 space-y-1.5 text-xs">
            <span className="font-bold text-palm-900 block">Automatic GA4 E-Commerce Events:</span>
            <ul className="space-y-1 text-palm-700 text-[11px]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span><strong className="font-mono">page_view:</strong> Tracks every storefront visit & navigation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span><strong className="font-mono">view_item:</strong> Fires when opening product details</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span><strong className="font-mono">add_to_cart:</strong> Fires with product price in PKR</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                <span><strong className="font-mono">purchase:</strong> Fires on completed order with total PKR value</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2. GOOGLE SITE KIT & SEARCH CONSOLE SECTION */}
      <div className="rounded-3xl border border-palm-200/80 bg-white p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-palm-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-soft">
              <Globe size={16} />
            </div>
            <div>
              <h3 className="font-display text-base font-extrabold text-palm-950">
                Google Site Kit & Search Console Verification
              </h3>
              <p className="text-xs text-palm-500">Verify your website ownership in Google Search Console & connect Google Tag Manager</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSiteKitGuide(!showSiteKitGuide)}
            className="text-xs font-bold text-palm-700 hover:text-palm-900 flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle size={14} className="text-blue-600" />
            <span>{showSiteKitGuide ? 'Hide Instructions' : 'How does Site Kit connect?'}</span>
            {showSiteKitGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* SITE KIT GUIDE ACCORDION */}
        {showSiteKitGuide && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-xs space-y-2 text-blue-950">
            <div className="font-extrabold flex items-center justify-between">
              <span>How Google Site Kit works on custom websites:</span>
              <a
                href="https://search.google.com/search-console"
                target="_blank"
                rel="noreferrer"
                className="text-blue-800 underline font-bold flex items-center gap-1 hover:text-blue-950"
              >
                <span>search.google.com/search-console</span>
                <ExternalLink size={12} />
              </a>
            </div>
            <p className="text-blue-900 leading-relaxed">
              Google Site Kit is Google&apos;s suite combining <strong>Google Search Console</strong> and <strong>Google Analytics</strong>. On custom web apps, Google verifies your ownership via the HTML meta tag:
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-blue-900 font-medium">
              <li>Go to <strong>Google Search Console</strong> and enter your website URL.</li>
              <li>Select verification method: <strong>HTML Tag</strong>.</li>
              <li>Copy the verification code (e.g. <code className="bg-white/80 px-1 rounded border border-blue-200 font-mono text-[10px]">&lt;meta name=&quot;google-site-verification&quot; content=&quot;abc123xyz...&quot; /&gt;</code>).</li>
              <li>Paste the code or token in the field below. Our app automatically embeds it into the website &lt;head&gt;!</li>
              <li>Return to Google Search Console and click <strong>Verify</strong> — your website will be verified instantly!</li>
            </ol>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-palm-800 block mb-1.5">
              Google Site Verification Code / Meta Tag
            </label>
            <input
              type="text"
              value={googleSiteVerification}
              onChange={(e) => setGoogleSiteVerification(e.target.value)}
              placeholder='e.g. abc123xyz... or <meta name="google-site-verification" content="..." />'
              className="checkout-input py-2.5 text-xs font-mono"
            />
            <p className="mt-1 text-[11px] text-palm-500">
              Paste either the token code or the complete &lt;meta&gt; tag from Google Search Console.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-palm-800 block mb-1.5">
              Google Tag Manager (GTM) Container ID <span className="text-palm-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={googleTagManagerId}
              onChange={(e) => setGoogleTagManagerId(e.target.value)}
              placeholder="GTM-XXXXXXX"
              className="checkout-input py-2.5 text-xs font-mono"
            />
            <p className="mt-1 text-[11px] text-palm-500">
              Format: <span className="font-mono text-palm-700 font-bold">GTM-XXXXXXX</span>. If you manage tags via Google Tag Manager container.
            </p>
          </div>
        </div>
      </div>

      {/* 3. META (FACEBOOK) PIXEL SECTION */}
      <div className="rounded-3xl border border-palm-200/80 bg-white p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-palm-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-soft">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-display text-base font-extrabold text-palm-950">
                Meta (Facebook & Instagram) Pixel
              </h3>
              <p className="text-xs text-palm-500">Track Facebook & Instagram ad conversions, retargeting, and cart events in PKR</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowMetaGuide(!showMetaGuide)}
            className="text-xs font-bold text-palm-700 hover:text-palm-900 flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle size={14} className="text-indigo-600" />
            <span>{showMetaGuide ? 'Hide Instructions' : 'How to find your Pixel ID'}</span>
            {showMetaGuide ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* META PIXEL GUIDE ACCORDION */}
        {showMetaGuide && (
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 text-xs space-y-2 text-indigo-950">
            <div className="font-extrabold flex items-center justify-between">
              <span>How to find your Meta Pixel ID in 30 seconds:</span>
              <a
                href="https://business.facebook.com/events_manager2/"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-800 underline font-bold flex items-center gap-1 hover:text-indigo-950"
              >
                <span>business.facebook.com/events_manager2</span>
                <ExternalLink size={12} />
              </a>
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-indigo-900 font-medium">
              <li>Log in to <strong>Meta Events Manager</strong>.</li>
              <li>Go to <strong>Data Sources</strong> from the left sidebar.</li>
              <li>Select your Pixel or Dataset name.</li>
              <li>Under the <strong>Settings</strong> tab, look for <strong>Pixel ID</strong> (a 15 to 16 digit number).</li>
              <li>Copy and paste the number into the field below and click <strong>Save Settings</strong>.</li>
            </ol>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-palm-800 block mb-1.5">
              Meta Pixel ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={metaPixelId}
                onChange={(e) => setMetaPixelId(e.target.value)}
                placeholder="123456789012345"
                className="checkout-input py-2.5 text-xs font-mono pr-20"
              />
              {metaPixelId && (
                <button
                  type="button"
                  onClick={() => handleCopy(metaPixelId, 'pixel')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-cream-100 hover:bg-cream-200 px-2 py-1 text-[10px] font-bold text-palm-700 flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'pixel' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copiedField === 'pixel' ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>
            <p className="mt-1 text-[11px] text-palm-500">
              15–16 digits. Connected to Meta Ads Manager for Facebook & Instagram campaigns.
            </p>
          </div>

          <div className="rounded-2xl border border-palm-100 bg-cream-50/70 p-3.5 space-y-1.5 text-xs">
            <span className="font-bold text-palm-900 block">Pre-Configured Meta Standard Events:</span>
            <ul className="space-y-1 text-palm-700 text-[11px]">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-indigo-600 shrink-0" />
                <span><strong className="font-mono">fbq(&apos;track&apos;, &apos;PageView&apos;):</strong> Store visits</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-indigo-600 shrink-0" />
                <span><strong className="font-mono">fbq(&apos;track&apos;, &apos;ViewContent&apos;):</strong> Product modal opened</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-indigo-600 shrink-0" />
                <span><strong className="font-mono">fbq(&apos;track&apos;, &apos;AddToCart&apos;):</strong> Cart additions with item ID & PKR value</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-indigo-600 shrink-0" />
                <span><strong className="font-mono">fbq(&apos;track&apos;, &apos;InitiateCheckout&apos;):</strong> Checkout drawer started</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-indigo-600 shrink-0" />
                <span><strong className="font-mono">fbq(&apos;track&apos;, &apos;Purchase&apos;):</strong> Order confirmed with total PKR & ref code</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. TIKTOK PIXEL & CUSTOM SCRIPTS */}
      <div className="rounded-3xl border border-palm-200/80 bg-white p-6 shadow-card space-y-4">
        <div className="flex items-center gap-2.5 border-b border-palm-100 pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-palm-700 text-white shadow-soft">
            <Radio size={16} />
          </div>
          <div>
            <h3 className="font-display text-base font-extrabold text-palm-950">
              TikTok Pixel & Custom Header Tracking
            </h3>
            <p className="text-xs text-palm-500">Optional TikTok advertising pixel and custom header/body tracking snippets</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-palm-800 block mb-1.5">
              TikTok Pixel ID <span className="text-palm-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={tiktokPixelId}
              onChange={(e) => setTiktokPixelId(e.target.value)}
              placeholder="e.g. CXXXXXXXXXXXXX"
              className="checkout-input py-2.5 text-xs font-mono"
            />
            <p className="mt-1 text-[11px] text-palm-500">
              Found in TikTok Ads Manager ➔ Assets ➔ Events ➔ Web Events.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-palm-800 block mb-1.5">
              Custom Header Tracking Code <span className="text-palm-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={3}
              value={customHeadScript}
              onChange={(e) => setCustomHeadScript(e.target.value)}
              placeholder="<!-- Paste any custom <script> or <meta> tags here (e.g. Hotjar, Microsoft Clarity, Pinterest) -->"
              className="checkout-input py-2 text-xs font-mono text-[11px]"
            />
            <p className="mt-1 text-[11px] text-palm-500">
              Directly injected into the &lt;head&gt; tag of your live storefront.
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM SAVE BAR */}
      <div className="flex items-center justify-between bg-cream-50 p-4 rounded-2xl border border-palm-200">
        <div className="flex items-center gap-2 text-xs text-palm-600 font-medium">
          <ShieldCheck size={16} className="text-palm-700" />
          <span>All tracking codes are securely saved and synced live across your storefront.</span>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="btn-primary py-2.5 px-6 text-xs font-bold shadow-soft flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Save size={14} />
          <span>{saving ? 'Saving Changes...' : 'Save Tracking Settings'}</span>
        </button>
      </div>
    </div>
  );
}
