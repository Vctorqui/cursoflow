'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/src/ui/common/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/ui/common/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/ui/common/ui/select'
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Check,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { MotivationalMessages } from '../motivation/MotivationalMessages'
import { Input } from '../common/ui/input'

interface PomodoroTimerProps {
  onSessionComplete?: (duration: number, notes?: string) => void
  courseName?: string
  onTimerStart?: () => void
  onTimerPause?: () => void
}

export function PomodoroTimer({
  onSessionComplete,
  courseName,
  onTimerStart,
  onTimerPause,
}: PomodoroTimerProps) {
  const [duration, setDuration] = useState(25)
  const [timeLeft, setTimeLeft] = useState(duration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showMotivationalMessage, setShowMotivationalMessage] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsMounted(true)
    const savedState = localStorage.getItem('pomodoroState')
    if (savedState) {
      try {
        const state = JSON.parse(savedState)
        setDuration(state.duration || 25)
        setTimeLeft(state.timeLeft || state.duration * 60 || 25 * 60)
        setIsRunning(state.isRunning || false)
        setIsCompleted(state.isCompleted || false)
        setShowMotivationalMessage(state.showMotivationalMessage || false)
      } catch (error) {
        console.error('Error loading timer state:', error)
      }
    }
  }, [])

  useEffect(() => {
    if (!isMounted) return
    const state = {
      duration,
      timeLeft,
      isRunning,
      isCompleted,
      showMotivationalMessage,
      courseName,
    }
    localStorage.setItem('pomodoroState', JSON.stringify(state))
  }, [
    duration,
    timeLeft,
    isRunning,
    isCompleted,
    showMotivationalMessage,
    courseName,
    isMounted,
  ])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1))
      }, 1000)
    } else {
      clearInterval(intervalRef.current!)
    }
    return () => clearInterval(intervalRef.current!)
  }, [isRunning, timeLeft])

  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      handleSessionEnd()
    }
  }, [timeLeft, isRunning])

  const handleSessionEnd = () => {
    if (isCompleted) return

    setIsRunning(false)
    setIsCompleted(true)
    setTimeout(() => {
      onTimerPause?.()
    }, 0)

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('¡Sesión completada!', {
        body: `Has terminado tu sesión de estudio${courseName ? ` de ${courseName}` : ''}`,
        icon: '/favicon.ico',
      })
    }
  }

  const handleStart = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
    setShowMotivationalMessage(true)
    setIsRunning(true)
    setIsCompleted(false)
    onTimerStart?.()
  }

  const handlePause = () => {
    setIsRunning(false)
    onTimerPause?.()
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(duration * 60)
    setIsCompleted(false)
    setShowMotivationalMessage(false)
    onTimerPause?.()
    if (!isCompleted) localStorage.removeItem('pomodoroState')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!isMounted) return null

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100
  const circumference = 2 * Math.PI * 90
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className='space-y-8'>
      <Card className='border-none bg-card/40 backdrop-blur-md shadow-2xl rounded-[2.5rem] overflow-hidden'>
        <CardHeader className='text-center pb-2'>
          <CardTitle className='text-2xl font-bold flex items-center justify-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center'>
              <Clock className='w-6 h-6 text-primary' />
            </div>
            {isCompleted ? '¡Sesión Finalizada!' : 'Enfoque de Estudio'}
          </CardTitle>
          {courseName && (
            <div className='mt-2 inline-flex items-center gap-2 bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10'>
              <span className='w-2 h-2 rounded-full bg-primary animate-pulse' />
              <p className='text-xs font-bold uppercase tracking-widest text-muted-foreground'>
                {isCompleted ? 'Curso: ' : 'Estudiando: '}
                <span className='text-primary'>{courseName}</span>
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className='space-y-8 p-10'>
          {!isCompleted && (
            <>
              <DurationSelector
                duration={duration}
                isRunning={isRunning}
                onDurationChange={(val) => {
                  setDuration(val)
                  setTimeLeft(val * 60)
                }}
              />
              <CircularTimer
                timeLeft={timeLeft}
                formatTime={formatTime}
                duration={duration}
                circumference={circumference}
                strokeDashoffset={strokeDashoffset}
                isRunning={isRunning}
                isCompleted={isCompleted}
              />

              <TimerControls
                isRunning={isRunning}
                timeLeft={timeLeft}
                duration={duration}
                onStart={handleStart}
                onPause={handlePause}
                onReset={handleReset}
              />
            </>
          )}

          {isCompleted && (
            <CompletionMessage
              duration={duration}
              onSave={(notes) => {
                onSessionComplete?.(duration, notes)
                handleReset()
              }}
              onCancel={handleReset}
            />
          )}
        </CardContent>
      </Card>
      {(showMotivationalMessage || isRunning) && (
        <MotivationalMessages compact />
      )}
    </div>
  )
}

