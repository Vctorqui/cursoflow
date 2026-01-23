import { Course, CourseRepository, StudySession } from '../domain/entities'

const COURSES_KEY = 'cursoflow-courses'
const SESSIONS_KEY = 'cursoflow-sessions'

export class LocalStorageCourseRepository implements CourseRepository {
  getCourses(): Course[] {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem(COURSES_KEY)
    if (!saved) return []
    try {
      return JSON.parse(saved)
    } catch (error) {
      console.error('Error parsing courses from localStorage', error)
      return []
    }
  }

  saveCourses(courses: Course[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses))
  }

  getSessions(): StudySession[] {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem(SESSIONS_KEY)
    if (!saved) return []
    try {
      return JSON.parse(saved)
    } catch (error) {
      console.error('Error parsing sessions from localStorage', error)
      return []
    }
  }

  saveSessions(sessions: StudySession[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
  }
}
