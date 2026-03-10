import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Set default ease for all GSAP animations
gsap.defaults({
  ease: 'power2.out',
})

export { gsap, ScrollTrigger }
