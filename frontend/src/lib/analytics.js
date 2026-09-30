// Privacy-Preserving Analytics Utility for KRYNTRA

const COOKIE_CONSENT_KEY = "kryntra_cookie_consent";

export function getCookieConsent() {
  if (typeof window === "undefined") return null;
  try {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    return consent ? JSON.parse(consent) : null;
  } catch {
    return null;
  }
}

export function setCookieConsent(preferences) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      ...preferences,
      timestamp: new Date().toISOString(),
    }));
    // Dispatch custom event to notify listeners
    window.dispatchEvent(new CustomEvent("kryntra_consent_updated", { detail: preferences }));
  } catch (e) {
    console.warn("Failed to persist cookie consent", e);
  }
}

export function isAnalyticsAllowed() {
  if (typeof window === "undefined") return false;
  // Respect browser "Do Not Track" signal if enabled
  if (navigator.doNotTrack === "1" || window.doNotTrack === "1") {
    return false;
  }
  const consent = getCookieConsent();
  return consent?.analytics === true;
}

export function trackEvent(eventName, properties = {}) {
  if (!isAnalyticsAllowed()) return;

  // Dispatch to configured analytics providers (e.g. Google Analytics 4, Plausible, or internal telemetry endpoint)
  if (typeof window !== "undefined") {
    if (window.gtag) {
      window.gtag("event", eventName, properties);
    }
    if (window.plausible) {
      window.plausible(eventName, { props: properties });
    }
    // Zero-PII developer console telemetry in non-production
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Telemetry] ${eventName}`, properties);
    }
  }
}

export function trackPageView(url) {
  if (!isAnalyticsAllowed()) return;

  if (typeof window !== "undefined") {
    if (window.gtag) {
      window.gtag("config", process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      });
    }
    if (window.plausible) {
      window.plausible("pageview", { u: url });
    }
  }
}
