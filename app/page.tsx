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
import {
  BookOpen,
  TrendingUp,
  Heart,
  Timer,
  Plus,
  Lock,
  Download,
  Upload,
  Settings,
  Database,
} from 'lucide-react'

import { useCourses } from '@/src/application/useCourses'
import { useStudyFocus } from '@/src/application/useStudyFocus'
import { Course, CourseInputData } from '@/src/domain/entities'

import { CourseCard } from '@/src/ui/courses/CourseCard'
import { CourseForm } from '@/src/ui/courses/CourseForm'
import { PomodoroTimer } from '@/src/ui/timer/PomodoroTimer'
import { ProgressTracking } from '@/src/ui/progress/ProgressTracking'
import { MotivationalMessages } from '@/src/ui/motivation/MotivationalMessages'
import confetti from 'canvas-confetti'

import { ThemeToggle } from '@/src/ui/common/theme-toggle'
import { ThemeCustomizer } from '@/src/ui/common/ThemeCustomizer'
import { BackupActions } from '@/src/ui/common/BackupActions'
import { EmptyCourses } from '@/src/ui/courses/EmptyCourses'
import Footer from '@/src/ui/common/Footer'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/ui/common/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/ui/common/ui/dropdown-menu'

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
    <div className='min-h-screen max-w-screen-xl mx-auto bg-background flex flex-col'>
      <Header
        onNewCourse={() => setShowCreateModal(true)}
        isTimerRunning={isTimerRunning}
        courses={courses}
        sessions={studySessions}
        onImport={importData}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className='container mx-auto px-4 py-8 flex-1'>
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

                  // Celebration logic: check if this session completes the course
                  const completedSessionsCount =
                    studySessions.filter(
                      (s) => s.courseId === selectedCourse.id && s.completed,
                    ).length + 1

                  if (completedSessionsCount >= selectedCourse.totalSessions) {
                    confetti({
                      particleCount: 150,
                      spread: 70,
                      origin: { y: 0.6 },
                    })
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
  courses: Course[]
  sessions: any[]
  onImport: (data: any) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

function Header({
  onNewCourse,
  isTimerRunning,
  courses,
  sessions,
  onImport,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className='border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <h1 className='text-2xl font-serif font-bold text-primary'>
            CursoFlow
          </h1>
          <p className='hidden lg:block text-[10px] text-muted-foreground uppercase tracking-widest'>
            Tu compañero de estudio
          </p>
        </div>

        <div className='flex-1 max-w-md mx-4 hidden md:block'>
          <div className='relative'>
            <Plus className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <input
              type='text'
              placeholder='Buscar cursos...'
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className='w-full bg-muted/50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all'
            />
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <ThemeCustomizer />
          <ThemeToggle />
          <BackupActions
            courses={courses}
            sessions={sessions}
            onImport={onImport}
          />
          <Button
            onClick={onNewCourse}
            disabled={isTimerRunning}
            className='rounded-full bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold'
          >
            <Plus className='w-4 h-4 mr-2' /> <span>Nuevo Curso</span>
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
      className='flex items-center gap-2 px-6 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-xs md:text-sm font-medium'
    >
      <Icon className='w-3 h-3 md:w-4 md:h-4' />
      <span>{label}</span>
    </TabsTrigger>
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
