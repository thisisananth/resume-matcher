import './globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Link from 'next/link'

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

export const metadata = {
  title: 'Resume Matcher',
  description: 'Match your resume with startup opportunities',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.className} min-h-screen bg-gradient-to-br from-blue-100 via-sky-50 to-emerald-50`}>
        <nav className="bg-white shadow-lg border-b border-gray-100">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Startup Job Explorer
                </span>
              </Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
