'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/ui/common/ui/card'
import { Clock } from 'lucide-react'
import { MotivationalMessages } from '../motivation/MotivationalMessages'
import { TIMER_STORAGE_KEY, DEFAULT_DURATION } from './constants'
import { DurationSelector } from './fragments/DurationSelector'
import { CircularTimer } from './fragments/CircularTimer'
import { TimerControls } from './fragments/TimerControls'
import { CompletionMessage } from './fragments/CompletionMessage'

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
  const [duration, setDuration] = useState(DEFAULT_DURATION)
  const [timeLeft, setTimeLeft] = useState(duration * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showMotivationalMessage, setShowMotivationalMessage] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsMounted(true)
    const savedState = localStorage.getItem(TIMER_STORAGE_KEY)
    if (savedState) {
      try {
        const state = JSON.parse(savedState)
        setDuration(state.duration || DEFAULT_DURATION)
        setTimeLeft(
          state.timeLeft || state.duration * 60 || DEFAULT_DURATION * 60,
        )
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
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(state))
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
    if (!isCompleted) localStorage.removeItem(TIMER_STORAGE_KEY)
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
