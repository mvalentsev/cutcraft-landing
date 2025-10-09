import './main.css'

// Log version for debugging
console.log(`CutCraft Landing ${__APP_VERSION__}`)

// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    { threshold: 0.2 }
  )

  // Observe all sections
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section)
  })

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    })
  })

  // Visual feedback for CTA buttons
  const ctaButtons = document.querySelectorAll('.cta-button')
  ctaButtons.forEach(button => {
    button.addEventListener('click', () => {
      button.style.transform = 'scale(0.95)'
      setTimeout(() => {
        button.style.transform = ''
      }, 150)
    })
  })

  // Stagger animation for feature cards
  const featureCards = document.querySelectorAll('.feature-card')
  featureCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`
  })
})
