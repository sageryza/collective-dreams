'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DreamCard } from './DreamCard'
import { DreamComposer } from './DreamComposer'

type Dream = {
  id: string
  content: string
  created_at: string
  hearts: Array<{ id: string }>
  comments: Array<{ id: string }>
}

type DreamFeedProps = {
  onCommentClick: (dreamId: string) => void
}

export function DreamFeed({ onCommentClick }: DreamFeedProps) {
  const [dreams, setDreams] = useState<Dream[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDreams = async () => {
    try {
      const { data, error } = await supabase
        .from('dreams')
        .select(`
          id,
          content,
          created_at,
          hearts (id),
          comments (id)
        `)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error

      setDreams(data || [])
    } catch (error) {
      console.error('Error fetching dreams:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDreams()
  }, [])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <DreamComposer onDreamPosted={fetchDreams} />

      {dreams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 italic text-lg">
            The dreamscape awaits your first dream...
          </p>
        </div>
      ) : (
        dreams.map((dream) => (
          <DreamCard
            key={dream.id}
            dream={dream}
            onComment={onCommentClick}
          />
        ))
      )}
    </div>
  )
}