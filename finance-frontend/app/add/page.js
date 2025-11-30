'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/utils/apis.js'

export default function AddPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    date: '',
    type: 'Expense',
    category: '',
    amount: '',
    description: ''
  })

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const res = await apiFetch('http://localhost:8000/', {
        method: 'POST',
        body: JSON.stringify(form)
      })

      if (res.ok) {
        alert('✅ Transaction added successfully!')
        router.push('/dashboard')
      } else {
        const data = await res.json()
        console.error('Error response:', data)
        alert('❌ Failed to add transaction. Please try again.')
      }
    } catch (err) {
      console.error('Network error:', err)
      alert('⚠️ Something went wrong. Please check your connection.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-96 space-y-3 border border-gray-100"
      >
        <h1 className="text-2xl font-semibold mb-4 text-center text-gray-700">Add Transaction</h1>

        <input
          type="date"
          required
          className="border w-full p-2 rounded"
          onChange={e => setForm({ ...form, date: e.target.value })}
        />

        <select
          className="border w-full p-2 rounded"
          onChange={e => setForm({ ...form, type: e.target.value })}
        >
          <option value="Expense">Expense</option>
          <option value="Income">Income</option>
        </select>

        <input
          type="text"
          placeholder="Category"
          required
          className="border w-full p-2 rounded"
          onChange={e => setForm({ ...form, category: e.target.value })}
        />

        <input
          type="number"
          placeholder="Amount"
          required
          className="border w-full p-2 rounded"
          onChange={e => setForm({ ...form, amount: e.target.value })}
        />

        <input
          type="text"
          placeholder="Description"
          className="border w-full p-2 rounded"
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add
        </button>
      </form>
    </div>
  )
}