function DurationSelector({
  duration,
  isRunning,
  onDurationChange,
}: {
  duration: number
  isRunning: boolean
  onDurationChange: (val: number) => void
}) {
  const [isCustom, setIsCustom] = useState(false)
  const PRESETS = [5, 10, 15, 25, 30, 45, 60, 90, 120]

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <label className='text-[10px] uppercase font-black tracking-widest text-muted-foreground pl-1'>
          Duración del Bloque
        </label>
        {isCustom && (
          <button
            onClick={() => {
              setIsCustom(false)
              onDurationChange(25)
            }}
            className='text-[10px] font-bold text-primary hover:underline transition-all'
          >
            Volver a ajustes
          </button>
        )}
      </div>

      {!isCustom ? (
        <Select
          value={duration.toString()}
          onValueChange={(val) => {
            if (val === 'custom') {
              setIsCustom(true)
            } else {
              onDurationChange(parseInt(val))
            }
          }}
          disabled={isRunning}
        >
          <SelectTrigger
            className='rounded-2xl bg-primary/5 border-primary/10 h-12 font-semibold transition-all hover:bg-primary/10'
            aria-label={`Seleccionar duración. Actual: ${duration} min`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className='bg-card/95 backdrop-blur-xl border-primary/10 rounded-2xl'>
            {PRESETS.map((v) => (
              <SelectItem
                key={v}
                value={v.toString()}
                className='rounded-xl focus:bg-primary/20 focus:text-primary'
              >
                {v} minutos {v === 25 ? '🎯' : ''}
              </SelectItem>
            ))}
            <SelectItem
              value='custom'
              className='rounded-xl focus:bg-primary/20 focus:text-primary font-bold'
            >
              ⏱️ Personalizado...
            </SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <div className='relative'>
          <Input
            type='number'
            min='1'
            max='480'
            value={duration}
            onChange={(e) => onDurationChange(parseInt(e.target.value) || 1)}
            disabled={isRunning}
            className='h-12 rounded-2xl bg-primary/5 border-primary/10 pl-4 pr-12 font-bold focus:ring-primary/30 transition-all'
          />
          <div className='absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground uppercase tracking-widest pointer-events-none'>
            min
          </div>
        </div>
      )}
    </div>
  )
}

