'use client'

import { useState } from 'react'
import { Heart, MessageCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'

type DreamCardProps = {
  dream: {
    id: string
    content: string
    hearts: Array<{ id: string }>
    comments: Array<{ id: string }>
  }
  onComment: (dreamId: string) => void
}

export function DreamCard({ dream, onComment }: DreamCardProps) {
  const { user } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [hearted, setHearted] = useState(false)
  const [heartCount, setHeartCount] = useState(dream.hearts.length)
  const [loading, setLoading] = useState(false)

  const shouldTruncate = dream.content.length > 300
  const displayContent = isExpanded || !shouldTruncate
    ? dream.content
    : dream.content.substring(0, 300) + '...'

  const handleHeart = async () => {
    if (!user || loading) return

    setLoading(true)
    try {
      if (hearted) {
        const { error } = await supabase
          .from('hearts')
          .delete()
          .eq('dream_id', dream.id)
          .eq('user_id', user.id)

        if (!error) {
          setHearted(false)
          setHeartCount(prev => prev - 1)
        }
      } else {
        const { error } = await supabase
          .from('hearts')
          .insert({ dream_id: dream.id, user_id: user.id })

        if (!error) {
          setHearted(true)
          setHeartCount(prev => prev + 1)
        }
      }
    } catch (error) {
      console.error('Error toggling heart:', error)
    }
    setLoading(false)
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-200">
      <div className="mb-4">
        <p
          className="text-black leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: 'Courier New, monospace' }}
        >
          {displayContent}
        </p>

        {shouldTruncate && !isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-purple-600 hover:text-purple-700 text-sm mt-2 font-medium"
          >
            See more...
          </button>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-purple-200">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleHeart}
            disabled={!user || loading}
            className={`flex items-center space-x-2 transition-colors ${
              hearted
                ? 'text-red-500'
                : 'text-gray-500 hover:text-red-500'
            } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart
              size={20}
              fill={hearted ? 'currentColor' : 'none'}
            />
            <span className="text-sm">{heartCount}</span>
          </button>

          <button
            onClick={() => onComment(dream.id)}
            disabled={!user}
            className={`flex items-center space-x-2 text-gray-500 hover:text-purple-600 transition-colors ${
              !user ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <MessageCircle size={20} />
            <span className="text-sm">{dream.comments.length}</span>
          </button>
        </div>

        {!user && (
          <span className="text-xs text-gray-400 italic">
            Sign in to interact
          </span>
        )}
      </div>
    </div>
  )
}