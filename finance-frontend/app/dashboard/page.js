'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Legend
} from 'recharts'

export default function DashboardPage() {
  const [transactions, setTransactions] = useState([])
  const [totals, setTotals] = useState({ income: 0, expense: 0 })
  const [advice, setAdvice] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }

    ; (async () => {
      try {
        const res = await fetch('https://finplanai.onrender.com/api/transactions/', {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (res.status === 401) {
          localStorage.removeItem('access_token')
          router.push('/login')
          return
        }

        const data = await res.json()
        const tx = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : []

        setTransactions(tx)

        const income = tx.reduce(
          (sum, t) => sum + (parseFloat(t.amount) || 0) * (t.type === 'Income' ? 1 : 0),
          0
        )
        const expense = tx.reduce(
          (sum, t) => sum + (parseFloat(t.amount) || 0) * (t.type === 'Expense' ? 1 : 0),
          0
        )
        setTotals({ income, expense })
      } catch (err) {
        console.error('Failed loading transactions', err)
        setTransactions([])
        setTotals({ income: 0, expense: 0 })
      }
    })()
  }, [router])

  async function getAIAdvice() {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }
    try {
      const res = await fetch('https://finplanai.onrender.com/api/ai/advice/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!res.ok) {
        console.error('AI advice request failed', res.status)
        setAdvice('No advice available')
        return
      }
      const data = await res.json()
      setAdvice(data.advice || 'No advice available')
    } catch (err) {
      console.error(err)
      setAdvice('No advice available')
    }
  }

  // ------------------- 📊 Chart Data Processing -------------------
  const expenseData = Object.values(
    transactions
      .filter(t => t.type === 'Expense')
      .reduce((acc, cur) => {
        acc[cur.category] = acc[cur.category] || { name: cur.category, value: 0 }
        acc[cur.category].value += parseFloat(cur.amount) || 0
        return acc
      }, {})
  )

  const trendData = Object.values(
    transactions.reduce((acc, cur) => {
      const date = cur.date.slice(0, 7) // YYYY-MM
      if (!acc[date]) acc[date] = { month: date, Income: 0, Expense: 0 }
      acc[date][cur.type] += parseFloat(cur.amount) || 0
      return acc
    }, {})
  )

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6F91']

  // ------------------- 💡 UI -------------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Top Bar */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={() => {
            router.push('/add')
          }}
        >
          Add
        </button>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm">Income</h3>
          <p className="text-xl font-bold text-green-600">
            ₹{totals.income.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm">Expense</h3>
          <p className="text-xl font-bold text-red-600">
            ₹{totals.expense.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm">Net</h3>
          <p className="text-xl font-bold">
            ₹{(totals.income - totals.expense).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Expense Breakdown */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg mb-3">Expense Breakdown</h2>
          {expenseData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={expenseData}
                  animationDuration={800}
                  animationBegin={100}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm">No expense data available.</p>
          )}
        </div>

        {/* Income vs Expense Trend */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg mb-3">Income vs Expense (Monthly)</h2>
          {trendData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Income" fill="#00C49F" />
                <Bar dataKey="Expense" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-sm">No transaction data yet.</p>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg mb-2">Recent Transactions</h2>
        <ul>
          {transactions.slice(0, 5).map(t => (
            <li key={t.id} className="border-b py-2 flex justify-between">
              <span>{t.date} - {t.category}</span>
              <span
                className={t.type === 'Expense' ? 'text-red-600' : 'text-green-600'}
              >
                ₹{parseFloat(t.amount || 0).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* AI Advice */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg mb-3">AI Insights</h2>
        <button
          onClick={getAIAdvice}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Get Advice
        </button>
        {advice && (
          <div className="mt-4 bg-yellow-50 border p-3 rounded">
            <pre className="whitespace-pre-wrap">{advice}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
