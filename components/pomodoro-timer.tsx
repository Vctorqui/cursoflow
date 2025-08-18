"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, Clock } from "lucide-react"
import { MotivationalMessages } from "./motivational-messages"

interface PomodoroTimerProps {
  onSessionComplete?: (duration: number) => void
  courseName?: string
  onTimerStart?: () => void
  onTimerPause?: () => void
}

export function PomodoroTimer({ onSessionComplete, courseName, onTimerStart, onTimerPause }: PomodoroTimerProps) {
  const [duration, setDuration] = useState(25) // minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60) // seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showMotivationalMessage, setShowMotivationalMessage] = useState(false)
  const [currentMotivationalMessage, setCurrentMotivationalMessage] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const initialCallbackRef = useRef(false)

  // Mark component as mounted
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (initialCallbackRef.current) return

    const savedState = localStorage.getItem("pomodoroState")
    if (savedState) {
      try {
        const state = JSON.parse(savedState)
        setDuration(state.duration || 25)
        setTimeLeft(state.timeLeft || state.duration * 60 || 25 * 60)
        setIsRunning(state.isRunning || false)
        setIsCompleted(state.isCompleted || false)
        setShowMotivationalMessage(state.showMotivationalMessage || false)
      } catch (error) {
        console.log("[v0] Error loading timer state:", error)
      }
    }

    initialCallbackRef.current = true
  }, [])

  // Handle timer state changes after component is mounted
  useEffect(() => {
    if (!isMounted) return

    if (isRunning) {
      onTimerStart?.()
    } else {
      onTimerPause?.()
    }
  }, [isRunning, isMounted, onTimerStart, onTimerPause])

  useEffect(() => {
    const state = {
      duration,
      timeLeft,
      isRunning,
      isCompleted,
      showMotivationalMessage,
      courseName,
    }
    localStorage.setItem("pomodoroState", JSON.stringify(state))
  }, [duration, timeLeft, isRunning, isCompleted, showMotivationalMessage, courseName])

  useEffect(() => {
    setTimeLeft(duration * 60)
    setIsCompleted(false)
  }, [duration])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsCompleted(true)
            onTimerPause?.()
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("¡Sesión completada!", {
                body: `Has terminado tu sesión de estudio${courseName ? ` de ${courseName}` : ""}`,
                icon: "/favicon.ico",
              })
            }
            onSessionComplete?.(duration)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, onSessionComplete, courseName, duration, onTimerPause])

  const handleStart = async () => {
    if ("Notification" in window && Notification.permission === "default") {
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
    localStorage.removeItem("pomodoroState")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100
  const circumference = 2 * Math.PI * 90 // radius of 90
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="space-y-6">
      <Card className="border-border shadow-lg">
        <CardHeader>
          <CardTitle className="font-serif text-xl flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Temporizador Pomodoro
          </CardTitle>
          {courseName && (
            <p className="text-sm text-muted-foreground">
              Estudiando: <span className="font-medium">{courseName}</span>
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Duration Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Duración de la sesión</label>
            <Select
              value={duration.toString()}
              onValueChange={(value) => setDuration(Number.parseInt(value))}
              disabled={isRunning}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 minuto</SelectItem>
                <SelectItem value="25">25 minutos (Pomodoro)</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="45">45 minutos</SelectItem>
                <SelectItem value="60">60 minutos</SelectItem>
                <SelectItem value="90">90 minutos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Circular Timer */}
          <div className="flex justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                {/* Progress circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className={`transition-all duration-1000 ${isCompleted ? "text-accent" : "text-primary"}`}
                  strokeLinecap="round"
                />
              </svg>

              {/* Timer display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-3xl font-mono font-bold ${isCompleted ? "text-accent" : "text-foreground"}`}>
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {isCompleted ? "¡Completado!" : isRunning ? "En progreso" : "Listo para empezar"}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-2">
            {!isRunning ? (
              <Button
                onClick={handleStart}
                className="bg-primary hover:bg-primary/90"
                disabled={timeLeft === 0 && !isCompleted}
              >
                <Play className="w-4 h-4 mr-2" />
                {isCompleted ? "Nueva Sesión" : "Iniciar"}
              </Button>
            ) : (
              <Button onClick={handlePause} variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Pausar
              </Button>
            )}

            <Button onClick={handleReset} variant="outline" disabled={timeLeft === duration * 60 && !isRunning}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reiniciar
            </Button>
          </div>

          {/* Completion message */}
          {isCompleted && (
            <div className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-accent font-medium">¡Excelente trabajo! Has completado tu sesión de estudio.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Tómate un descanso de 5-15 minutos antes de la próxima sesión.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {(showMotivationalMessage || isRunning) && (
        <MotivationalMessages compact={true} onMessageSelect={setCurrentMotivationalMessage} />
      )}
    </div>
  )
}
