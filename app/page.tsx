'use client'

import { useState } from 'react'
import { Button } from '@/src/ui/common/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/ui/common/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/src/ui/common/ui/tabs'
import { BookOpen, TrendingUp, Heart, Timer, Plus, Lock } from 'lucide-react'

import { useCourses } from '@/src/application/useCourses'
import { useStudyFocus } from '@/src/application/useStudyFocus'
import { Course, CourseInputData } from '@/src/domain/entities'

import { CourseCard } from '@/src/ui/courses/CourseCard'
import { CourseForm } from '@/src/ui/courses/CourseForm'
import { PomodoroTimer } from '@/src/ui/timer/PomodoroTimer'
import { ProgressTracking } from '@/src/ui/progress/ProgressTracking'
import { MotivationalMessages } from '@/src/ui/motivation/MotivationalMessages'

import { ThemeToggle } from '@/src/ui/common/theme-toggle'
import Footer from '@/src/ui/common/Footer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/ui/common/ui/select'

export default function CursoFlowApp() {
  const {
    courses,
    studySessions,
    isLoaded,
    addCourse,
    updateCourse,
    deleteCourse,
    addSession,
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
    <div className='min-h-screen max-w-screen-xl mx-auto bg-background flex flex-col'>
      <Header
        onNewCourse={() => setShowCreateModal(true)}
        isTimerRunning={isTimerRunning}
      />

      <main className='container mx-auto px-4 py-8 flex-1'>
        {isTimerRunning && <TimerLockAlert />}

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className='space-y-6'
        >
          <TabsList className='grid w-full grid-cols-2 md:grid-cols-4 gap-2'>
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
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onShow={(c) => console.log('Show', c)}
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
              onSessionComplete={(duration: number) => {
                if (selectedCourse) {
                  addSession(selectedCourse.id, selectedCourse.name, duration)
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
      </main>

      <CourseForm
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={handleAddOrUpdate}
        initialData={editingCourse}
        title={editingCourse ? 'Editar Curso' : 'Registrar Nuevo Curso'}
      />
      <Footer />
    </div>
  )
}

interface HeaderProps {
  onNewCourse: () => void
  isTimerRunning: boolean
}

function Header({ onNewCourse, isTimerRunning }: HeaderProps) {
  return (
    <header className='border-b border-border bg-card'>
      <div className='container mx-auto px-4 py-6 flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-serif font-bold text-foreground'>
            CursoFlow
          </h1>
          <p className='text-muted-foreground mt-1'>
            Tu compañero de estudio constante
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <ThemeToggle />
          <Button
            onClick={onNewCourse}
            disabled={isTimerRunning}
            className='bg-primary'
          >
            <Plus className='w-4 h-4 mr-2' />{' '}
            <span className='hidden sm:inline'>Nuevo Curso</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

function LoadingScreen() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='text-center'>
        <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4' />
        <p className='text-muted-foreground'>Cargando...</p>
      </div>
    </div>
  )
}

function TimerLockAlert() {
  return (
    <div className='mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-2'>
      <Lock className='w-4 h-4 text-primary' />
      <span className='text-sm text-primary font-medium'>
        Sesión de estudio activa - Los tabs están bloqueados
      </span>
    </div>
  )
}

interface TabTriggerProps {
  value: string
  icon: any
  label: string
  disabled?: boolean
}

function TabTrigger({ value, icon: Icon, label, disabled }: TabTriggerProps) {
  return (
    <TabsTrigger
      value={value}
      disabled={disabled}
      className='flex items-center gap-2 text-xs md:text-sm'
    >
      <Icon className='w-3 h-3 md:w-4 md:h-4' />
      <span>{label}</span>
    </TabsTrigger>
  )
}

interface EmptyCoursesProps {
  onAdd: () => void
}

function EmptyCourses({ onAdd }: EmptyCoursesProps) {
  return (
    <div className='text-center py-12'>
      <BookOpen className='w-16 h-16 mx-auto text-muted-foreground mb-4' />
      <h3 className='text-xl font-serif font-semibold mb-2'>
        ¡Comienza tu viaje!
      </h3>
      <Button onClick={onAdd} className='bg-primary'>
        <Plus className='w-4 h-4 mr-2' /> Registrar Primer Curso
      </Button>
    </div>
  )
}

interface StudyTabProps {
  courses: Course[]
  selectedCourse: Course | null
  setSelectedCourse: (course: Course) => void
  isTimerRunning: boolean
  onSessionComplete: (duration: number) => void
  onTimerStart: () => void
  onTimerPause: () => void
  onAddCourse: () => void
}

function StudyTab({
  courses,
  selectedCourse,
  setSelectedCourse,
  isTimerRunning,
  onSessionComplete,
  onTimerStart,
  onTimerPause,
  onAddCourse,
}: StudyTabProps) {
  if (courses.length === 0) {
    return (
      <div className='text-center py-12'>
        <Timer className='w-16 h-16 mx-auto text-muted-foreground mb-4' />
        <h3 className='text-xl font-serif font-semibold mb-2'>
          Registra un curso primero
        </h3>
        <Button onClick={onAddCourse} className='bg-primary'>
          <Plus className='w-4 h-4 mr-2' /> Registrar Curso
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedCourse?.id || ''}
            onValueChange={(val) => {
              const course = courses.find((c) => c.id === val)
              if (course) setSelectedCourse(course)
            }}
            disabled={isTimerRunning}
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecciona un curso' />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} ({c.progress}%)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <div className='max-w-md mx-auto'>
        <PomodoroTimer
          onSessionComplete={onSessionComplete}
          courseName={selectedCourse?.name}
          onTimerStart={onTimerStart}
          onTimerPause={onTimerPause}
        />
      </div>
    </div>
  )
}
