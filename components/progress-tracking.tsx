"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  TrendingUp,
  Award,
  Clock,
  Target,
  Flame,
  Star,
  Trophy,
  Zap,
  Sunrise,
  BookOpen,
} from 'lucide-react'

interface StudySession {
  id: string
  courseId: string
  courseName: string
  date: string
  duration: number // in minutes
  completed: boolean
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedDate?: string
}

interface ProgressTrackingProps {
  courses: Array<{
    id: string
    name: string
    progress: number
    sessionsCompleted: number
    totalSessions: number
  }>
  sessions: StudySession[]
}

export function ProgressTracking({ courses, sessions }: ProgressTrackingProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [totalStudyTime, setTotalStudyTime] = useState(0)
  const [dailyStudyTime, setDailyStudyTime] = useState<number[]>([])
  const [earlyMorningSessions, setEarlyMorningSessions] = useState(0)
  const [weekendStudyStreak, setWeekendStudyStreak] = useState(0)

  useEffect(() => {
    calculateStats()
    checkAchievements()
  }, [sessions])

  const calculateStats = () => {
    // Calculate total study time
    const total = sessions.reduce((acc, session) => acc + session.duration, 0)
    setTotalStudyTime(total)

    // Calculate streaks
    const sortedSessions = sessions
      .filter((s) => s.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    let streak = 0
    let maxStreak = 0
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    // Check current streak
    for (let i = 0; i < sortedSessions.length; i++) {
      const sessionDate = new Date(sortedSessions[i].date)
      sessionDate.setHours(0, 0, 0, 0)

      const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === streak) {
        streak++
      } else if (daysDiff > streak) {
        break
      }
    }

    // Calculate longest streak
    const uniqueDates = [...new Set(sessions.map((s) => s.date.split("T")[0]))]
    uniqueDates.sort()

    let tempStreak = 0
    for (let i = 0; i < uniqueDates.length; i++) {
      if (i === 0) {
        tempStreak = 1
      } else {
        const prevDate = new Date(uniqueDates[i - 1])
        const currDate = new Date(uniqueDates[i])
        const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

        if (daysDiff === 1) {
          tempStreak++
        } else {
          maxStreak = Math.max(maxStreak, tempStreak)
          tempStreak = 1
        }
      }
    }
    maxStreak = Math.max(maxStreak, tempStreak)

    setCurrentStreak(streak)
    setLongestStreak(maxStreak)

    // Calculate daily study time
    const dailyData = new Map<string, number>()
    sessions.forEach(session => {
      const date = session.date.split('T')[0]
      dailyData.set(date, (dailyData.get(date) || 0) + session.duration)
    })
    setDailyStudyTime(Array.from(dailyData.values()))

    // Calculate early morning sessions (before 8 AM)
    const earlySessions = sessions.filter(s => {
      const hour = new Date(s.date).getHours()
      return hour < 8
    })
    setEarlyMorningSessions(earlySessions.length)

    // Calculate weekend study streak
    let weekendCount = 0
    let maxWeekendStreak = 0
    const weekendSessions = sessions
      .filter(s => s.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    for (let i = 0; i < weekendSessions.length; i++) {
      const sessionDate = new Date(weekendSessions[i].date)
      const dayOfWeek = sessionDate.getDay()
      
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
        weekendCount++
        maxWeekendStreak = Math.max(maxWeekendStreak, weekendCount)
      } else {
        weekendCount = 0
      }
    }
    setWeekendStudyStreak(maxWeekendStreak)
  }

  const checkAchievements = () => {
    const newAchievements: Achievement[] = [
      {
        id: "first-session",
        title: "Primer Paso",
        description: "Completa tu primera sesión de estudio",
        icon: "star",
        unlocked: sessions.length > 0,
        unlockedDate: sessions.length > 0 ? sessions[0].date : undefined,
      },
      {
        id: "week-warrior",
        title: "Guerrero Semanal",
        description: "Estudia 7 días consecutivos",
        icon: "flame",
        unlocked: currentStreak >= 7,
        unlockedDate: currentStreak >= 7 ? new Date().toISOString() : undefined,
      },
      {
        id: "time-master",
        title: "Maestro del Tiempo",
        description: "Acumula 10 horas de estudio",
        icon: "clock",
        unlocked: totalStudyTime >= 600, // 10 hours in minutes
        unlockedDate: totalStudyTime >= 600 ? new Date().toISOString() : undefined,
      },
      {
        id: "course-champion",
        title: "Campeón de Cursos",
        description: "Completa tu primer curso",
        icon: "trophy",
        unlocked: courses.some((c) => c.progress >= 100),
        unlockedDate: courses.some((c) => c.progress >= 100) ? new Date().toISOString() : undefined,
      },
      {
        id: "consistency-king",
        title: "Rey de la Constancia",
        description: "Mantén una racha de 30 días",
        icon: "award",
        unlocked: longestStreak >= 30,
        unlockedDate: longestStreak >= 30 ? new Date().toISOString() : undefined,
      },
      {
        id: "speed-learner",
        title: "Aprendiz Veloz",
        description: "Completa 3 cursos en un mes",
        icon: "zap",
        unlocked: courses.filter(c => c.progress >= 100).length >= 3,
        unlockedDate: courses.filter(c => c.progress >= 100).length >= 3 ? new Date().toISOString() : undefined,
      },
      {
        id: "marathon-runner",
        title: "Corredor de Maratón",
        description: "Estudia por más de 2 horas en un solo día",
        icon: "target",
        unlocked: Math.max(...dailyStudyTime) >= 120, // 2 hours in minutes
        unlockedDate: Math.max(...dailyStudyTime) >= 120 ? new Date().toISOString() : undefined,
      },
      {
        id: "early-bird",
        title: "Madrugador",
        description: "Estudia antes de las 8 AM durante 5 días",
        icon: "sunrise",
        unlocked: earlyMorningSessions >= 5,
        unlockedDate: earlyMorningSessions >= 5 ? new Date().toISOString() : undefined,
      },
      {
        id: "weekend-warrior",
        title: "Guerrero de Fin de Semana",
        description: "Estudia durante 4 fines de semana consecutivos",
        icon: "calendar",
        unlocked: weekendStudyStreak >= 4,
        unlockedDate: weekendStudyStreak >= 4 ? new Date().toISOString() : undefined,
      },
      {
        id: "knowledge-seeker",
        title: "Buscador de Conocimiento",
        description: "Registra 10 cursos diferentes",
        icon: "book-open",
        unlocked: courses.length >= 10,
        unlockedDate: courses.length >= 10 ? new Date().toISOString() : undefined,
      },
    ]

    setAchievements(newAchievements)
  }

  const getWeeklyProgress = () => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const weekSessions = sessions.filter((s) => new Date(s.date) >= weekAgo)
    const dailyData = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split("T")[0]
      const daySessions = weekSessions.filter((s) => s.date.startsWith(dateStr))
      const totalMinutes = daySessions.reduce((acc, s) => acc + s.duration, 0)

      dailyData.push({
        date: dateStr,
        day: date.toLocaleDateString("es-ES", { weekday: "short" }),
        minutes: totalMinutes,
        sessions: daySessions.length,
      })
    }

    return dailyData
  }

  const getIconComponent = (iconName: string) => {
    const icons = {
      star: Star,
      flame: Flame,
      clock: Clock,
      trophy: Trophy,
      award: Award,
      zap: Zap,
      target: Target,
      sunrise: Sunrise,
      'book-open': BookOpen,
    }
    const IconComponent = icons[iconName as keyof typeof icons] || Star
    return <IconComponent className="w-6 h-6" />
  }

  const weeklyData = getWeeklyProgress()
  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes), 60)

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Flame className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Racha Actual</p>
                <p className="text-2xl font-bold text-foreground">{currentStreak}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Trophy className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mejor Racha</p>
                <p className="text-2xl font-bold text-foreground">{longestStreak}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-chart-1/10 rounded-lg">
                <Clock className="w-5 h-5 text-chart-1" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tiempo Total</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-chart-2/10 rounded-lg">
                <Target className="w-5 h-5 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sesiones</p>
                <p className="text-2xl font-bold text-foreground">{sessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Progreso Semanal</TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="achievements">Logros</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Actividad de los Últimos 7 Días
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day, index) => (
                  <div key={day.date} className="flex items-center gap-4">
                    <div className="w-12 text-sm text-muted-foreground font-medium">{day.day}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Progress value={(day.minutes / maxMinutes) * 100} className="flex-1 h-3" />
                        <span className="text-sm font-medium w-16 text-right">{day.minutes}min</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {day.sessions} sesión{day.sessions !== 1 ? "es" : ""}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Progreso por Curso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{course.name}</h4>
                      <Badge variant={course.progress >= 100 ? "default" : "secondary"}>{course.progress}%</Badge>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{course.sessionsCompleted} sesiones completadas</span>
                      <span>{course.totalSessions - course.sessionsCompleted} restantes</span>
                    </div>
                  </div>
                ))}
                {courses.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No hay cursos registrados aún</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="font-serif text-xl flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Logros y Recompensas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border transition-all ${
                      achievement.unlocked ? "border-accent bg-accent/5 shadow-sm" : "border-border bg-muted/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          achievement.unlocked ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {getIconComponent(achievement.icon)}
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`font-medium ${
                            achievement.unlocked ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                        {achievement.unlocked && achievement.unlockedDate && (
                          <p className="text-xs text-accent mt-2">
                            Desbloqueado el {new Date(achievement.unlockedDate).toLocaleDateString("es-ES")}
                          </p>
                        )}
                      </div>
                      {achievement.unlocked && (
                        <Badge variant="default" className="bg-accent">
                          ✓
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
