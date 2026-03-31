import type { Course, StudySession } from './entities'

const MAX_TAG_LEN = 40
const MAX_TAGS_PER_ENTITY = 15

/** Trim, cap length, drop empty; dedupe case-insensitively (keeps first spelling). */
export function normalizeTags(input: readonly string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const raw of input) {
    const t = raw.trim().slice(0, MAX_TAG_LEN)
    if (!t) continue
    const key = t.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(t)
    if (out.length >= MAX_TAGS_PER_ENTITY) break
  }
  return out
}

/** Unique display tags from all courses (stable order: first seen). */
export function collectAllTagsFromCourses(courses: readonly Course[]): string[] {
  return normalizeTags(courses.flatMap((c) => c.tags ?? []))
}

/**
 * Tags for a study session: explicit session tags, or fall back to course tags
 * (so older sessions without stored tags still filter with the curso).
 */
export function getSessionTags(
  session: StudySession,
  courses: readonly Course[],
): string[] {
  if (session.tags !== undefined) {
    return normalizeTags(session.tags)
  }
  const course = courses.find((c) => c.id === session.courseId)
  return normalizeTags(course?.tags ?? [])
}

export function tagMatchesFilter(tag: string, filter: string): boolean {
  return tag.trim().toLowerCase() === filter.trim().toLowerCase()
}

export function sessionMatchesNoteTag(
  session: StudySession,
  courses: readonly Course[],
  filterTag: string,
): boolean {
  return getSessionTags(session, courses).some((t) =>
    tagMatchesFilter(t, filterTag),
  )
}

/** Etiquetas únicas para el filtro del historial de notas (sesiones + cursos). */
export function collectAllTagsForNotes(
  sessions: readonly StudySession[],
  courses: readonly Course[],
): string[] {
  const fromSessions = sessions.flatMap((s) => getSessionTags(s, courses))
  const fromCourses = courses.flatMap((c) => c.tags ?? [])
  return normalizeTags([...fromSessions, ...fromCourses])
}
