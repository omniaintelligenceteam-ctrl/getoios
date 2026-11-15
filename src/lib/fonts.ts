import { Host_Grotesk } from 'next/font/google'

/**
 * The front door's face (public/jarvis/index.html loads the same family).
 * The header and footer of the Next pages carry it, so a visitor who goes
 * from the door to a legal page stays with one name in one face.
 */
export const hostGrotesk = Host_Grotesk({
  subsets: ['latin'],
  display: 'swap',
})
