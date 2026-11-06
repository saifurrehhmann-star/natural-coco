import type { StoreSettings, Product, OrderDetails, CartItem } from '../types';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    ttq?: {
      page: () => void;
      track: (event: string, params?: Record<string, unknown>) => void;
      [key: string]: unknown;
    };
  }
}

/**
 * Initializes and injects Google Analytics, GTM, Google Site Verification,
 * Meta (Facebook) Pixel, TikTok Pixel, and custom scripts based on StoreSettings.
 */
export function initializeTracking(settings?: StoreSettings | null) {
  if (typeof window === 'undefined' || !settings) return;
  if (settings.trackingEnabled === false) return;

  // 1. Google Site Verification Meta Tag (for Google Site Kit & Search Console)
  if (settings.googleSiteVerification && settings.googleSiteVerification.trim()) {
    let token = settings.googleSiteVerification.trim();
    // If user pasted `<meta name="google-site-verification" content="..." />`
    const match = token.match(/content=["']([^"']+)["']/i);
    if (match && match[1]) {
      token = match[1];
    }
    let metaTag = document.querySelector('meta[name="google-site-verification"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'google-site-verification');
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', token);
  }

  // 2. Google Analytics 4 (GA4)
  if (settings.googleAnalyticsId && settings.googleAnalyticsId.trim()) {
    const gaId = settings.googleAnalyticsId.trim();
    const scriptId = 'ga4-tracking-script';
    const alreadyPresent = document.getElementById(scriptId) || document.querySelector(`script[src*="${gaId}"]`);
    if (!alreadyPresent) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', gaId, {
        send_page_view: true,
      });
    } else if (typeof window.gtag === 'function') {
      window.gtag('config', gaId, {
        send_page_view: true,
      });
    }
  }

  // 3. Google Tag Manager (GTM)
  if (settings.googleTagManagerId && settings.googleTagManagerId.trim()) {
    const gtmId = settings.googleTagManagerId.trim();
    const gtmScriptId = 'gtm-tracking-script';
    if (!document.getElementById(gtmScriptId)) {
      const script = document.createElement('script');
      script.id = gtmScriptId;
      script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');`;
      document.head.appendChild(script);
    }
  }

  // 4. Meta (Facebook) Pixel
  if (settings.metaPixelId && settings.metaPixelId.trim()) {
    const pixelId = settings.metaPixelId.trim();
    const pixelScriptId = 'fb-pixel-script';
    if (!document.getElementById(pixelScriptId)) {
      /* eslint-disable */
      (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.id = pixelScriptId;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      if (typeof window.fbq === 'function') {
        window.fbq('init', pixelId);
        window.fbq('track', 'PageView');
      }
    }
  }

  // 5. TikTok Pixel
  if (settings.tiktokPixelId && settings.tiktokPixelId.trim()) {
    const ttId = settings.tiktokPixelId.trim();
    const ttScriptId = 'tiktok-pixel-script';
    if (!document.getElementById(ttScriptId)) {
      /* eslint-disable */
      (function (w: any, d: any, t: any) {
        w.TiktokAnalyticsObject = t;
        const ttq = (w[t] = w[t] || []);
        ttq.methods = [
          'page',
          'track',
          'identify',
          'instances',
          'debug',
          'on',
          'off',
          'once',
          'ready',
          'alias',
          'group',
          'enableCookie',
          'disableCookie',
        ];
        ttq.setAndDefer = function (t: any, e: any) {
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        };
        for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
        ttq.instance = function (t: any) {
          for (let e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
          return e;
        };
        ttq.load = function (e: any, n: any) {
          const i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
          (ttq._i = ttq._i || {}), (ttq._i[e] = []), (ttq._i[e]._u = i);
          const s = d.createElement('script');
          (s.type = 'text/javascript'), (s.async = !0), (s.src = i + '?sdkid=' + e + '&lib=' + t), (s.id = ttScriptId);
          const c = d.getElementsByTagName('script')[0];
          c.parentNode.insertBefore(s, c);
        };
        ttq.load(ttId);
        ttq.page();
      })(window, document, 'ttq');
      /* eslint-enable */
    }
  }

  // 6. Custom Head Tracking Scripts
  if (settings.customHeadScript && settings.customHeadScript.trim()) {
    const customContainerId = 'custom-head-tracking-container';
    if (!document.getElementById(customContainerId)) {
      const container = document.createElement('div');
      container.id = customContainerId;
      container.style.display = 'none';
      container.innerHTML = settings.customHeadScript;
      document.head.appendChild(container);

      // Execute scripts if injected via innerHTML
      const scripts = container.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const s = document.createElement('script');
        s.textContent = scripts[i].textContent;
        if (scripts[i].src) s.src = scripts[i].src;
        document.head.appendChild(s);
      }
    }
  }
}

