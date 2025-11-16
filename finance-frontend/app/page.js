'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [isClient, setIsClient] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const token = localStorage.getItem('access_token')
    setLoggedIn(!!token)
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-18 flex flex-col">

      <main className="flex-1 flex flex-col items-center pb-18 justify-center text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl sm:text-6xl font-extrabold text-gray-800 mb-6"
        >
          Manage Your Money Smarter with <span className="text-blue-600">AI</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-8"
        >
          FinPlanAI helps you track income and expenses, set budgets, and get instant
          AI-powered financial advice — all in one simple dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href={!loggedIn ? "/register" : "/dashboard"}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          {!loggedIn && <Link
            href="/login"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-50 transition"
          >
            Login
          </Link>}
        </motion.div>
      </main>

      {/* FEATURES SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-semibold mb-8 text-gray-800">Why FinPlanAI?</h3>

          <div className="grid sm:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-xl shadow-md border bg-blue-50"
            >
              <h4 className="font-bold text-xl mb-2 text-blue-700">Expense Tracking</h4>
              <p className="text-gray-600 text-sm">
                Easily log all your income and spending to visualize where your money goes.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-xl shadow-md border bg-blue-50"
            >
              <h4 className="font-bold text-xl mb-2 text-blue-700">Budget Planning</h4>
              <p className="text-gray-600 text-sm">
                Set monthly budgets, stay within limits, and track performance in real-time.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-xl shadow-md border bg-blue-50"
            >
              <h4 className="font-bold text-xl mb-2 text-blue-700">AI Insights</h4>
              <p className="text-gray-600 text-sm">
                Receive intelligent, personalized financial tips to help you save more.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-blue-700 text-white py-6 text-center text-sm">
        <p>© {new Date().getFullYear()} FinPlanAI — AI-powered personal finance platform.</p>
      </footer>
    </div>
  )
}
