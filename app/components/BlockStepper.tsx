'use client'

import { useState, useRef, useEffect } from 'react'

type Block = {
  id: string
  imageId: string
  text: string
  questionsId?: string | null
}

export default function BlockStepper({ blocks }: { blocks: Block[] }) {
  const [visibleCount, setVisibleCount] = useState(1)
  
  // Массив ссылок на DOM-элементы блоков
  const blockRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Если добавился новый блок (не первый)
    if (visibleCount > 1) {
      const lastBlockIndex = visibleCount - 1
      const lastBlock = blockRefs.current[lastBlockIndex]
      
      if (lastBlock) {
        // Прокручиваем так, чтобы блок оказался ровно по центру экрана
        lastBlock.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }
    }
  }, [visibleCount])

  if (!blocks || blocks.length === 0) {
    return <p className="text-gray-500 mt-10 text-lg">Блоков пока нет.</p>
  }

  const visibleBlocks = blocks.slice(0, visibleCount)
  const hasMore = visibleCount < blocks.length

  const handleNext = () => {
    setVisibleCount((prev) => prev + 1)
  }

  return (
    <div className="flex flex-col items-center w-full max-w-[700px] px-[14px] py-[18px] gap-12">
      
      {visibleBlocks.map((b, index) => (
        <div 
          key={b.id} 
          ref={(el) => { blockRefs.current[index] = el }}
          className="w-full rounded-2xl flex flex-col gap-3 items-center scroll-my-10 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
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
          onClick={handleNext}
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