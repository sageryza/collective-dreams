'use client'

import { useState } from 'react'
import { AuthProvider } from '@/components/AuthProvider'
import { Header } from '@/components/Header'
import { DreamFeed } from '@/components/DreamFeed'
import { CommentModal } from '@/components/CommentModal'

export default function Home() {
  const [selectedDreamId, setSelectedDreamId] = useState<string | null>(null)

  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Header />
        <main>
          <DreamFeed onCommentClick={setSelectedDreamId} />
        </main>

        {selectedDreamId && (
          <CommentModal
            dreamId={selectedDreamId}
            onClose={() => setSelectedDreamId(null)}
          />
        )}
      </div>
    </AuthProvider>
  )
}
