'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/AuthProvider'

export default function DebugPage() {
  const { user } = useAuth()
  const [dbStatus, setDbStatus] = useState('Testing...')
  const [tables, setTables] = useState<any[]>([])

  useEffect(() => {
    testDatabase()
  }, [])

  const testDatabase = async () => {
    try {
      // Test basic connection
      const { data, error } = await supabase.from('dreams').select('count').limit(1)

      if (error) {
        setDbStatus(`Database Error: ${error.message}`)
      } else {
        setDbStatus('Database connection successful!')
      }

      // Try to get some dreams
      const { data: dreams, error: dreamsError } = await supabase
        .from('dreams')
        .select('*')
        .limit(5)

      if (dreams) {
        setTables(dreams)
      }
    } catch (err) {
      setDbStatus(`Connection failed: ${err}`)
    }
  }

  const testInsert = async () => {
    if (!user) {
      alert('Please sign in first')
      return
    }

    try {
      const { data, error } = await supabase
        .from('dreams')
        .insert({
          content: 'Test dream from debug page',
          user_id: user.id,
        })
        .select()

      if (error) {
        alert(`Insert failed: ${error.message}`)
      } else {
        alert('Test dream inserted successfully!')
        testDatabase() // Refresh
      }
    } catch (err) {
      alert(`Insert error: ${err}`)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Debug Page</h1>

      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">User Status</h2>
          <p>{user ? `Logged in as: ${user.email}` : 'Not logged in'}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Database Status</h2>
          <p>{dbStatus}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Dreams in Database</h2>
          <p>Found {tables.length} dreams</p>
          {tables.map((dream, i) => (
            <div key={i} className="mt-2 p-2 bg-white rounded">
              <p className="text-sm">{dream.content}</p>
            </div>
          ))}
        </div>

        <button
          onClick={testInsert}
          disabled={!user}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Insert Dream
        </button>
      </div>
    </div>
  )
}