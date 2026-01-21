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
import { Play, Pause, RotateCcw, Clock, Check } from 'lucide-react'
import { MotivationalMessages } from '../motivation/MotivationalMessages'

interface PomodoroTimerProps {
  onSessionComplete?: (duration: number) => void
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
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionEnd()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current!)
    }
    return () => clearInterval(intervalRef.current!)
  }, [isRunning, timeLeft])

  const handleSessionEnd = () => {
    setIsRunning(false)
    setIsCompleted(true)
    onTimerPause?.()
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('¡Sesión completada!', {
        body: `Has terminado tu sesión de estudio${courseName ? ` de ${courseName}` : ''}`,
        icon: '/favicon.ico',
      })
    }
    onSessionComplete?.(duration)
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
    <div className='space-y-6'>
      <Card className='border-border shadow-lg'>
        <CardHeader>
          <CardTitle className='font-serif text-xl flex items-center gap-2'>
            <Clock className='w-5 h-5 text-primary' />
            {isCompleted ? 'Sesión Completada' : 'Temporizador Pomodoro'}
          </CardTitle>
          {courseName && (
            <p className='text-sm text-muted-foreground'>
              {isCompleted ? 'Curso completado: ' : 'Estudiando: '}
              <span className='font-medium'>{courseName}</span>
            </p>
          )}
        </CardHeader>

        <CardContent className='space-y-6'>
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

          {isCompleted && <CompletionMessage onReset={handleReset} />}
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
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium'>Duración de la sesión</label>
      <Select
        value={duration.toString()}
        onValueChange={(val) => onDurationChange(parseInt(val))}
        disabled={isRunning}
      >
        <SelectTrigger
          aria-label={`Seleccionar duración. Actual: ${duration} min`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {[5, 10, 15, 25, 30, 45, 60, 90, 120].map((v) => (
            <SelectItem key={v} value={v.toString()}>
              {v} minutos {v === 25 ? '(Pomodoro)' : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
            className={`text-3xl font-mono font-bold ${isCompleted ? 'text-accent' : 'text-foreground'}`}
          >
            {formatTime(timeLeft)}
          </div>
          <div className='text-sm text-muted-foreground mt-1'>
            {isCompleted ? '¡Completado!' : isRunning ? 'En progreso' : 'Listo'}
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
    <div className='flex justify-center gap-2'>
      {!isRunning ? (
        <Button
          onClick={onStart}
          className='bg-primary hover:bg-primary/90'
          disabled={timeLeft === 0}
        >
          <Play className='w-4 h-4 mr-2' /> Iniciar
        </Button>
      ) : (
        <Button onClick={onPause} variant='outline'>
          <Pause className='w-4 h-4 mr-2' /> Pausar
        </Button>
      )}
      <Button
        onClick={onReset}
        variant='outline'
        disabled={timeLeft === duration * 60 && !isRunning}
      >
        <RotateCcw className='w-4 h-4 mr-2' /> Reiniciar
      </Button>
    </div>
  )
}

function CompletionMessage({ onReset }: { onReset: () => void }) {
  return (
    <div className='text-center p-6 bg-accent/10 rounded-lg border border-accent/20'>
      <div className='mb-4'>
        <div className='w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center mb-3'>
          <Check className='w-8 h-8 text-accent' />
        </div>
        <h3 className='text-xl font-semibold text-accent mb-2'>
          ¡Excelente trabajo!
        </h3>
        <p className='text-accent font-medium'>
          Has completado tu sesión de estudio.
        </p>
      </div>
      <div className='space-y-3 text-sm text-muted-foreground'>
        <p>
          📚 <strong>Recomendaciones:</strong>
        </p>
        <ul className='text-left space-y-1 max-w-md mx-auto'>
          <li>• Tómate un descanso de 5-15 min</li>
          <li>• Estírate y bebe agua</li>
        </ul>
        <Button
          onClick={onReset}
          variant='outline'
          size='sm'
          className='mt-4 border-accent/30 text-accent hover:bg-accent/10'
        >
          <RotateCcw className='w-4 h-4 mr-2' /> Nueva Sesión
        </Button>
      </div>
    </div>
  )
}
