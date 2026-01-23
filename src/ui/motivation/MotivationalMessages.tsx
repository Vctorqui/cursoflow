'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/src/ui/common/ui/card'
import { Button } from '@/src/ui/common/ui/button'
import { Quote, Shuffle } from 'lucide-react'

const DEFAULT_MESSAGES = [
  '¡Vamos, hoy es otro paso hacia tu meta! 🚀',
  'El conocimiento es poder, y tú estás construyendo el tuyo. 💡',
  'Cada minuto de estudio te acerca más a tus sueños. 🌟',
  'La constancia es la clave del éxito. ¡Sigue adelante! 💪',
  'Tu futuro yo te agradecerá el esfuerzo de hoy. 💖',
  'No hay atajos hacia ningún lugar que valga la pena ir. 💡',
  'El aprendizaje nunca agota la mente. ¡Continúa! 💡',
  'Eres más fuerte de lo que crees y más capaz de lo que imaginas. 💪',
  'Cada sesión de estudio es una inversión en ti mismo. 💪',
  'La disciplina es el puente entre metas y logros. 💪',
  '¡Hoy es un gran día para aprender algo nuevo! 💡',
  'Tu dedicación de hoy será tu éxito de mañana. 💪',
  'El progreso, no la perfección, es lo que importa. 💡',
  'Confía en el proceso y disfruta el viaje del aprendizaje. 💡',
  '¡Estás creando la versión más inteligente de ti mismo! 💪',
  'La mente es como un paracaídas, solo funciona cuando está abierta. 🧠',
  'Cada error es una oportunidad de aprender algo nuevo. 📚',
  'El éxito no es final, el fracaso no es fatal: lo que cuenta es el coraje para continuar. 🎯',
  'Tu actitud determina tu altitud en el aprendizaje. ✨',
  'El tiempo que dedicas a estudiar es tiempo que inviertes en tu futuro brillante. ⏰',
  'La curiosidad es la chispa que enciende la llama del conocimiento. 🔥',
  'Cada día es una nueva oportunidad para ser mejor que ayer. 🌅',
  'El aprendizaje es un tesoro que te acompañará toda la vida. 💎',
  'La perseverancia convierte los sueños imposibles en realidades alcanzables. 🌈',
  'Tu potencial es ilimitado, solo necesitas creer en ti mismo. ⭐',
  'El conocimiento es la mejor inversión que puedes hacer en ti mismo. 📈',
]

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

function LoadingSkeleton() {
  return (
    <Card className='border-accent/20 bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 shadow-lg'>
      <CardContent className='p-6'>
        <div className='flex items-start gap-4'>
          <div className='w-12 h-12 rounded-full bg-muted animate-pulse' />
          <div className='flex-1 space-y-3'>
            <div className='h-4 bg-muted rounded animate-pulse' />
            <div className='h-3 bg-muted rounded animate-pulse w-2/3' />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function QuoteIcon({
  size,
  iconSize,
  glow = false,
}: {
  size: string
  iconSize: string
  glow?: boolean
}) {
  return (
    <div className='flex-shrink-0'>
      <div
        className={`${size} rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm shadow-xl`}
      >
        <Quote className={`${iconSize} text-white`} />
      </div>
    </div>
  )
}

function StatusLabel({ label }: { label: string }) {
  return (
    <div className='flex items-center gap-2 text-xs text-muted-foreground mb-2'>
      <div className='w-2 h-2 rounded-full bg-accent/40 animate-pulse' />
      <span>{label}</span>
    </div>
  )
}

function ShuffleButton({
  onClick,
  label = 'Otro mensaje',
}: {
  onClick: () => void
  label?: string
}) {
  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={onClick}
      className='bg-white/10 hover:bg-white/20 border-white/10 text-white rounded-2xl px-6 h-12 transition-all duration-300 backdrop-blur-md gap-3'
    >
      <Shuffle className='w-4 h-4' />
      <span className='font-medium'>{label}</span>
    </Button>
  )
}
