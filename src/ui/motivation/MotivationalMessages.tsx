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
      <Card className='border-accent/20 bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 shadow-lg hover:shadow-xl transition-all duration-300'>
        <CardContent className='p-6'>
          <div className='flex items-start gap-4'>
            <QuoteIcon size='w-12 h-12' iconSize='w-6 h-6' />
            <div className='flex-1 space-y-3'>
              <p className='text-base font-medium leading-relaxed text-foreground italic'>
                &quot;{currentMessage}&quot;
              </p>
              <div className='flex items-start flex-col justify-center'>
                <StatusLabel label='Mensaje motivacional' />
                <ShuffleButton onClick={getRandomMessage} />
              </div>
            </div>
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
        className={`${size} rounded-full bg-gradient-to-br from-accent/20 to-accent/30 flex items-center justify-center border border-accent/30 ${glow ? 'shadow-lg' : ''}`}
      >
        <Quote className={`${iconSize} text-accent`} />
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
      variant='outline'
      size='sm'
      onClick={onClick}
      className='text-accent border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-200 cursor-pointer'
    >
      <Shuffle className='w-3 h-3 mr-2' />
      {label}
    </Button>
  )
}
