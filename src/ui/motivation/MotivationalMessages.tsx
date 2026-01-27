'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/src/ui/common/ui/card'
import { DEFAULT_MESSAGES } from './constants'
import { QuoteIcon } from './fragments/QuoteIcon'
import { StatusLabel } from './fragments/StatusLabel'
import { ShuffleButton } from './fragments/ShuffleButton'
import { LoadingSkeleton } from './fragments/LoadingSkeleton'

interface MotivationalMessagesProps {
  onMessageSelect?: (message: string) => void
  compact?: boolean
}

export function MotivationalMessages({
  onMessageSelect,
  compact = false,
}: MotivationalMessagesProps) {
  const [messages, setMessages] = useState<string[]>(DEFAULT_MESSAGES)
  const [currentMessage, setCurrentMessage] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const saved = localStorage.getItem('cursoflow-motivational-messages')
    if (saved) {
      try {
        setMessages(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading motivational messages:', error)
      }
    }
  }, [])

  useEffect(() => {
    if (!isMounted || messages.length === 0) return

    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    setCurrentMessage(randomMessage)
  }, [messages, isMounted])

  const getRandomMessage = () => {
    if (messages.length === 0) return

    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    setCurrentMessage(randomMessage)
    onMessageSelect?.(randomMessage)
  }

  if (!isMounted) return <LoadingSkeleton />

  if (compact) {
    return (
      <Card className='border-none bg-gradient-to-r from-[#2d0b5e] via-[#4a148c] to-[#2d0b5e] shadow-2xl relative overflow-hidden'>
        <div className='absolute inset-0 bg-black/20' />
        <CardContent className='p-8 relative z-10'>
          <div className='flex items-center gap-6'>
            <QuoteIcon size='w-14 h-14' iconSize='w-7 h-7' />
            <div className='flex-1 space-y-4'>
              <div className='space-y-1'>
                <p className='text-3xl font-serif font-medium leading-tight text-white italic'>
                  &quot;{currentMessage}&quot;
                </p>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 rounded-full bg-pink-500 animate-pulse' />
                  <span className='text-[10px] text-pink-200/70 uppercase tracking-widest font-bold'>
                    Mensaje Motivacional
                  </span>
                </div>
              </div>
            </div>
            <ShuffleButton onClick={getRandomMessage} />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      <Card className='border-accent/20 bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 shadow-lg'>
        <CardContent className='p-8'>
          <div className='flex items-start gap-6'>
            <QuoteIcon size='w-16 h-16' iconSize='w-8 h-8' glow />
            <div className='flex-1 space-y-4'>
              <div className='space-y-2'>
                <p className='text-xl font-medium leading-relaxed text-foreground italic'>
                  &quot;{currentMessage}&quot;
                </p>
                <StatusLabel label='Mensaje motivacional del día' />
              </div>
              <ShuffleButton onClick={getRandomMessage} label='Nuevo mensaje' />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
