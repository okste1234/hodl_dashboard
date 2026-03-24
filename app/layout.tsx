import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

import './globals.css'
import { Providers } from './providers'

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: 'Hodl Admin Dashboard',
  description: 'Admin dashboard for managing Hodl platform - wallets, vaults, loans, transactions, and users.',
  icons: {
    icon: [
      {
        url: '/logos/App_Icon.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logos/App_Icon.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logos/HODL_Primary_BlockBlue.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logos/hodl.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${_inter.variable} ${_jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
