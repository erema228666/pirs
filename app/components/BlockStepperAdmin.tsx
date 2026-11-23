'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type Block = {
  id: string
  imageId: string
  text: string
  questionsId?: string | null
}

export default function BlockStepperAdmin({ blocks }: { blocks: Block[] }) {
  const [visibleCount, setVisibleCount] = useState(1)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  
  const blockRefs = useRef<(HTMLDivElement | null)[]>([])
  const router = useRouter()

  useEffect(() => {
    if (visibleCount > 1) {
      const lastBlockIndex = visibleCount - 1
      const lastBlock = blockRefs.current[lastBlockIndex]
      if (lastBlock) {
        lastBlock.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [visibleCount])

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот блок?')) return

    setIsDeleting(id)

    try {
      const res = await fetch(`/api/blocks/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `Ошибка сервера: ${res.status}`)
      }

      router.refresh()
      
      setVisibleCount((prev) => Math.max(1, Math.min(prev, blocks.length - 1)))

    } catch (error: any) {
      console.error(error)
      alert(`Не удалось удалить: ${error.message}`)
    } finally {
      setIsDeleting(null)
    }
  }

  if (!blocks || blocks.length === 0) {
    return <p className="text-white mt-10 text-lg">Блоков пока нет.</p>
  }

  const visibleBlocks = blocks.slice(0, visibleCount)
  const hasMore = visibleCount < blocks.length

  return (
    <div className="flex flex-col items-center w-full max-w-[700px] px-[14px] py-[18px] gap-12">
      
      {visibleBlocks.map((b, index) => (
        <div 
          key={b.id} 
          ref={(el) => { blockRefs.current[index] = el }}
          className="relative w-full rounded-2xl flex flex-col gap-3 items-center scroll-my-10 group"
        >
          <button
            onClick={() => handleDelete(b.id)}
            disabled={isDeleting === b.id}
            className="absolute top-4 right-4 z-10 p-3 bg-red-600/90 hover:bg-red-700 text-white rounded-full transition-all disabled:opacity-50 shadow-md"
            title="Удалить блок"
          >
            {isDeleting === b.id ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>

          <div className="relative w-full rounded-4xl overflow-hidden bg-gray-100 shadow-lg">
            <img
              src={`http://localhost:9000/pirs/${b.imageId}`}
              className="h-full w-full object-cover"
              loading="lazy"
              alt={b.text || 'Изображение блока'}
            />
          </div>

          <p className="text-lg text-center text-white">{b.text}</p>

          {b.questionsId && (
            <p className="text-sm text-gray-400">
              Вопрос: {b.questionsId}
            </p>
          )}
        </div>
      ))}

      {hasMore ? (
        <button
          onClick={() => setVisibleCount((prev) => prev + 1)}
          className="mt-4 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors cursor-pointer"
        >
          Далее
        </button>
      ) : (
        <div></div>
      )}
    </div>
  )
}