import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Millor Lei',
  description: 'Portfolio of Millor Lei'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className='bg-[#f2efe6]'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#f2efe6] text-zinc-900 antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
