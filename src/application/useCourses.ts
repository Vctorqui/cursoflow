import { useState, useEffect, useCallback } from 'react'
import {
  Course,
  StudySession,
  CourseRepository,
  CourseInputData,
} from '../domain/entities'
import { LocalStorageCourseRepository } from '../infrastructure/repositories'
import { useToast } from '@/src/hooks/use-toast'

const repository: CourseRepository = new LocalStorageCourseRepository()

export function useCourses() {
  const { toast } = useToast()
  const [courses, setCourses] = useState<Course[]>([])
  const [studySessions, setStudySessions] = useState<StudySession[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load initial data
  useEffect(() => {
    setCourses(repository.getCourses())
    setStudySessions(repository.getSessions())
    setIsLoaded(true)
  }, [])

  // Sync to repository
  useEffect(() => {
    if (isLoaded) {
      repository.saveCourses(courses)
    }
  }, [courses, isLoaded])

  useEffect(() => {
    if (isLoaded) {
      repository.saveSessions(studySessions)
    }
  }, [studySessions, isLoaded])

  const recalculateProgress = useCallback(() => {
    setCourses((prevCourses: Course[]) =>
      prevCourses.map((course: Course) => {
        const actualSessions = studySessions.filter(
          (session: StudySession) =>
            session.courseId === course.id && session.completed,
        ).length

        const newProgress = Math.round(
          (actualSessions / course.totalSessions) * 100,
        )

        return {
          ...course,
          sessionsCompleted: actualSessions,
          progress: Math.min(newProgress, 100),
        }
      }),
    )
  }, [studySessions])

  useEffect(() => {
    if (isLoaded) {
      recalculateProgress()
    }
  }, [studySessions, isLoaded, recalculateProgress])

  const addCourse = (newCourseData: CourseInputData) => {
    const duration = Number.parseInt(newCourseData.duration)
    const frequency = Number.parseInt(newCourseData.frequency)

    const course: Course = {
      id: Date.now().toString(),
      name: newCourseData.name,
      description: newCourseData.description,
      duration,
      frequency,
      schedule: newCourseData.schedule,
      progress: 0,
      sessionsCompleted: 0,
      totalSessions: duration * frequency,
      createdAt: new Date().toLocaleDateString('es-ES'),
    }

    setCourses([...courses, course])
    toast({
      title: 'Curso registrado',
      description: `Curso "${course.name}" registrado con éxito.`,
    })
    return course
  }

  const updateCourse = (id: string, updatedData: CourseInputData) => {
    const duration = updatedData.duration
      ? Number.parseInt(updatedData.duration)
      : undefined
    const frequency = updatedData.frequency
      ? Number.parseInt(updatedData.frequency)
      : undefined

    setCourses((prev: Course[]) =>
      prev.map((c: Course) => {
        if (c.id !== id) return c

        const newDuration = duration ?? c.duration
        const newFrequency = frequency ?? c.frequency

        return {
          ...c,
          ...updatedData,
          duration: newDuration,
          frequency: newFrequency,
          totalSessions: newDuration * newFrequency,
        }
      }),
    )
    toast({
      title: 'Curso actualizado',
      description: 'Los cambios se han guardado correctamente.',
    })
  }

  const deleteCourse = (id: string) => {
    const course = courses.find((c: Course) => c.id === id)
    setCourses((prev: Course[]) => prev.filter((c: Course) => c.id !== id))
    setStudySessions((prev: StudySession[]) =>
      prev.filter((s: StudySession) => s.courseId !== id),
    )
    toast({
      title: 'Curso eliminado',
      description: `Curso "${course?.name}" eliminado con éxito.`,
    })
  }

  const addSession = (
    courseId: string,
    courseName: string,
    duration: number,
  ) => {
    const newSession: StudySession = {
      id: Date.now().toString(),
      courseId,
      courseName,
      date: new Date().toISOString(),
      duration,
      completed: true,
    }
    setStudySessions((prev: StudySession[]) => [...prev, newSession])
  }

  return {
    courses,
    studySessions,
    isLoaded,
    addCourse,
    updateCourse,
    deleteCourse,
    addSession,
  }
}
