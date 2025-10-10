import './main.css';

// Version logging
if (import.meta.env.DEV) {
  console.log('CutCraft Landing (dev mode)');
}

// Modern 2025: Web Vitals tracking
function reportWebVitals() {
  if ('PerformanceObserver' in window) {
    try {
      const sendToAnalytics = (metricName, metricValue) => {
        performance.mark(`${metricName}-tracked`, { detail: metricValue });

        if (import.meta.env.DEV) {
          console.log(`📊 ${metricName}:`, Math.round(metricValue), 'ms');
        }
      };

      // Cumulative Layout Shift (CLS) - lower is better, target < 0.1
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.hadRecentInput) continue;
          sendToAnalytics('CLS', entry.value * 1000);
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // Largest Contentful Paint (LCP) - target < 2.5s
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcpValue = lastEntry.renderTime || lastEntry.loadTime;
        sendToAnalytics('LCP', lcpValue);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // First Input Delay (FID) - target < 100ms
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidValue = entry.processingStart - entry.startTime;
          sendToAnalytics('FID', fidValue);
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // Modern 2025: Interaction to Next Paint (INP) - Chrome 96+ (widely available)
      // Track slow interactions (> 40ms) using Event Timing API
      if (PerformanceObserver.supportedEntryTypes.includes('event')) {
        const inpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            // INP measures interaction latency (input delay + processing + presentation)
            if (entry.duration && entry.interactionId) {
              sendToAnalytics('INP', entry.duration);
            }
          }
        });
        // Use 'event' type (correct API), durationThreshold filters slow interactions
        inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 40 });
      }
    } catch (error) {
      // Silent fail for Web Vitals tracking
      if (import.meta.env.DEV) {
        console.warn('Web Vitals tracking failed:', error);
      }
    }
  }
}

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Modern 2025: AbortController for proper cleanup
let appAbortController = new AbortController();

// Modern 2025: Error boundary wrapper
function withErrorBoundary(fn, fallbackFn) {
  try {
    return fn();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error boundary caught:', error);
    }
    return fallbackFn ? fallbackFn() : null;
  }
}

// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
  withErrorBoundary(() => {
    // Feature detection for IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all sections immediately
      document.querySelectorAll('section').forEach(section => {
        section.classList.add('visible');
      });
      return;
    }

    // Intersection Observer for scroll animations
    // Modern 2025: Use Intersection Observer v2 if available
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '50px', // Trigger animations 50px before element is visible
      signal: appAbortController.signal // Modern 2025: AbortController integration
    };

    // Add trackVisibility for Intersection Observer v2 (if supported)
    if ('trackVisibility' in IntersectionObserverEntry.prototype) {
      observerOptions.trackVisibility = true;
      observerOptions.delay = 100;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing once visible (performance optimization)
            observer.unobserve(entry.target);
          }
        });
      },
      observerOptions
    );

    // Observe all sections except hero (skip if reduced motion preferred)
    if (!prefersReducedMotion) {
      document.querySelectorAll('section:not(#hero)').forEach(section => {
        observer.observe(section);
      });
    } else {
      // Immediately show all sections if animations disabled
      document.querySelectorAll('section').forEach(section => {
        section.classList.add('visible');
      });
    }

    // Hero is always visible (critical for LCP)
    const heroSection = document.getElementById('hero');
    if (heroSection) {
      heroSection.classList.add('visible');
    }

    // Smooth scroll for anchor links with View Transitions API support
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      // Modern 2025: Use AbortController signal for event cleanup
      anchor.addEventListener('click', async function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
          // Use View Transitions API if available (Chrome 111+, Edge 111+)
          if (document.startViewTransition && !prefersReducedMotion) {
            await document.startViewTransition(() => {
              target.scrollIntoView({
                behavior: 'instant', // instant for smoother transitions
                block: 'start',
              });
            }).finished;
          } else {
            target.scrollIntoView({
              behavior: prefersReducedMotion ? 'auto' : 'smooth',
              block: 'start',
            });
          }
        }
      }, { signal: appAbortController.signal }); // Modern 2025: AbortController cleanup
    });

    // Modern 2025: Defer Web Vitals tracking to idle time
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => reportWebVitals(), { timeout: 2000 });
    } else {
      // Fallback: use setTimeout
      setTimeout(reportWebVitals, 1000);
    }
  }, () => {
    // Fallback: ensure all sections are visible if observer fails
    document.querySelectorAll('section').forEach(section => {
      section.classList.add('visible');
    });
  });
});

// Modern 2025: Cleanup on page unload
window.addEventListener('beforeunload', () => {
  // Abort all ongoing operations
  appAbortController.abort();
}, { once: true });

// Modern 2025: Register Service Worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        if (import.meta.env.DEV) {
          console.log('Service Worker registered:', registration.scope);
        }
      },
      (error) => {
        if (import.meta.env.DEV) {
          console.error('Service Worker registration failed:', error);
        }
      }
    );
  });
}
