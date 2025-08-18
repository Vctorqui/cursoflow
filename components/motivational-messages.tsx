'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Quote, Shuffle } from 'lucide-react'

const DEFAULT_MESSAGES = [
  '¡Vamos, hoy es otro paso hacia tu meta mi amor! 🚀',
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
  showCustomization?: boolean
  compact?: boolean
}

export function MotivationalMessages({
  onMessageSelect,
  compact = false,
}: MotivationalMessagesProps) {
  const [messages, setMessages] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cursoflow-motivational-messages')
      return saved ? JSON.parse(saved) : DEFAULT_MESSAGES
    }
    return DEFAULT_MESSAGES
  })

  const [currentMessage, setCurrentMessage] = useState('')

  useEffect(() => {
    if (messages.length > 0) {
      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)]
      setCurrentMessage(randomMessage)
    }
  }, [messages])

  useEffect(() => {
    localStorage.setItem(
      'cursoflow-motivational-messages',
      JSON.stringify(messages)
    )
  }, [messages])

  const getRandomMessage = () => {
    if (messages.length > 0) {
      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)]
      setCurrentMessage(randomMessage)
      onMessageSelect?.(randomMessage)
    }
  }

  if (compact) {
    return (
      <Card className='border-accent/20 bg-accent/5'>
        <CardContent className='p-4'>
          <div className='flex items-start gap-3'>
            <Quote className='w-5 h-5 text-accent mt-1 flex-shrink-0' />
            <div className='flex-1'>
              <p className='text-sm font-medium  leading-relaxed'>
                {currentMessage}
              </p>
              <Button
                variant='ghost'
                size='sm'
                onClick={getRandomMessage}
                className='mt-2 h-auto p-1 text-xs text-muted-foreground hover:text-accent-foreground transition-colors duration-200'
              >
                <Shuffle className='w-3 h-3 mr-1' />
                Otro mensaje
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Current Message Display */}
      <Card className='border-accent/20 bg-accent/5'>
        <CardContent className='p-6'>
          <div className='flex items-start gap-4'>
            <Quote className='w-6 h-6 text-accent mt-1 flex-shrink-0' />
            <div className='flex-1'>
              <p className='text-lg font-medium leading-relaxed'>
                {currentMessage}
              </p>
              <Button
                variant='ghost'
                size='sm'
                onClick={getRandomMessage}
                className='mt-3 text-accent hover:text-accent-foreground transition-colors duration-200'
              >
                <Shuffle className='w-4 h-4 mr-2' />
                Nuevo mensaje
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
