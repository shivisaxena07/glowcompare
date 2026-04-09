import { DM_Sans, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { AuthProvider } from '@/src/context/auth-context'
import { cn } from '@/lib/utils'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
})

export const metadata = {
  title: 'GlowCompare — Best prices for trending beauty',
  description:
    'Discover trending skincare and makeup. Compare prices across Nykaa, Tira, Amazon, Flipkart and Purplle.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn('antialiased', dmSans.variable, spaceGrotesk.variable)}>
      <body className="font-sans bg-stone-50">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
