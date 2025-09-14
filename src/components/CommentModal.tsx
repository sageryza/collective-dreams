'use client'

import { useCallback, useEffect, useState } from 'react'
import { X, Send, Heart } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'

type Comment = {
  id: string
  content: string
  created_at: string
  user_id: string
}

type CommentModalProps = {
  dreamId: string
  onClose: () => void
}

export function CommentModal({ dreamId, onClose }: CommentModalProps) {
  const { user } = useAuth()
  const [dream, setDream] = useState<{ id: string; content: string; hearts: Array<{ id: string }> } | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)

  const fetchDreamAndComments = useCallback(async () => {
    try {
      const [dreamResponse, commentsResponse] = await Promise.all([
        supabase
          .from('dreams')
          .select('*, hearts (id)')
          .eq('id', dreamId)
          .single(),
        supabase
          .from('comments')
          .select('*')
          .eq('dream_id', dreamId)
          .order('created_at', { ascending: true })
      ])

      if (dreamResponse.error) throw dreamResponse.error
      if (commentsResponse.error) throw commentsResponse.error

      setDream(dreamResponse.data)
      setComments(commentsResponse.data || [])
    } catch (error) {
      console.error('Error fetching dream and comments:', error)
    } finally {
      setLoading(false)
    }
  }, [dreamId])

  useEffect(() => {
    fetchDreamAndComments()
  }, [dreamId, fetchDreamAndComments])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim() || posting) return

    setPosting(true)
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          dream_id: dreamId,
          user_id: user.id,
          content: newComment.trim(),
        })
        .select()
        .single()

      if (error) throw error

      setComments(prev => [...prev, data])
      setNewComment('')
    } catch (error) {
      console.error('Error posting comment:', error)
    }
    setPosting(false)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-purple-800" style={{ fontFamily: 'cursive' }}>
            Dream Responses
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {dream && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p
                className="text-black leading-relaxed whitespace-pre-wrap"
                style={{ fontFamily: 'Courier New, monospace' }}
              >
                {dream.content}
              </p>
              <div className="flex items-center mt-3 pt-3 border-t border-purple-200">
                <Heart size={16} className="text-red-500 mr-1" />
                <span className="text-sm text-gray-600">{dream.hearts?.length || 0}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 italic py-8">
                No responses yet. Be the first to share your thoughts...
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 bg-gray-50 rounded-lg border"
                >
                  <p
                    className="text-black leading-relaxed whitespace-pre-wrap mb-2"
                    style={{ fontFamily: 'Courier New, monospace' }}
                  >
                    {comment.content}
                  </p>
                  <p className="text-xs text-gray-500 italic">
                    A dreamer responded
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {user && (
          <div className="p-6 border-t border-gray-200">
            <form onSubmit={handleSubmitComment}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts on this dream..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                style={{ fontFamily: 'Courier New, monospace' }}
                rows={3}
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={!newComment.trim() || posting}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                  <span>{posting ? 'Sending...' : 'Send Response'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {!user && (
          <div className="p-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 italic">
              Sign in to respond to this dream...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}