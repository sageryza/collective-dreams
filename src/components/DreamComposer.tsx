'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'

type DreamComposerProps = {
  onDreamPosted: () => void
}

export function DreamComposer({ onDreamPosted }: DreamComposerProps) {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !content.trim() || loading) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('dreams')
        .insert({
          content: content.trim(),
          user_id: user.id,
        })

      if (!error) {
        setContent('')
        onDreamPosted()
      }
    } catch (error) {
      console.error('Error posting dream:', error)
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-200 text-center">
        <p className="text-gray-600 italic">
          Sign in to share your dreams with the collective...
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-200">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your dream with the collective..."
          className="w-full p-4 border border-purple-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white/70"
          style={{ fontFamily: 'Courier New, monospace' }}
          rows={4}
        />

        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">
            {content.length} characters
          </span>

          <button
            type="submit"
            disabled={!content.trim() || loading}
            className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
            <span>{loading ? 'Releasing...' : 'Release into Dreamscape'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}