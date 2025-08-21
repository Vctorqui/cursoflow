'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Clock,
  Target,
  Plus,
  Play,
  Check,
  Timer,
  Heart,
  TrendingUp,
  Lock,
  Edit,
  Trash2,
  Eye,
  Calendar,
} from 'lucide-react'
import { PomodoroTimer } from '@/components/pomodoro-timer'
import { MotivationalMessages } from '@/components/motivational-messages'
import { ProgressTracking } from '@/components/progress-tracking'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ThemeToggle } from '@/components/theme-toggle'
import Footer from '@/components/Footer'
import ThemeTogglerTest from '@/components/ThemeTogglerTest'
import useDateToday from '@/hooks/useDateToday'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
interface Course {
  id: string
  name: string
  description: string
  duration: number
  frequency: number
  schedule?: string
  progress: number
  sessionsCompleted: number
  totalSessions: number
  createdAt: string
}

interface StudySession {
  id: string
  courseId: string
  courseName: string
  date: string
  duration: number
  completed: boolean
}

export default function CursoFlowApp() {
  const { toast } = useToast()
  const [isMounted, setIsMounted] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [studySessions, setStudySessions] = useState<StudySession[]>([])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [newCourse, setNewCourse] = useState({
    name: '',
    description: '',
    duration: '',
    frequency: '',
    schedule: '',
    createdAt: '',
  })

  const [activeTab, setActiveTab] = useState('courses')
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [showShowCourseModal, setShowShowCourseModal] = useState(false)
  const { getDateToday } = useDateToday()

  // Handle hydration safely
  useEffect(() => {
    setIsMounted(true)

    // Load data from localStorage only after mounting
    const savedCourses = localStorage.getItem('cursoflow-courses')
    if (savedCourses) {
      try {
        setCourses(JSON.parse(savedCourses))
      } catch (error) {
        console.log('Error loading courses:', error)
      }
    }

    const savedSessions = localStorage.getItem('cursoflow-sessions')
    if (savedSessions) {
      try {
        setStudySessions(JSON.parse(savedSessions))
      } catch (error) {
        console.log('Error loading sessions:', error)
      }
    }
  }, [])

  const handleShowCourse = (course: Course) => {
    setSelectedCourse(course)
    setShowShowCourseModal(true)
  }

  useEffect(() => {
    localStorage.setItem('cursoflow-courses', JSON.stringify(courses))
  }, [courses])

  useEffect(() => {
    localStorage.setItem('cursoflow-sessions', JSON.stringify(studySessions))
  }, [studySessions])

  
  const recalculateAllCourseProgress = useCallback(() => {
    setCourses(prevCourses => 
      prevCourses.map(course => {
        const actualSessions = studySessions.filter(
          session => session.courseId === course.id && session.completed
        ).length
        
        const newProgress = Math.round(
          (actualSessions / course.totalSessions) * 100
        )
        
        return {
          ...course,
          sessionsCompleted: actualSessions,
          progress: Math.min(newProgress, 100),
        }
      })
    )
  }, [studySessions])
  
  // Recalculate course progress when sessions change
  useEffect(() => {
    if (isMounted) {
      recalculateAllCourseProgress()
    }
  }, [studySessions, isMounted, recalculateAllCourseProgress])
  const handleAddCourse = () => {
    if (newCourse.name && newCourse.duration && newCourse.frequency) {
      const course: Course = {
        id: Date.now().toString(),
        name: newCourse.name,
        description: newCourse.description,
        duration: Number.parseInt(newCourse.duration),
        frequency: Number.parseInt(newCourse.frequency),
        schedule: newCourse.schedule,
        progress: 0,
        sessionsCompleted: 0,
        totalSessions:
          Number.parseInt(newCourse.duration) *
          Number.parseInt(newCourse.frequency),
        createdAt: getDateToday(),
      }
      console.log(course)

      setCourses([...courses, course])
      setNewCourse({
        name: '',
        description: '',
        duration: '',
        frequency: '',
        schedule: '',
        createdAt: getDateToday(),
      })
      setShowCreateModal(false)

      toast({
        title: 'Curso registrado',
        description: `Curso "${course.name}" registrado con éxito.`,
      })
    } else {
      toast({
        title: 'Error al registrar curso',
        description: 'Por favor, completa todos los campos del formulario.',
        variant: 'destructive',
      })
    }
  }

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course)
    setNewCourse({
      name: course.name,
      description: course.description,
      duration: course.duration.toString(),
      frequency: course.frequency.toString(),
      schedule: course.schedule || '',
      createdAt: course.createdAt,
    })
    setShowEditForm(true)
  }

  const handleUpdateCourse = () => {
    if (
      editingCourse &&
      newCourse.name &&
      newCourse.duration &&
      newCourse.frequency
    ) {
      const newDuration = Number.parseInt(newCourse.duration)
      const newFrequency = Number.parseInt(newCourse.frequency)
      const newTotalSessions = newDuration * newFrequency

      // Obtener todas las sesiones existentes para este curso
      const existingSessions = studySessions.filter(
        session => session.courseId === editingCourse.id
      )

      // Calcular el nuevo progreso basado en las sesiones existentes
      const newSessionsCompleted = Math.min(existingSessions.length, newTotalSessions)
      const newProgress = Math.round((newSessionsCompleted / newTotalSessions) * 100)

      const updatedCourse: Course = {
        ...editingCourse,
        name: newCourse.name,
        description: newCourse.description,
        duration: newDuration,
        frequency: newFrequency,
        schedule: newCourse.schedule,
        totalSessions: newTotalSessions,
        sessionsCompleted: newSessionsCompleted,
        progress: Math.min(newProgress, 100),
      }

      setCourses(
        courses.map((course) =>
          course.id === editingCourse.id ? updatedCourse : course
        )
      )

      setNewCourse({
        name: '',
        description: '',
        duration: '',
        frequency: '',
        schedule: '',
        createdAt: getDateToday(),
      })
      setEditingCourse(null)
      setShowEditForm(false)

      toast({
        title: 'Curso actualizado',
        description: `Curso "${updatedCourse.name}" actualizado con éxito. Progreso recalculado: ${newProgress}%`,
      })
    } else {
      toast({
        title: 'Error al actualizar curso',
        description: 'Por favor, completa todos los campos del formulario.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteCourse = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId)
    if (course) {
      setCourseToDelete(course)
      setShowDeleteConfirm(true)
    }
  }

  const confirmDeleteCourse = () => {
    if (courseToDelete) {
      setCourses(courses.filter((course) => course.id !== courseToDelete.id))
      setStudySessions(
        studySessions.filter(
          (session) => session.courseId !== courseToDelete.id
        )
      )

      // Si el curso seleccionado es el que se está eliminando, deseleccionarlo
      if (selectedCourse?.id === courseToDelete.id) {
        setSelectedCourse(null)
      }

      toast({
        title: 'Curso eliminado',
        description: `Curso "${courseToDelete.name}" eliminado con éxito.`,
      })

      setShowDeleteConfirm(false)
      setCourseToDelete(null)
    }
  }

  const handleSessionComplete = (duration = 25) => {
    if (selectedCourse) {
      // Create new session record
      const newSession: StudySession = {
        id: Date.now().toString(),
        courseId: selectedCourse.id,
        courseName: selectedCourse.name,
        date: new Date().toISOString(),
        duration: duration,
        completed: true,
      }

      setStudySessions((prev) => [...prev, newSession])
      // Progress will be automatically recalculated by the useEffect
    }
  }

  const handleTimerStart = useCallback(() => {
    setIsTimerRunning(true)
  }, [])

  const handleTimerPause = useCallback(() => {
    setIsTimerRunning(false)
  }, [])

  const startStudySession = (course: Course) => {
    setSelectedCourse(course)
    setActiveTab('study')
  }

  const addCourseToGoogleCalendar = (course: Course | typeof newCourse) => {
    // Verificar si es un curso completo o un nuevo curso
    const isNewCourse = !('id' in course)

    if (isNewCourse && (!course.duration || !course.frequency)) {
      toast({
        title: 'Datos incompletos',
        description:
          'Por favor, completa la duración y frecuencia del curso antes de agregarlo al calendario.',
        variant: 'destructive',
      })
      return
    }

    // Calcular fecha de inicio (hoy) y fecha de finalización
    const startDate = new Date()
    const endDate = new Date()
    const durationWeeks = isNewCourse
      ? Number(course.duration)
      : course.duration
    endDate.setDate(startDate.getDate() + durationWeeks * 7) // Añadir semanas * 7 días

    // Formatear fechas para Google Calendar (YYYYMMDD)
    const formatDateForGoogle = (date: Date) => {
      return date.toISOString().split('T')[0].replace(/-/g, '')
    }

    const startDateFormatted = formatDateForGoogle(startDate)
    const endDateFormatted = formatDateForGoogle(endDate)

    // Crear enlace directo para agregar evento
    const eventDetails = {
      text: `📚 ${course.name}`,
      dates: `${startDateFormatted}/${endDateFormatted}`,
      details: `Curso: ${course.name}\n\nDescripción: ${
        course.description || 'Sin descripción'
      }\n\nDuración: ${durationWeeks} semanas\nFrecuencia: ${
        isNewCourse ? course.frequency : course.frequency
      } sesión${
        (isNewCourse ? Number(course.frequency) : course.frequency) > 1
          ? 'es'
          : ''
      } por semana\n\nHorario: ${course.schedule || 'No especificado'}`,
      location: '',
      trp: false,
    }

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventDetails.text
    )}&dates=${eventDetails.dates}&details=${encodeURIComponent(
      eventDetails.details
    )}`

    // Abrir en nueva pestaña
    window.open(googleCalendarUrl, '_blank')

    toast({
      title: 'Enlace generado',
      description: `Se abrirá Google Calendar para que agregues el curso.  ${startDate.toLocaleDateString(
        'es-ES'
      )} al ${endDate.toLocaleDateString('es-ES')}`,
    })
  }

  return (
    <div className='min-h-screen max-w-screen-xl mx-auto bg-background flex flex-col'>
      {/* Header */}
      <header className='border-b border-border bg-card'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex items-center justify-center flex-col md:flex-row md:justify-between'>
            <div className='text-center md:text-left'>
              <h1 className='text-3xl font-serif font-bold text-foreground'>
                CursoFlow
              </h1>
              <p className='text-muted-foreground mt-1'>
                Tu compañero de estudio constante
              </p>
            </div>
            <div className='flex items-center gap-3 mt-4 md:mt-0'>
              <ThemeToggle />
              <Button
                onClick={() => setShowCreateModal(true)}
                className='bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer'
                disabled={isTimerRunning}
                aria-label={isTimerRunning ? 'No se puede crear curso durante una sesión activa' : 'Crear nuevo curso'}
              >
                <Plus className='w-4 h-4 mr-2' />
                <span className='hidden sm:inline'>Nuevo Curso</span>
                <span className='sm:hidden'>Curso</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className='container mx-auto px-4 py-8 flex-1'>
        {!isMounted ? (
          <div className='flex items-center justify-center h-64'>
            <div className='text-center'>
              <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4'></div>
              <p className='text-muted-foreground'>Cargando...</p>
            </div>
          </div>
        ) : (
          <>
            {isTimerRunning && (
              <div className='mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-2'>
                <Lock className='w-4 h-4 text-primary' />
                <span className='text-sm text-primary font-medium'>
                  Sesión de estudio activa - Los tabs están bloqueados para
                  mantener tu concentración
                </span>
              </div>
            )}

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='space-y-6'
            >
              <TabsList className='grid w-full grid-cols-2 md:grid-cols-4 gap-2'>
                <TabsTrigger
                  value='courses'
                  className='flex items-center gap-2 text-xs md:text-sm'
                  disabled={isTimerRunning}
                >
                  <BookOpen className='w-3 h-3 md:w-4 md:h-4' />
                  <span className='hidden sm:inline'>Mis Cursos</span>
                  <span className='sm:hidden'>Cursos</span>
                </TabsTrigger>
                <TabsTrigger
                  value='study'
                  className='flex items-center gap-2 text-xs md:text-sm'
                >
                  <Timer className='w-3 h-3 md:w-4 md:h-4' />
                  <span className='hidden sm:inline'>Sesión de Estudio</span>
                  <span className='sm:hidden'>Estudiar</span>
                </TabsTrigger>
                <TabsTrigger
                  value='progress'
                  className='flex items-center gap-2 text-xs md:text-sm'
                  disabled={isTimerRunning}
                >
                  <TrendingUp className='w-3 h-3 md:w-4 md:h-4' />
                  <span className='hidden sm:inline'>Progreso</span>
                  <span className='sm:hidden'>Progreso</span>
                </TabsTrigger>
                <TabsTrigger
                  value='motivation'
                  className='flex items-center gap-2 text-xs md:text-sm'
                  disabled={isTimerRunning}
                >
                  <Heart className='w-3 h-3 md:w-4 md:h-4' />
                  <span className='hidden sm:inline'>Motivación</span>
                  <span className='sm:hidden'>Motivar</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value='courses' className='space-y-6'>
                {courses.length > 0 && (
                  <div className='mb-6'>
                    <MotivationalMessages compact={true} />
                  </div>
                )}

                {courses.length === 0 ? (
                  <div className='text-center py-12'>
                    <BookOpen className='w-16 h-16 mx-auto text-muted-foreground mb-4' />
                    <h3 className='text-xl font-serif font-semibold text-foreground mb-2'>
                      ¡Comienza tu viaje de aprendizaje!
                    </h3>
                    <p className='text-muted-foreground mb-6 max-w-md mx-auto'>
                      Registra tu primer curso y mantén la constancia en tus
                      estudios con nuestro sistema de seguimiento.
                    </p>
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className='bg-primary hover:bg-primary/90 cursor-pointer'
                      aria-label='Registrar tu primer curso para comenzar a estudiar'
                    >
                      <Plus className='w-4 h-4 mr-2' />
                      Registrar Primer Curso
                    </Button>
                  </div>
                ) : (
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {courses.map((course) => (
                      <Card
                        key={course.id}
                        className='border-border shadow-lg hover:shadow-xl transition-shadow'
                      >
                        <CardHeader>
                          <div className='flex items-start justify-between'>
                            <div className='flex-1'>
                              <CardTitle className='font-serif text-lg line-clamp-2'>
                                {course.name}
                              </CardTitle>
                              <CardDescription className='mt-2 line-clamp-2'>
                                {course.description}
                              </CardDescription>
                            </div>
                            <div className='flex items-center gap-2 ml-2'>
                              <Badge variant='secondary'>
                                {course.duration}w
                              </Badge>
                              <div className='flex gap-1'>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() => handleShowCourse(course)}
                                        className='h-8 w-8 p-0'
                                        aria-label={`Ver detalles del curso ${course.name}`}
                                      >
                                        <Eye className='w-4 h-4' />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Ver detalles</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() => handleEditCourse(course)}
                                        className='h-8 w-8 p-0 hover:bg-muted'
                                        aria-label={`Editar curso ${course.name}`}
                                      >
                                        <Edit className='w-4 h-4' />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Editar curso</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() =>
                                          handleDeleteCourse(course.id)
                                        }
                                        className='h-8 w-8 p-0 hover:bg-muted hover:text-destructive'
                                        aria-label={`Eliminar curso ${course.name}`}
                                      >
                                        <Trash2 className='w-4 h-4' />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Eliminar curso</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant='ghost'
                                        size='sm'
                                        onClick={() =>
                                          addCourseToGoogleCalendar(course)
                                        }
                                        className='h-8 w-8 p-0'
                                        aria-label={`Agregar curso ${course.name} a Google Calendar`}
                                      >
                                        <Calendar className='w-4 h-4' />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Agregar a Google Calendar</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className='space-y-4'>
                          <div className='space-y-2'>
                            <div className='flex justify-between text-sm'>
                              <span className='text-muted-foreground'>
                                Progreso
                              </span>
                              <span className='font-medium'>
                                {course.progress}%
                              </span>
                            </div>
                            <Progress 
                              value={course.progress} 
                              className='h-2' 
                              aria-label={`Progreso del curso ${course.name}: ${course.progress}% completado`}
                            />
                          </div>

                          <div className='grid grid-cols-2 gap-4 text-sm'>
                            <div className='flex items-center gap-2'>
                              <Target className='w-4 h-4 text-primary' />
                              <span className='text-muted-foreground'>
                                {course.frequency}x/semana
                              </span>
                            </div>
                            <div className='flex items-center gap-2'>
                              <Clock className='w-4 h-4 text-accent' />
                              <span className='text-muted-foreground'>
                                {course.sessionsCompleted}/
                                {course.totalSessions}
                              </span>
                            </div>
                          </div>

                          {course.schedule && (
                            <div className='text-sm text-muted-foreground bg-muted p-2 rounded'>
                              <strong>Horario:</strong> {course.schedule}
                            </div>
                          )}
                          {course.progress === 100 ? (
                            <Button
                              disabled
                              className='w-full bg-primary disabled:bg-primary/90 '
                              size='sm'
                              onClick={() => {}}
                              aria-label={`Curso ${course.name} completado al 100%`}
                            >
                              <Check className='w-4 h-4 mr-2' />
                              Curso Completado
                            </Button>
                          ) : (
                            <>
                              <>
                                <Button
                                  className='w-full bg-primary hover:bg-primary/90 cursor-pointer'
                                  size='sm'
                                  onClick={() => startStudySession(course)}
                                  aria-label={`Iniciar sesión de estudio para el curso ${course.name}`}
                                >
                                  <Play className='w-4 h-4 mr-2' />
                                  Iniciar Sesión
                                </Button>
                              </>
                              <>
                                <Button
                                  className='w-full bg-primary hover:bg-primary/90'
                                  size='sm'
                                  onClick={() =>
                                    addCourseToGoogleCalendar(course)
                                  }
                                  aria-label={`Agregar curso ${course.name} a Google Calendar`}
                                >
                                  <Calendar className='w-4 h-4 mr-2' />
                                  Agregar a Google Calendar
                                </Button>
                              </>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value='study' className='space-y-6'>
                {courses.length > 0 && (
                  <Card className='border-border shadow-lg'>
                    <CardHeader>
                      <CardTitle className='font-serif text-xl'>
                        Seleccionar Curso
                      </CardTitle>
                      <CardDescription>
                        Elige el curso en el que quieres trabajar durante esta
                        sesión
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Select
                        value={selectedCourse?.id || ''}
                        onValueChange={(value) => {
                          const course = courses.find((c) => c.id === value)
                          setSelectedCourse(course || null)
                        }}
                        disabled={isTimerRunning}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Selecciona un curso' />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.name} ({course.progress}% completado)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                )}

                {courses.length === 0 ? (
                  <div className='text-center py-12'>
                    <Timer className='w-16 h-16 mx-auto text-muted-foreground mb-4' />
                    <h3 className='text-xl font-serif font-semibold text-foreground mb-2'>
                      Registra un curso primero
                    </h3>
                    <p className='text-muted-foreground mb-6 max-w-md mx-auto'>
                      Para usar el temporizador de estudio, primero necesitas
                      registrar al menos un curso.
                    </p>
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className='bg-primary hover:bg-primary/90 cursor-pointer'
                      aria-label='Registrar un curso para poder usar el temporizador de estudio'
                    >
                      <Plus className='w-4 h-4 mr-2' />
                      Registrar Curso
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className='max-w-md mx-auto'>
                      <PomodoroTimer
                        onSessionComplete={handleSessionComplete}
                        courseName={selectedCourse?.name}
                        onTimerStart={handleTimerStart}
                        onTimerPause={handleTimerPause}
                      />
                    </div>
                  </>
                )}
              </TabsContent>

              <TabsContent value='progress' className='space-y-6'>
                <div className='text-center mb-8'>
                  <h2 className='text-2xl font-serif mt-2 font-bold text-foreground mb-2'>
                    Tu Progreso de Estudio
                  </h2>
                  <p className='text-muted-foreground'>
                    Visualiza tu constancia, logros y estadísticas de
                    aprendizaje
                  </p>
                </div>

                <ProgressTracking courses={courses} sessions={studySessions} />
              </TabsContent>

              <TabsContent value='motivation' className='space-y-6'>
                <div className='max-w-2xl mx-auto'>
                  <div className='text-center mb-8'>
                    <h2 className='text-2xl mt-2 font-serif font-bold text-foreground mb-2'>
                      Centro de Motivación
                    </h2>
                    <p className='text-muted-foreground'>
                      Mensajes motivacionales para mantener la inspiración
                      durante tus estudios
                    </p>
                  </div>

                  <MotivationalMessages showCustomization={true} />
                </div>
              </TabsContent>
            </Tabs>

            {/* Create Course Modal */}
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogContent className='max-w-2xl'>
                <DialogHeader>
                  <DialogTitle className='font-serif text-xl flex items-center gap-2'>
                    <Plus className='w-5 h-5 text-primary' />
                    Registrar Nuevo Curso
                  </DialogTitle>
                  <DialogDescription>
                    Añade un nuevo curso a tu plan de estudios y comienza tu
                    viaje de aprendizaje
                  </DialogDescription>
                </DialogHeader>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Nombre del Curso</Label>
                    <Input
                      id='name'
                      value={newCourse.name}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, name: e.target.value })
                      }
                      placeholder='Ej: Matemáticas Avanzadas'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='description'>Descripción</Label>
                    <Textarea
                      id='description'
                      value={newCourse.description}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          description: e.target.value,
                        })
                      }
                      placeholder='Describe brevemente el contenido del curso'
                      rows={3}
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='duration'>Duración (semanas)</Label>
                      <div className='space-y-3'>
                        <input
                          type='range'
                          id='duration'
                          min='1'
                          max='52'
                          step='1'
                          value={newCourse.duration || 1}
                          onChange={(e) =>
                            setNewCourse({
                              ...newCourse,
                              duration: e.target.value,
                            })
                          }
                          className='w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider'
                        />
                        <div className='flex items-center justify-between'>
                          <span className='text-sm text-muted-foreground'>
                            1 semana
                          </span>
                          <span className='text-sm font-medium'>
                            {newCourse.duration || 1} semanas
                          </span>
                          <span className='text-sm text-muted-foreground'>
                            52 semanas
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='edit-frequency'>
                        Frecuencia (sesiones por semana)
                      </Label>
                      <Select
                        value={newCourse.frequency}
                        onValueChange={(value) =>
                          setNewCourse({ ...newCourse, frequency: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(7)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1} ve{i + 1 > 1 ? 'ces' : 'z'} por semana
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='schedule'>Horario (opcional)</Label>
                    <Input
                      id='schedule'
                      value={newCourse.schedule}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, schedule: e.target.value })
                      }
                      placeholder='Ej: Lunes y Miércoles 18:00-20:00'
                    />
                  </div>

                  <div className='flex gap-2 pt-4'>
                    <Button
                      onClick={handleAddCourse}
                      className='bg-primary hover:bg-primary/90'
                      aria-label='Guardar y registrar el nuevo curso'
                    >
                      <BookOpen className='w-4 h-4 mr-2' />
                      Registrar Curso
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setShowCreateModal(false)
                        setNewCourse({
                          name: '',
                          description: '',
                          duration: '',
                          frequency: '',
                          schedule: '',
                          createdAt: getDateToday(),
                        })
                      }}
                      aria-label='Cancelar la creación del curso'
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Show Course Modal */}
            <Dialog
              open={showShowCourseModal}
              onOpenChange={setShowShowCourseModal}
            >
              <DialogContent className='max-w-2xl'>
                <DialogHeader>
                  <DialogTitle className='font-serif text-xl flex items-center gap-2'>
                    <BookOpen className='w-5 h-5 text-primary' />
                    Detalles del Curso
                  </DialogTitle>
                  <DialogDescription>
                    Visualiza la información detallada de tu curso &quot;
                    {selectedCourse?.name}&quot;
                  </DialogDescription>
                  {selectedCourse?.createdAt && (
                    <DialogDescription className='text-sm text-muted-foreground'>
                      Curso creado el {selectedCourse?.createdAt}
                    </DialogDescription>
                  )}
                </DialogHeader>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='show-name'>Nombre del Curso</Label>
                    <Input
                      id='show-name'
                      value={selectedCourse?.name}
                      disabled
                      className='bg-muted'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='show-description'>Descripción</Label>
                    <Textarea
                      id='show-description'
                      value={selectedCourse?.description}
                      disabled
                      className='bg-muted'
                      rows={3}
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='show-duration'>Duración</Label>
                      <Input
                        id='show-duration'
                        value={selectedCourse?.duration + ' semanas'}
                        disabled
                        className='bg-muted'
                      />
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='show-frequency'>Frecuencia</Label>
                    <Input
                      id='show-frequency'
                      value={
                        selectedCourse?.frequency +
                        ' ve' +
                        (selectedCourse?.frequency &&
                        selectedCourse?.frequency > 1
                          ? 'ces'
                          : 'z') +
                        ' por semana'
                      }
                      disabled
                      className='bg-muted'
                    />
                  </div>

                  {selectedCourse?.schedule && (
                    <div className='space-y-2'>
                      <Label htmlFor='show-schedule'>Horario</Label>
                      <Input
                        id='show-schedule'
                        value={selectedCourse.schedule}
                        disabled
                        className='bg-muted'
                      />
                    </div>
                  )}

                  <div className='flex gap-2 pt-4'>
                    <Button
                      onClick={() => addCourseToGoogleCalendar(selectedCourse!)}
                      className='bg-primary hover:bg-primary/90'
                      aria-label={`Agregar curso ${selectedCourse?.name} a Google Calendar`}
                    >
                      <Calendar className='w-4 h-4 mr-2' />
                      Agregar a Google Calendar
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() => setShowShowCourseModal(false)}
                      aria-label='Cerrar la vista de detalles del curso'
                    >
                      Cerrar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Course Modal */}
            <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
              <DialogContent className='max-w-2xl'>
                <DialogHeader>
                  <DialogTitle className='font-serif text-xl flex items-center gap-2'>
                    <BookOpen className='w-5 h-5 text-primary' />
                    Editar Curso
                  </DialogTitle>
                  <DialogDescription>
                    Modifica la información de tu curso &quot;
                    {editingCourse?.name}
                    &quot;
                  </DialogDescription>
                </DialogHeader>

                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='edit-name'>Nombre del Curso</Label>
                    <Input
                      id='edit-name'
                      value={newCourse.name}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, name: e.target.value })
                      }
                      placeholder='Ej: Matemáticas Avanzadas'
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='edit-description'>Descripción</Label>
                    <Textarea
                      id='edit-description'
                      value={newCourse.description}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          description: e.target.value,
                        })
                      }
                      placeholder='Describe brevemente el contenido del curso'
                      rows={3}
                    />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='edit-duration'>Duración (semanas)</Label>
                      <Select
                        value={newCourse.duration}
                        onValueChange={(value) =>
                          setNewCourse({ ...newCourse, duration: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(52)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1} semana{i + 1 > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='edit-frequency'>
                        Frecuencia (sesiones por semana)
                      </Label>
                      <Select
                        value={newCourse.frequency}
                        onValueChange={(value) =>
                          setNewCourse({ ...newCourse, frequency: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(7)].map((_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1} ve{i + 1 > 1 ? 'ces' : 'z'} por semana
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='edit-schedule'>Horario (opcional)</Label>
                    <Input
                      id='edit-schedule'
                      value={newCourse.schedule}
                      onChange={(e) =>
                        setNewCourse({ ...newCourse, schedule: e.target.value })
                      }
                      placeholder='Ej: Lunes y Miércoles 18:00-20:00'
                    />
                  </div>

                  <div className='flex gap-2 pt-4'>
                    <Button
                      onClick={handleUpdateCourse}
                      className='bg-primary hover:bg-primary/90'
                      aria-label='Guardar los cambios realizados al curso'
                    >
                      <BookOpen className='w-4 h-4 mr-2' />
                      Actualizar Curso
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setShowEditForm(false)
                        setEditingCourse(null)
                        setNewCourse({
                          name: '',
                          description: '',
                          duration: '',
                          frequency: '',
                          schedule: '',
                          createdAt: getDateToday(),
                        })
                      }}
                      aria-label='Cancelar la edición del curso'
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog
              open={showDeleteConfirm}
              onOpenChange={setShowDeleteConfirm}
            >
              <DialogContent className='max-w-md'>
                <DialogHeader>
                  <DialogTitle className='font-serif text-xl flex items-center gap-2'>
                    <Trash2 className='w-5 h-5 text-destructive' />
                    Confirmar Eliminación
                  </DialogTitle>
                  <DialogDescription>
                    ¿Estás seguro de que quieres eliminar el curso &quot;
                    {courseToDelete?.name}&quot;?
                  </DialogDescription>
                </DialogHeader>

                <div className='space-y-4'>
                  <div className='p-4 bg-destructive/10 border border-destructive/20 rounded-lg'>
                    <p className='text-sm text-red-500'>
                      <strong>⚠️ Atención:</strong> Esta acción no se puede
                      deshacer. Se eliminarán también todas las sesiones de
                      estudio relacionadas con este curso.
                    </p>
                  </div>

                  <div className='flex gap-2 pt-2'>
                    <Button
                      onClick={confirmDeleteCourse}
                      variant='destructive'
                      className='flex-1'
                      aria-label={`Confirmar eliminación del curso ${courseToDelete?.name}`}
                    >
                      <Trash2 className='w-4 h-4 mr-2' />
                      Eliminar Curso
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setShowDeleteConfirm(false)
                        setCourseToDelete(null)
                      }}
                      className='flex-1'
                      aria-label='Cancelar la eliminación del curso'
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