/**
 * Standard E-Commerce Tracking Events
 */
export function trackPageView(title?: string, path?: string) {
  if (typeof window === 'undefined') return;
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: title || document.title,
      page_location: window.location.href,
      page_path: path || window.location.pathname,
    });
  }
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
  if (window.ttq?.page) {
    window.ttq.page();
  }
}

export function trackViewProduct(product: Product) {
  if (typeof window === 'undefined') return;
  if (window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'PKR',
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.categoryId,
          price: product.price,
          quantity: 1,
        },
      ],
    });
  }
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: product.name,
      content_category: product.categoryId,
      content_ids: [product.id],
      content_type: 'product',
      value: product.price,
      currency: 'PKR',
    });
  }
}

export function trackAddToCart(product: Product, quantity = 1, price = product.price) {
  if (typeof window === 'undefined') return;
  const totalValue = price * quantity;
  if (window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'PKR',
      value: totalValue,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.categoryId,
          price: price,
          quantity: quantity,
        },
      ],
    });
  }
  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: product.name,
      content_category: product.categoryId,
      content_ids: [product.id],
      content_type: 'product',
      value: totalValue,
      currency: 'PKR',
    });
  }
  if (window.ttq?.track) {
    window.ttq.track('AddToCart', {
      content_id: product.id,
      content_name: product.name,
      quantity: quantity,
      price: price,
      value: totalValue,
      currency: 'PKR',
    });
  }
}

export function trackInitiateCheckout(items: CartItem[], total: number) {
  if (typeof window === 'undefined') return;
  if (window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'PKR',
      value: total,
      items: items.map((i) => ({
        item_id: i.product.id,
        item_name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
    });
  }
  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: items.map((i) => i.product.id),
      content_type: 'product',
      num_items: items.reduce((sum, i) => sum + i.quantity, 0),
      value: total,
      currency: 'PKR',
    });
  }
  if (window.ttq?.track) {
    window.ttq.track('InitiateCheckout', {
      value: total,
      currency: 'PKR',
    });
  }
}

export function trackPurchase(order: OrderDetails) {
  if (typeof window === 'undefined') return;
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: order.ref,
      value: order.total,
      currency: 'PKR',
      tax: order.tax,
      shipping: order.deliveryFee,
      items: order.items.map((i) => ({
        item_id: i.product.id,
        item_name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
    });
  }
  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      value: order.total,
      currency: 'PKR',
      content_type: 'product',
      content_ids: order.items.map((i) => i.product.id),
      num_items: order.items.reduce((s, i) => s + i.quantity, 0),
      order_id: order.ref,
    });
  }
  if (window.ttq?.track) {
    window.ttq.track('CompletePayment', {
      content_id: order.ref,
      value: order.total,
      currency: 'PKR',
    });
  }
}

export function trackContact(channel: 'whatsapp' | 'phone') {
  if (typeof window === 'undefined') return;
  if (window.gtag) {
    window.gtag('event', 'contact', {
      method: channel,
    });
  }
  if (window.fbq) {
    window.fbq('track', 'Contact');
  }
}
