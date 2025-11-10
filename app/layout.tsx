import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CAPACITOR - Voice Writing Companion',
  description: 'Store your thoughts. Release them stronger.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}

