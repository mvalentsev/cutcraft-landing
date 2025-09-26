// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎬 CutCraft Landing Page loaded');

  // Add smooth animations
  const container = document.querySelector('.container');
  if (container) {
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';

    setTimeout(() => {
      container.style.transition = 'all 0.8s ease';
      container.style.opacity = '1';
      container.style.transform = 'translateY(0)';
    }, 100);
  }

  // Add click tracking for bot link
  const botLink = document.querySelector('.bot-link');
  if (botLink) {
    botLink.addEventListener('click', () => {
      console.log('🤖 Bot link clicked');

      // Add visual feedback
      botLink.style.transform = 'scale(0.95)';
      setTimeout(() => {
        botLink.style.transform = 'scale(1)';
      }, 150);
    });
  }

  // Add feature hover effects
  const features = document.querySelectorAll('.feature');
  features.forEach(feature => {
    feature.addEventListener('mouseenter', () => {
      feature.style.transform = 'translateY(-5px)';
    });

    feature.addEventListener('mouseleave', () => {
      feature.style.transform = 'translateY(0)';
    });
  });

  // Add parallax effect on scroll (subtle)
  let ticking = false;
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.container');

    if (parallax) {
      const speed = scrolled * 0.1;
      parallax.style.transform = `translateY(${speed}px)`;
    }

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick);
});

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Register service worker when available
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => console.log('SW registered'))
    //   .catch(error => console.log('SW registration failed'));
  });
}