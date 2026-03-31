'use client'

import { useState, useEffect } from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/ui/common/ui/tabs'
import { Course, StudySession } from '../../domain/entities'
import { Achievement, ACHIEVEMENT_DATA } from './constants'
import { StatsOverview } from './fragments/StatsOverview'
import { WeeklyActivity } from './fragments/WeeklyActivity'
import { CoursesProgress } from './fragments/CoursesProgress'
import { NotesHistory } from './fragments/NotesHistory'
import { AchievementsList } from './fragments/AchievementsList'

interface ProgressTrackingProps {
  courses: Course[]
  sessions: StudySession[]
}

export function ProgressTracking({ courses, sessions }: ProgressTrackingProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [streakData, setStreakData] = useState({ current: 0, longest: 0 })
  const [timeData, setTimeData] = useState({ total: 0, daily: [] as number[] })

  useEffect(() => {
    calculateStats()
  }, [sessions])

  useEffect(() => {
    checkAchievements()
  }, [sessions, streakData, timeData])

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
    const newAchievements: Achievement[] = ACHIEVEMENT_DATA.map((a) => {
      let unlocked = false
      switch (a.id) {
        case '1':
          unlocked = sessions.length >= 1
          break
        case '2':
          unlocked = streakData.longest >= 3
          break
        case '3':
          unlocked = sessions.length >= 10
          break
        case '4':
          unlocked = timeData.total >= 300
          break
        case '5':
          unlocked = streakData.longest >= 7
          break
        case '6':
          unlocked = courses.some((c) => c.progress >= 100)
          break
      }
      return { ...a, unlocked }
    })
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
          <NotesHistory sessions={sessions} courses={courses} />
        </TabsContent>

        <TabsContent value='achievements' className='focus:outline-none'>
          <AchievementsList achievements={achievements} />
        </TabsContent>
      </Tabs>
    </div>
  )
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
