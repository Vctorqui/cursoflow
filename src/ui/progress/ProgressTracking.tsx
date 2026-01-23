'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/ui/common/ui/card'
import { Badge } from '@/src/ui/common/ui/badge'
import { Progress } from '@/src/ui/common/ui/progress'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/ui/common/ui/tabs'
import {
  Calendar,
  TrendingUp,
  Award,
  Clock,
  Target,
  Flame,
  Star,
  Trophy,
  BookOpen,
  Check,
} from 'lucide-react'
import { Course, StudySession } from '../../domain/entities'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedDate?: string
}

interface ProgressTrackingProps {
  courses: Course[]
  sessions: StudySession[]
}

export function ProgressTracking({ courses, sessions }: ProgressTrackingProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [streakData, setStreakData] = useState({ current: 0, longest: 0 })
  const [timeData, setTimeData] = useState({ total: 0, daily: [] as number[] })
  const [stats, setStats] = useState({ earlyMorning: 0, weekendStreak: 0 })

  useEffect(() => {
    calculateStats()
  }, [sessions])

  useEffect(() => {
    checkAchievements()
  }, [sessions, streakData, timeData, stats])

  const calculateStats = () => {
    if (sessions.length === 0) return

    const total = sessions.reduce((acc, s) => acc + s.duration, 0)

    // Calculate Streaks
    const dates = sessions
      .map((s) => s.date.split('T')[0])
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    let current = 0
    let longest = 0
    let tempStreak = 0

    if (dates.length > 0) {
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split('T')[0]

      // Current streak check
      if (dates[0] === today || dates[0] === yesterday) {
        current = 1
        for (let i = 0; i < dates.length - 1; i++) {
          const d1 = new Date(dates[i])
          const d2 = new Date(dates[i + 1])
          const diff = (d1.getTime() - d2.getTime()) / 86400000
          if (diff === 1) {
            current++
          } else {
            break
          }
        }
      }

      // Longest streak check
      tempStreak = 1
      longest = 1
      for (let i = 0; i < dates.length - 1; i++) {
        const d1 = new Date(dates[i])
        const d2 = new Date(dates[i + 1])
        const diff = (d1.getTime() - d2.getTime()) / 86400000
        if (diff === 1) {
          tempStreak++
        } else {
          longest = Math.max(longest, tempStreak)
          tempStreak = 1
        }
      }
      longest = Math.max(longest, tempStreak)
    }

    setTimeData((prev) => ({ ...prev, total }))
    setStreakData({ current, longest })
  }

  const checkAchievements = () => {
    const newAchievements: Achievement[] = [
      {
        id: '1',
        title: 'Primer Paso',
        description: 'Completa tu primera sesión de estudio.',
        icon: 'Star',
        unlocked: sessions.length >= 1,
      },
      {
        id: '2',
        title: 'Constancia Inicial',
        description: 'Mantén una racha de 3 días.',
        icon: 'Flame',
        unlocked: streakData.longest >= 3,
      },
      {
        id: '3',
        title: 'Guerrero del Estudio',
        description: 'Completa 10 sesiones totales.',
        icon: 'Target',
        unlocked: sessions.length >= 10,
      },
      {
        id: '4',
        title: 'Maratonista',
        description: 'Acumula más de 5 horas de estudio.',
        icon: 'Clock',
        unlocked: timeData.total >= 300,
      },
      {
        id: '5',
        title: 'Fuego Eterno',
        description: 'Logra una racha de 7 días.',
        icon: 'Flame',
        unlocked: streakData.longest >= 7,
      },
      {
        id: '6',
        title: 'Graduado',
        description: 'Completa un curso al 100%.',
        icon: 'Trophy',
        unlocked: courses.some((c) => c.progress >= 100),
      },
    ]
    setAchievements(newAchievements)
  }

  const weeklyData = getWeeklyProgress(sessions)
  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes), 60)

  return (
    <div className='space-y-8'>
      <StatsOverview
        streak={streakData}
        totalTime={timeData.total}
        sessionsCount={sessions.length}
      />

      <Tabs defaultValue='weekly' className='space-y-6'>
        <TabsList className='inline-flex h-12 items-center justify-center rounded-full bg-muted/50 p-1 text-muted-foreground w-auto mx-auto'>
          <TabsTrigger
            value='weekly'
            className='rounded-full data-[state=active]:bg-primary data-[state=active]:text-white px-6'
          >
            Actividad
          </TabsTrigger>
          <TabsTrigger
            value='courses'
            className='rounded-full data-[state=active]:bg-primary data-[state=active]:text-white px-6'
          >
            Cursos
          </TabsTrigger>
          <TabsTrigger
            value='notes'
            className='rounded-full data-[state=active]:bg-primary data-[state=active]:text-white px-6'
          >
            Notas
          </TabsTrigger>
          <TabsTrigger
            value='achievements'
            className='rounded-full data-[state=active]:bg-primary data-[state=active]:text-white px-6'
          >
            Logros
          </TabsTrigger>
        </TabsList>

        <TabsContent value='weekly' className='focus:outline-none'>
          <WeeklyActivity weeklyData={weeklyData} maxMinutes={maxMinutes} />
        </TabsContent>

        <TabsContent value='courses' className='focus:outline-none'>
          <CoursesProgress courses={courses} />
        </TabsContent>

        <TabsContent value='notes' className='focus:outline-none'>
          <NotesHistory sessions={sessions} />
        </TabsContent>

        <TabsContent value='achievements' className='focus:outline-none'>
          <AchievementsList achievements={achievements} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface StatsOverviewProps {
  streak: { current: number; longest: number }
  totalTime: number
  sessionsCount: number
}

function StatsOverview({
  streak,
  totalTime,
  sessionsCount,
}: StatsOverviewProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      <StatCard
        icon={Flame}
        label='Racha Actual'
        value={streak.current}
        color='text-primary'
        bgColor='bg-primary/10'
      />
      <StatCard
        icon={Trophy}
        label='Mejor Racha'
        value={streak.longest}
        color='text-accent'
        bgColor='bg-accent/10'
      />
      <StatCard
        icon={Clock}
        label='Tiempo Total'
        value={`${Math.floor(totalTime / 60)}h ${totalTime % 60}m`}
        color='text-chart-1'
        bgColor='bg-chart-1/10'
      />
      <StatCard
        icon={Target}
        label='Sesiones'
        value={sessionsCount}
        color='text-chart-2'
        bgColor='bg-chart-2/10'
      />
    </div>
  )
}

