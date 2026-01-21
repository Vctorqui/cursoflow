import { z } from 'zod'

export const CourseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string(),
  duration: z.number().positive(),
  frequency: z.number().positive(),
  schedule: z.string().optional(),
  progress: z.number().min(0).max(100),
  sessionsCompleted: z.number().min(0),
  totalSessions: z.number().min(1),
  createdAt: z.string(),
})

export type Course = z.infer<typeof CourseSchema>

export const StudySessionSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  courseName: z.string(),
  date: z.string(),
  duration: z.number().positive(),
  completed: z.boolean(),
})

export type StudySession = z.infer<typeof StudySessionSchema>

export interface CourseInputData {
  name: string
  description: string
  duration: string
  frequency: string
  schedule?: string
}

export interface CourseRepository {
  getCourses(): Course[]
  saveCourses(courses: Course[]): void
  getSessions(): StudySession[]
  saveSessions(sessions: StudySession[]): void
}
