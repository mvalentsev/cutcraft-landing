import './main.css'

// Log version for debugging
console.log(`CutCraft Landing ${__APP_VERSION__}`)

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            // Stop observing once visible (performance optimization)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px' // Trigger animations 50px before element is visible
      }
    )

    // Observe all sections (skip if reduced motion preferred)
    if (!prefersReducedMotion) {
      document.querySelectorAll('section').forEach(section => {
        observer.observe(section)
      })
    } else {
      // Immediately show all sections if animations disabled
      document.querySelectorAll('section').forEach(section => {
        section.classList.add('visible')
      })
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const href = this.getAttribute('href')
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
            block: 'start'
          })
        }
      })
    })
  } catch (error) {
    // Graceful degradation: if JS fails, content is still visible
    console.error('Landing page initialization error:', error)
    // Ensure all sections are visible even if observer fails
    document.querySelectorAll('section').forEach(section => {
      section.classList.add('visible')
    })
  }
})