interface StatCardProps {
  icon: any
  label: string
  value: string | number
  color: string
  bgColor: string
}

function StatCard({ icon: Icon, label, value, color, bgColor }: StatCardProps) {
  return (
    <Card className='border-none bg-card/40 backdrop-blur-md shadow-2xl rounded-[1.5rem]'>
      <CardContent className='p-6 flex items-center gap-4'>
        <div
          className={`w-12 h-12 flex items-center justify-center ${bgColor} rounded-2xl`}
        >
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <p className='text-[10px] uppercase font-bold tracking-widest text-muted-foreground'>
            {label}
          </p>
          <p className='text-xl font-bold text-foreground leading-tight'>
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

interface WeeklyActivityProps {
  weeklyData: any[]
  maxMinutes: number
}

function WeeklyActivity({ weeklyData, maxMinutes }: WeeklyActivityProps) {
  return (
    <Card className='border-none bg-card/40 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-lg flex items-center gap-2 font-bold'>
          <Calendar className='w-5 h-5 text-primary' />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6 p-6'>
        {weeklyData.map((day: any) => (
          <div key={day.date} className='flex items-center gap-6'>
            <div className='w-12 text-xs font-bold uppercase tracking-widest text-muted-foreground'>
              {day.day}
            </div>
            <div className='flex-1'>
              <div className='flex items-center gap-4 mb-1.5'>
                <div className='flex-1 h-2 bg-white/5 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-primary shadow-[0_0_10px_rgba(255,122,33,0.3)] transition-all'
                    style={{ width: `${(day.minutes / maxMinutes) * 100}%` }}
                  />
                </div>
                <div className='text-sm font-bold w-20 text-right text-primary'>
                  {day.minutes} min
                </div>
              </div>
              <p className='text-[10px] text-muted-foreground font-bold uppercase tracking-widest'>
                {day.sessions} {day.sessions === 1 ? 'Sesión' : 'Sesiones'}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function CoursesProgress({ courses }: { courses: Course[] }) {
  if (courses.length === 0)
    return (
      <div className='text-center py-20 bg-white/5 rounded-[2rem] border border-white/5'>
        <BookOpen className='w-16 h-16 mx-auto mb-4 text-muted-foreground/20' />
        <p className='text-sm font-bold uppercase tracking-widest text-muted-foreground/40'>
          No hay cursos registrados aún
        </p>
      </div>
    )

  return (
    <Card className='border-none bg-card/40 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-lg flex items-center gap-2 font-bold'>
          <TrendingUp className='w-5 h-5 text-primary' />
          Progreso Detallado
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-8 p-6'>
        {courses.map((course) => (
          <div key={course.id} className='space-y-4 group'>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <h4 className='font-bold text-white text-lg tracking-tight group-hover:text-primary transition-colors'>
                  {course.name}
                </h4>
                <p className='text-[10px] items-center flex gap-1.5 uppercase font-bold tracking-widest text-muted-foreground'>
                  {course.sessionsCompleted} sesiones de {course.totalSessions}
                </p>
              </div>
              <div className='bg-primary/10 text-primary px-4 py-1.5 rounded-full font-black text-sm border border-primary/20'>
                {course.progress}%
              </div>
            </div>
            <div className='h-3 w-full bg-white/5 rounded-full overflow-hidden'>
              <div
                className='h-full bg-primary shadow-[0_0_10px_rgba(255,122,33,0.3)]'
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <div className='flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1'>
              <span>Iniciado</span>
              <span>
                {course.progress === 100
                  ? 'Completado'
                  : `${course.totalSessions - course.sessionsCompleted} restantes`}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function AchievementsList({ achievements }: { achievements: Achievement[] }) {
  if (achievements.length === 0) {
    return (
      <div className='text-center py-24 bg-white/5 rounded-[2rem] border border-white/5'>
        <Trophy className='w-20 h-20 mx-auto mb-6 text-muted-foreground/10' />
        <h4 className='text-xl font-black text-white mb-2 uppercase tracking-widest opacity-50'>
          Próximamente
        </h4>
        <p className='text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/30'>
          Sigue estudiando para desbloquear el sistema de logros
        </p>
      </div>
    )
  }

  return (
    <Card className='border-none bg-card/40 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-lg flex items-center gap-2 font-bold'>
          <Award className='w-5 h-5 text-primary' />
          Logros Desbloqueados
        </CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4 p-6'>
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-6 rounded-[1.5rem] border transition-all ${achievement.unlocked ? 'border-primary/20 bg-primary/5 shadow-xl' : 'border-white/5 bg-white/5 grayscale opacity-40'}`}
          >
            <div className='flex items-start gap-4'>
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${achievement.unlocked ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground'}`}
              >
                <AchievementIcon name={achievement.icon} className='w-7 h-7' />
              </div>
              <div className='flex-1 space-y-1'>
                <h4
                  className={`text-lg font-black tracking-tight ${achievement.unlocked ? 'text-white' : 'text-muted-foreground'}`}
                >
                  {achievement.title}
                </h4>
                <p className='text-xs font-medium text-muted-foreground/70 leading-relaxed'>
                  {achievement.description}
                </p>
              </div>
              {achievement.unlocked && (
                <div className='bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20'>
                  <Check className='w-4 h-4 stroke-[3]' />
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function AchievementIcon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  switch (name) {
    case 'Star':
      return <Star className={className} />
    case 'Flame':
      return <Flame className={className} />
    case 'Target':
      return <Target className={className} />
    case 'Clock':
      return <Clock className={className} />
    case 'Trophy':
      return <Trophy className={className} />
    default:
      return <Award className={className} />
  }
}

function getWeeklyProgress(sessions: StudySession[]) {
  const now = new Date()
  const dailyData = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split('T')[0]
    const daySessions = sessions.filter((s) => s.date.startsWith(dateStr))
    dailyData.push({
      date: dateStr,
      day: date.toLocaleDateString('es-ES', { weekday: 'short' }),
      minutes: daySessions.reduce((acc, s) => acc + s.duration, 0),
      sessions: daySessions.length,
    })
  }
  return dailyData
}

function NotesHistory({ sessions }: { sessions: StudySession[] }) {
  const sessionsWithNotes = sessions
    .filter((s) => s.notes && s.notes.trim() !== '')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (sessionsWithNotes.length === 0) {
    return (
      <div className='text-center py-20 bg-white/5 rounded-[2rem] border border-white/5'>
        <BookOpen className='w-16 h-16 mx-auto mb-4 text-muted-foreground/20' />
        <p className='text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/40'>
          No has guardado notas aún
        </p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-6'>
      {sessionsWithNotes.map((session) => (
        <Card
          key={session.id}
          className='border-none bg-card/40 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden group hover:bg-card/60 transition-all'
        >
          <CardHeader className='bg-primary/5 py-4 px-8 border-b border-white/5'>
            <div className='flex justify-between items-center'>
              <div className='space-y-0.5'>
                <p className='text-[10px] uppercase font-bold tracking-[0.2em] text-primary/80'>
                  Curso
                </p>
                <CardTitle className='text-lg font-black text-white'>
                  {session.courseName}
                </CardTitle>
              </div>
              <div className='flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
                <div className='flex items-center gap-1.5'>
                  <Calendar className='w-3 h-3 text-primary' />
                  {new Date(session.date).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </div>
                <div className='flex items-center gap-1.5'>
                  <Clock className='w-3 h-3 text-primary' />
                  {session.duration}min
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className='p-8'>
            <div className='relative'>
              <div className='absolute -left-4 top-0 bottom-0 w-1 bg-primary/20 rounded-full' />
              <p className='text-sm text-foreground font-medium leading-relaxed whitespace-pre-wrap italic'>
                &quot;{session.notes}&quot;
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
