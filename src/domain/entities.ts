import { z } from 'zod'

export const CourseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string(),
  duration: z.number().positive(),
  frequency: z.number().positive(),
  schedule: z.string().optional(),
  /** Etiquetas del curso; ausente en datos antiguos = sin etiquetas */
  tags: z.array(z.string()).optional(),
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
  notes: z.string().optional(),
  /** Etiquetas de la nota de sesión; si falta, en UI se usan las del curso */
  tags: z.array(z.string()).optional(),
})

export type StudySession = z.infer<typeof StudySessionSchema>

/** Form + local validation; name matches CourseSchema (min 1, no max). */
export const courseFormInputSchema = z.object({
  name: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1, 'El nombre es obligatorio')),
  description: z.string(),
  duration: z
    .string()
    .min(1, 'Indica la duración en semanas')
    .refine((v) => {
      const n = Number(v)
      return Number.isFinite(n) && n > 0
    }, 'La duración debe ser un número mayor que 0'),
  frequency: z
    .string()
    .min(1, 'Indica las sesiones por semana')
    .refine((v) => {
      const n = Number(v)
      return Number.isFinite(n) && n > 0
    }, 'Las sesiones deben ser un número mayor que 0'),
  schedule: z.string(),
  tags: z.array(z.string()).max(15).default([]),
})

export type CourseFormValues = z.infer<typeof courseFormInputSchema>

export interface CourseInputData {
  name: string
  description: string
  duration: string
  frequency: string
  schedule?: string
  tags: string[]
}

export interface CourseRepository {
  getCourses(): Course[]
  saveCourses(courses: Course[]): void
  getSessions(): StudySession[]
  saveSessions(sessions: StudySession[]): void
}
