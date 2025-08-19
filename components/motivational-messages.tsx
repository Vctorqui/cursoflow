'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  showCustomization?: boolean
  compact?: boolean
}

export function MotivationalMessages({
  onMessageSelect,
  compact = false,
}: MotivationalMessagesProps) {
  const [messages, setMessages] = useState<string[]>(DEFAULT_MESSAGES)
  const [currentMessage, setCurrentMessage] = useState('')
  const [showCustomization, setShowCustomization] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Handle hydration safely
  useEffect(() => {
    setIsMounted(true)
    const saved = localStorage.getItem('cursoflow-motivational-messages')
    if (saved) {
      try {
        const parsedMessages = JSON.parse(saved)
        setMessages(parsedMessages)
      } catch (error) {
        console.log('Error loading motivational messages:', error)
      }
    }
  }, [])

  useEffect(() => {
    if (isMounted && messages.length > 0) {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      setCurrentMessage(randomMessage)
    }
  }, [messages, isMounted])

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('cursoflow-motivational-messages', JSON.stringify(messages))
    }
  }, [messages, isMounted])

  const getRandomMessage = () => {
    if (messages.length > 0) {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      setCurrentMessage(randomMessage)
      onMessageSelect?.(randomMessage)
    }
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return (
      <Card className='border-accent/20 bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 shadow-lg'>
        <CardContent className='p-6'>
          <div className='flex items-start gap-4'>
            <div className='flex-shrink-0'>
              <div className='w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/30 flex items-center justify-center border border-accent/30'>
                <Quote className='w-6 h-6 text-accent' />
              </div>
            </div>
            <div className='flex-1 space-y-3'>
              <div className='h-4 bg-muted rounded animate-pulse'></div>
              <div className='h-3 bg-muted rounded animate-pulse w-2/3'></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (compact) {
    return (
      <Card className='border-accent/20 bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 shadow-lg hover:shadow-xl transition-all duration-300'>
        <CardContent className='p-6'>
          <div className='flex items-start gap-4'>
            <div className='flex-shrink-0'>
              <div className='w-12 h-12 rounded-full bg-gradient-to-br from-accent/20 to-accent/30 flex items-center justify-center border border-accent/30'>
                <Quote className='w-6 h-6 text-accent' />
              </div>
            </div>
            <div className='flex-1 space-y-3'>
              <p className='text-base font-medium leading-relaxed text-foreground italic'>
              &quot;{currentMessage}&quot;
              </p>
              <div className='flex items-start flex-col justify-center'>
                <div className='flex items-center gap-2 text-xs text-muted-foreground mb-2'>
                  <div className='w-2 h-2 rounded-full bg-accent/40 animate-pulse'></div>
                  <span>Mensaje motivacional</span>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={getRandomMessage}
                  className='text-accent border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-200 cursor-pointer'
                >
                  <Shuffle className='w-3 h-3 mr-2' />
                  Otro mensaje
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Current Message Display */}
      <Card className='border-accent/20 bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 shadow-lg'>
        <CardContent className='p-8'>
          <div className='flex items-start gap-6'>
            <div className='flex-shrink-0'>
              <div className='w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/30 flex items-center justify-center border border-accent/30 shadow-lg'>
                <Quote className='w-8 h-8 text-accent' />
              </div>
            </div>
            <div className='flex-1 space-y-4'>
              <div className='space-y-2'>
                <p className='text-xl font-medium leading-relaxed text-foreground italic'>
                  &quot;{currentMessage}&quot;
                </p>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <div className='w-2 h-2 rounded-full bg-accent/40 animate-pulse'></div>
                  <span>Mensaje motivacional del día</span>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={getRandomMessage}
                  className='text-accent border-accent/30 hover:bg-accent/10 hover:border-accent/50 transition-all duration-200 cursor-pointer'
                >
                  <Shuffle className='w-4 h-4 mr-2' />
                  Nuevo mensaje
                </Button>
                {/* <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowCustomization(!showCustomization)}
                  className='text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-200'
                >
                  <span className='text-xs'>Personalizar</span>
                </Button> */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customization Section */}
      {showCustomization && (
        <Card className='border-accent/20 bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5'>
          <CardContent className='p-6'>
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center'>
                  <span className='text-accent text-sm'>✨</span>
                </div>
                <div>
                  <h3 className='font-medium text-foreground'>Personalizar Mensajes</h3>
                  <p className='text-sm text-muted-foreground'>Añade tus propios mensajes motivacionales</p>
                </div>
              </div>
              
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-foreground'>Nuevo mensaje</label>
                  <textarea
                    className='w-full p-3 text-sm border border-border rounded-md bg-background resize-none'
                    placeholder='Escribe tu mensaje motivacional aquí...'
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        // Add message logic here
                        e.preventDefault()
                      }
                    }}
                  />
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-foreground'>Mensajes guardados</label>
                  <div className='max-h-32 overflow-y-auto space-y-2'>
                    {messages.slice(0, 5).map((message, index) => (
                      <div key={index} className='text-xs text-muted-foreground p-2 bg-background/50 rounded border'>
                        {message.length > 50 ? `${message.substring(0, 50)}...` : message}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className='flex gap-2 pt-2'>
                <Button
                  size='sm'
                  className='bg-accent hover:bg-accent/90 text-accent-foreground'
                >
                  Añadir Mensaje
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setShowCustomization(false)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
