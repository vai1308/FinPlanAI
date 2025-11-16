// app/layout.js
import './globals.css'
import NavBar from './components/NavBar'

export const metadata = {
  title: 'FinPlanAI',
  description: 'AI Personal Finance App'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  )
}
