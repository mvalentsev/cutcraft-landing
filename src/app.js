import './main.css';

// Modern 2025: Version logging (dev mode only)
// eslint-disable-next-line no-undef -- __APP_VERSION__ is replaced by Vite build plugin at build time
if (import.meta.env.DEV) {
  console.log('CutCraft Landing (dev mode)');
} else {
  try {
    // __APP_VERSION__ is only available in production builds
    console.log(`CutCraft Landing ${__APP_VERSION__}`);
  } catch {
    // Fallback if build fails to inject version
  }
}

// Modern 2025: Web Vitals tracking with analytics integration
function reportWebVitals() {
  // Track Core Web Vitals with proper metric reporting
  if ('PerformanceObserver' in window) {
    try {
      const sendToAnalytics = (metricName, metricValue) => {
        // Track metric with Performance API
        performance.mark(`${metricName}-tracked`, { detail: metricValue });

        // TODO: Send to analytics service (Google Analytics 4, Plausible, etc.)
        // if (window.gtag) {
        //   window.gtag('event', metricName, { value: Math.round(metricValue) });
        // }
        // if (window.plausible) {
        //   window.plausible('Web Vital', { props: { metric: metricName, value: Math.round(metricValue) } });
        // }

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
      const inpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration) {
            sendToAnalytics('INP', entry.duration);
          }
        }
      });
      inpObserver.observe({ type: 'event', buffered: true, durationThreshold: 40 });
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
    // Send to error tracking service (Sentry, etc.)
    // if (window.Sentry) {
    //   window.Sentry.captureException(error);
    // }
    return fallbackFn ? fallbackFn() : null;
  }
}

// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
  performance.mark('app-init-start');

  withErrorBoundary(() => {
    // Feature detection for IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all sections immediately
      document.querySelectorAll('section').forEach(section => {
        section.classList.add('visible');
      });
      performance.mark('app-init-end');
      return;
    }

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            performance.mark('section-visible', { detail: entry.target.id });
            // Stop observing once visible (performance optimization)
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px', // Trigger animations 50px before element is visible
        signal: appAbortController.signal // Modern 2025: AbortController integration
      }
    );

    // Observe all sections (skip if reduced motion preferred)
    if (!prefersReducedMotion) {
      document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
      });
    } else {
      // Immediately show all sections if animations disabled
      document.querySelectorAll('section').forEach(section => {
        section.classList.add('visible');
      });
    }

    // Smooth scroll for anchor links with View Transitions API support
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      // Modern 2025: Use AbortController signal for event cleanup
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (target) {
          performance.mark('smooth-scroll', { detail: href });

          // Use View Transitions API if available (Chrome 111+, Edge 111+)
          if (document.startViewTransition && !prefersReducedMotion) {
            document.startViewTransition(() => {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            });
          } else {
            target.scrollIntoView({
              behavior: prefersReducedMotion ? 'auto' : 'smooth',
              block: 'start',
            });
          }
        }
      }, { signal: appAbortController.signal }); // Modern 2025: AbortController cleanup
    });

    performance.mark('app-init-end');

    // Track Web Vitals
    reportWebVitals();
  }, () => {
    // Modern 2025: Fallback if initialization fails
    if (import.meta.env.DEV) {
      console.error('Landing page initialization failed, using fallback');
    }
    // Ensure all sections are visible even if observer fails
    document.querySelectorAll('section').forEach(section => {
      section.classList.add('visible');
    });
    performance.mark('app-init-error');
  });
});

// Modern 2025: Cleanup on page unload
window.addEventListener('beforeunload', () => {
  // Abort all ongoing operations
  appAbortController.abort();
}, { once: true });
