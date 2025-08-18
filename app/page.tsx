'use client'

import { useState, useEffect } from 'react'
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
  Timer,
  Heart,
  TrendingUp,
  Lock,
  Edit,
  Trash2,
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { ThemeToggle } from '@/components/theme-toggle'

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
  const [courses, setCourses] = useState<Course[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cursoflow-courses')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cursoflow-sessions')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

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
  })

  const [activeTab, setActiveTab] = useState('courses')
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  useEffect(() => {
    localStorage.setItem('cursoflow-courses', JSON.stringify(courses))
  }, [courses])

  useEffect(() => {
    localStorage.setItem('cursoflow-sessions', JSON.stringify(studySessions))
  }, [studySessions])

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
      }

      setCourses([...courses, course])
      setNewCourse({
        name: '',
        description: '',
        duration: '',
        frequency: '',
        schedule: '',
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
      const updatedCourse: Course = {
        ...editingCourse,
        name: newCourse.name,
        description: newCourse.description,
        duration: Number.parseInt(newCourse.duration),
        frequency: Number.parseInt(newCourse.frequency),
        schedule: newCourse.schedule,
        totalSessions:
          Number.parseInt(newCourse.duration) *
          Number.parseInt(newCourse.frequency),
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
      })
      setEditingCourse(null)
      setShowEditForm(false)

      toast({
        title: 'Curso actualizado',
        description: `Curso "${updatedCourse.name}" actualizado con éxito.`,
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

      // Update course progress
      setCourses(
        courses.map((course) => {
          if (course.id === selectedCourse.id) {
            const newSessionsCompleted = course.sessionsCompleted + 1
            const newProgress = Math.round(
              (newSessionsCompleted / course.totalSessions) * 100
            )
            return {
              ...course,
              sessionsCompleted: newSessionsCompleted,
              progress: Math.min(newProgress, 100),
            }
          }
          return course
        })
      )
    }
  }

  const handleTimerStart = () => {
    setIsTimerRunning(true)
  }

  const handleTimerPause = () => {
    setIsTimerRunning(false)
  }

  const startStudySession = (course: Course) => {
    setSelectedCourse(course)
    setActiveTab('study')
  }

  return (
    <div className='min-h-screen bg-background flex flex-col'>
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
        {isTimerRunning && (
          <div className='mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-2'>
            <Lock className='w-4 h-4 text-primary' />
            <span className='text-sm text-primary font-medium'>
              Sesión de estudio activa - Los tabs están bloqueados para mantener
              tu concentración
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
                          <Badge variant='secondary'>{course.duration}w</Badge>
                          <div className='flex gap-1'>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleEditCourse(course)}
                              className='h-8 w-8 p-0 hover:bg-muted'
                            >
                              <Edit className='w-4 h-4 text-muted-foreground hover:text-primary' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleDeleteCourse(course.id)}
                              className='h-8 w-8 p-0 hover:bg-muted hover:text-destructive'
                            >
                              <Trash2 className='w-4 h-4 text-muted-foreground hover:text-destructive' />
                            </Button>
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
                        <Progress value={course.progress} className='h-2' />
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
                            {course.sessionsCompleted}/{course.totalSessions}
                          </span>
                        </div>
                      </div>

                      {course.schedule && (
                        <div className='text-sm text-muted-foreground bg-muted p-2 rounded'>
                          <strong>Horario:</strong> {course.schedule}
                        </div>
                      )}

                      <Button
                        className='w-full bg-primary hover:bg-primary/90'
                        size='sm'
                        onClick={() => startStudySession(course)}
                      >
                        <Play className='w-4 h-4 mr-2' />
                        Iniciar Sesión
                      </Button>
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
                Visualiza tu constancia, logros y estadísticas de aprendizaje
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
                  Mensajes motivacionales para mantener la inspiración durante
                  tus estudios
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
                Añade un nuevo curso a tu plan de estudios y comienza tu viaje
                de aprendizaje
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
                  <Select
                    onValueChange={(value) =>
                      setNewCourse({ ...newCourse, duration: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona duración' />
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
                  <Label htmlFor='frequency'>
                    Frecuencia (sesiones por semana)
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setNewCourse({ ...newCourse, frequency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Selecciona frecuencia' />
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
                    })
                  }}
                >
                  Cancelar
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
                Modifica la información de tu curso "{editingCourse?.name}"
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
                    })
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className='max-w-md'>
            <DialogHeader>
              <DialogTitle className='font-serif text-xl flex items-center gap-2'>
                <Trash2 className='w-5 h-5 text-destructive' />
                Confirmar Eliminación
              </DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que quieres eliminar el curso "
                {courseToDelete?.name}"?
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-4'>
              <div className='p-4 bg-destructive/10 border border-destructive/20 rounded-lg'>
                <p className='text-sm text-red-500'>
                  <strong>⚠️ Atención:</strong> Esta acción no se puede
                  deshacer. Se eliminarán también todas las sesiones de estudio
                  relacionadas con este curso.
                </p>
              </div>

              <div className='flex gap-2 pt-2'>
                <Button
                  onClick={confirmDeleteCourse}
                  variant='destructive'
                  className='flex-1'
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
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                Desarrollado con ❤️ por <span className="font-medium text-foreground"><a href="https://www.linkedin.com/in/victorqui/" target="_blank" rel="noopener noreferrer" className='text-primary hover:underline'>Victor Quiñones</a></span>
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs text-muted-foreground">
                CursoFlow v0.1.0 - Tu compañero de estudio constante
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
