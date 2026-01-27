'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList } from '@/src/ui/common/ui/tabs'
import { BookOpen, TrendingUp, Heart, Timer } from 'lucide-react'

import { useCourses } from '@/src/application/useCourses'
import { useStudyFocus } from '@/src/application/useStudyFocus'
import { Course, CourseInputData } from '@/src/domain/entities'

import { CourseCard } from '@/src/ui/courses/CourseCard'
import { CourseForm } from '@/src/ui/courses/CourseForm'
import { ProgressTracking } from '@/src/ui/progress/ProgressTracking'
import { MotivationalMessages } from '@/src/ui/motivation/MotivationalMessages'
import confetti from 'canvas-confetti'

import { EmptyCourses } from '@/src/ui/courses/EmptyCourses'
import { AppLayout } from '@/src/ui/common/AppLayout'
import { LoadingScreen } from '@/src/ui/common/LoadingScreen'
import { TimerLockAlert } from '@/src/ui/common/TimerLockAlert'
import { TabTrigger } from '@/src/ui/common/TabTrigger'
import { StudyTab } from '@/src/ui/study/StudyTab'

export default function CursoFlowApp() {
  const {
    courses,
    studySessions,
    isLoaded,
    addCourse,
    updateCourse,
    deleteCourse,
    addSession,
    importData,
  } = useCourses()
  const {
    selectedCourse,
    setSelectedCourse,
    isTimerRunning,
    activeTab,
    setActiveTab,
    startStudySession,
    handleTimerStart,
    handleTimerPause,
  } = useStudyFocus()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddOrUpdate = (data: CourseInputData) => {
    if (editingCourse) {
      updateCourse(editingCourse.id, data)
      setEditingCourse(null)
    } else {
      addCourse(data)
    }
  }

  const addCourseToGoogleCalendar = (course: Course) => {
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(startDate.getDate() + course.duration * 7)
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('📚 ' + course.name)}&details=${encodeURIComponent(course.description)}`
    window.open(googleCalendarUrl, '_blank')
  }

  if (!isLoaded) return <LoadingScreen />

  return (
    <AppLayout
      headerProps={{
        onNewCourse: () => setShowCreateModal(true),
        isTimerRunning,
        courses,
        sessions: studySessions,
        onImport: importData,
        searchQuery,
        onSearchChange: setSearchQuery,
      }}
    >
      {isTimerRunning && <TimerLockAlert />}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='space-y-6'
      >
        <TabsList className='inline-flex h-12 items-center justify-center rounded-full bg-muted/50 p-1 text-muted-foreground w-auto mx-auto'>
          <TabTrigger
            value='courses'
            icon={BookOpen}
            label='Mis Cursos'
            disabled={isTimerRunning}
          />
          <TabTrigger value='study' icon={Timer} label='Estudiar' />
          <TabTrigger
            value='progress'
            icon={TrendingUp}
            label='Progreso'
            disabled={isTimerRunning}
          />
          <TabTrigger
            value='motivation'
            icon={Heart}
            label='Motivación'
            disabled={isTimerRunning}
          />
        </TabsList>

        <TabsContent value='courses' className='space-y-6'>
          {courses.length > 0 && <MotivationalMessages compact />}
          {courses.length === 0 ? (
            <EmptyCourses onAdd={() => setShowCreateModal(true)} />
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onShow={(c) => {
                    setEditingCourse(c)
                    setShowCreateModal(true)
                  }}
                  onEdit={(c) => {
                    setEditingCourse(c)
                    setShowCreateModal(true)
                  }}
                  onDelete={deleteCourse}
                  onCalendar={addCourseToGoogleCalendar}
                  onStartSession={startStudySession}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value='study' className='space-y-6'>
          <StudyTab
            courses={courses}
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            isTimerRunning={isTimerRunning}
            onSessionComplete={(duration: number, notes?: string) => {
              if (selectedCourse) {
                addSession(
                  selectedCourse.id,
                  selectedCourse.name,
                  duration,
                  notes,
                )
                const currentCourse = courses.find(
                  (c) => c.id === selectedCourse.id,
                )
                if (currentCourse) {
                  const sessionsCompleted = currentCourse.sessionsCompleted
                  const totalNeeded = currentCourse.totalSessions

                  if (sessionsCompleted + 1 >= totalNeeded && totalNeeded > 0) {
                    setTimeout(() => {
                      confetti({
                        particleCount: 150,
                        spread: 70,
                        origin: { y: 0.6 },
                        zIndex: 9999,
                      })
                    }, 300)
                  }
                }
              }
            }}
            onTimerStart={handleTimerStart}
            onTimerPause={handleTimerPause}
            onAddCourse={() => setShowCreateModal(true)}
          />
        </TabsContent>

        <TabsContent value='progress'>
          <ProgressTracking courses={courses} sessions={studySessions} />
        </TabsContent>

        <TabsContent value='motivation'>
          <MotivationalMessages />
        </TabsContent>
      </Tabs>

      <CourseForm
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleAddOrUpdate}
        initialData={editingCourse}
        title={editingCourse ? 'Editar Curso' : 'Registrar Nuevo Curso'}
      />
    </AppLayout>
  )
}