function CircularTimer({
  timeLeft,
  formatTime,
  duration,
  circumference,
  strokeDashoffset,
  isRunning,
  isCompleted,
}: any) {
  return (
    <div className='flex justify-center'>
      <div className='relative w-48 h-48'>
        <svg
          className='w-full h-full transform -rotate-90'
          viewBox='0 0 200 200'
        >
          <circle
            cx='100'
            cy='100'
            r='90'
            stroke='currentColor'
            strokeWidth='8'
            fill='none'
            className='text-muted'
          />
          <circle
            cx='100'
            cy='100'
            r='90'
            stroke='currentColor'
            strokeWidth='8'
            fill='none'
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ${isCompleted ? 'text-accent' : 'text-primary'}`}
            strokeLinecap='round'
          />
        </svg>
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <div
            className={`text-6xl font-black tracking-tight ${isCompleted ? 'text-accent' : 'text-foreground'}`}
          >
            {formatTime(timeLeft)}
          </div>
          <div className='text-[10px] items-center gap-1.5 flex uppercase font-bold tracking-[0.2em] text-muted-foreground mt-4'>
            {isCompleted ? (
              <Check className='w-4 h-4 text-green-500' />
            ) : isRunning ? (
              <span className='w-2 h-2 rounded-full bg-primary animate-pulse' />
            ) : (
              <Pause className='w-3 h-3' />
            )}
            {isCompleted ? 'Finalizado' : isRunning ? 'En Curso' : 'En Pausa'}
          </div>
        </div>
      </div>
    </div>
  )
}

function TimerControls({
  isRunning,
  timeLeft,
  duration,
  onStart,
  onPause,
  onReset,
}: any) {
  return (
    <div className='flex justify-center gap-4'>
      {!isRunning ? (
        <Button
          onClick={onStart}
          className='h-16 px-10 rounded-[2rem] bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 transition-all active:scale-95 font-black text-lg gap-3'
          disabled={timeLeft === 0}
        >
          <Play className='w-6 h-6 fill-current' /> Iniciar
        </Button>
      ) : (
        <Button
          onClick={onPause}
          variant='ghost'
          className='h-16 px-10 rounded-[2rem] bg-primary/5 hover:bg-primary/10 border border-primary/10 backdrop-blur-md active:scale-95 text-lg font-bold gap-3'
        >
          <Pause className='w-6 h-6 fill-current' /> Pausar
        </Button>
      )}
      <Button
        onClick={onReset}
        variant='ghost'
        className='w-16 h-16 rounded-[2rem] bg-primary/5 hover:bg-primary/10 border border-primary/10 backdrop-blur-md active:scale-95 p-0 flex items-center justify-center'
        disabled={timeLeft === duration * 60 && !isRunning}
      >
        <RotateCcw className='w-6 h-6' />
      </Button>
    </div>
  )
}

function CompletionMessage({
  duration,
  onSave,
  onCancel,
}: {
  duration: number
  onSave: (notes: string) => void
  onCancel: () => void
}) {
  const [notes, setNotes] = useState('')

  return (
    <div className='text-center p-8 bg-primary/10 rounded-[2.5rem] border border-primary/20 space-y-6'>
      <div className='mb-2'>
        <div className='w-20 h-20 mx-auto bg-primary text-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-primary/40 rotate-3'>
          <Check className='w-10 h-10 stroke-[3]' />
        </div>
        <h3 className='text-3xl font-black text-foreground mb-2'>
          ¡Increíble! 🌟
        </h3>
        <p className='text-sm text-muted-foreground font-medium uppercase tracking-widest'>
          Has completado{' '}
          <span className='text-primary font-black'>{duration} MIN</span> de
          estudio.
        </p>
      </div>

      <div className='space-y-3 text-left'>
        <label className='text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1'>
          Insights de la sesión
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder='¿Qué aprendiste hoy? (Opcional)'
          className='w-full min-h-[120px] p-5 text-sm rounded-[1.5rem] bg-muted/50 border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all placeholder:text-muted-foreground/40 font-medium'
        />
      </div>

      <div className='flex flex-col gap-3 pt-2'>
        <Button
          onClick={() => onSave(notes)}
          className='w-full bg-primary hover:bg-primary/90 text-white font-black h-16 rounded-[2rem] text-lg shadow-xl shadow-primary/20 transition-all active:scale-95'
        >
          Guardar y Finalizar
        </Button>
        <Button
          onClick={onCancel}
          variant='ghost'
          size='sm'
          className='h-12 rounded-[1.5rem] text-muted-foreground hover:text-primary transition-colors'
        >
          Descartar registro
        </Button>
      </div>

      <div className='pt-6 border-t border-primary/10'>
        <p className='text-[10px] font-bold text-muted-foreground/60 flex items-center justify-center gap-2'>
          <Clock className='w-3 h-3' /> RECOMENDACIÓN: TÓMATE 10 MIN DE DESCANSO
        </p>
      </div>
    </div>
  )
}
