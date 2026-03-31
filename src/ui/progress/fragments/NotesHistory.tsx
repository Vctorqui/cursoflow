'use client'

import { useMemo, useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/ui/common/ui/card'
import { Badge } from '@/src/ui/common/ui/badge'
import { Calendar, Clock, BookOpen } from 'lucide-react'
import { Course, StudySession } from '../../../domain/entities'
import {
  collectAllTagsForNotes,
  getSessionTags,
  sessionMatchesNoteTag,
} from '../../../domain/tags'
import { cn } from '@/src/lib/utils'

interface NotesHistoryProps {
  sessions: StudySession[]
  courses: Course[]
}

export function NotesHistory({ sessions, courses }: NotesHistoryProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const sessionsWithNotes = useMemo(
    () =>
      sessions
        .filter((s) => s.notes && s.notes.trim() !== '')
        .sort(
          (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
    [sessions],
  )

  const filterTags = useMemo(
    () => collectAllTagsForNotes(sessions, courses),
    [sessions, courses],
  )

  const filteredSessions = useMemo(() => {
    if (!activeTag) return sessionsWithNotes
    return sessionsWithNotes.filter((s) =>
      sessionMatchesNoteTag(s, courses, activeTag),
    )
  }, [sessionsWithNotes, courses, activeTag])

  const coursesForActiveTag = useMemo(() => {
    if (!activeTag) return []
    return courses.filter((c) =>
      (c.tags ?? []).some(
        (t) => t.toLowerCase() === activeTag.toLowerCase(),
      ),
    )
  }, [courses, activeTag])

  if (sessionsWithNotes.length === 0) {
    return (
      <div className='rounded-[2rem] border border-white/5 bg-white/5 py-20 text-center'>
        <BookOpen className='mx-auto mb-4 h-16 w-16 text-muted-foreground/20' />
        <p className='text-xs font-bold tracking-[0.3em] text-muted-foreground/40 uppercase'>
          No has guardado notas aún
        </p>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {filterTags.length > 0 ? (
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
          <span className='shrink-0 text-[10px] font-black tracking-widest text-muted-foreground uppercase'>
            Filtrar por etiqueta
          </span>
          <div className='flex flex-wrap gap-2'>
            <button
              type='button'
              onClick={() => setActiveTag(null)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-xs font-bold transition',
                activeTag === null
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-primary/15 bg-muted/40 text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              Todos
            </button>
            {filterTags.map((tag) => {
              const selected =
                activeTag !== null &&
                tag.toLowerCase() === activeTag.toLowerCase()
              return (
                <button
                  key={tag}
                  type='button'
                  onClick={() =>
                    setActiveTag(selected ? null : tag)
                  }
                  className={cn(
                    'rounded-full border px-4 py-1.5 text-xs font-bold transition',
                    selected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-primary/15 bg-muted/40 text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  )}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      {activeTag && coursesForActiveTag.length > 0 ? (
        <Card className='rounded-[1.5rem] border border-primary/10 bg-card/40'>
          <CardHeader className='py-4'>
            <CardTitle className='text-sm font-black tracking-tight'>
              Cursos con la etiqueta &quot;{activeTag}&quot;
            </CardTitle>
          </CardHeader>
          <CardContent className='flex flex-wrap gap-2 pb-6 pt-0'>
            {coursesForActiveTag.map((c) => (
              <Badge
                key={c.id}
                variant='secondary'
                className='rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary'
              >
                {c.name}
              </Badge>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {filteredSessions.length === 0 ? (
        <div className='rounded-[2rem] border border-white/5 bg-white/5 py-16 text-center'>
          <p className='text-sm font-medium text-muted-foreground'>
            No hay notas con esta etiqueta.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6'>
          {filteredSessions.map((session) => {
            const displayTags = getSessionTags(session, courses)
            return (
              <Card
                key={session.id}
                className='group overflow-hidden rounded-[2rem] border border-primary/5 bg-card/40 shadow-2xl backdrop-blur-md transition hover:bg-card/60'
              >
                <CardHeader className='border-b border-primary/10 bg-primary/5 px-8 py-4'>
                  <div className='flex items-center justify-between'>
                    <div className='space-y-0.5'>
                      <p className='text-[10px] font-bold tracking-[0.2em] text-primary/80 uppercase'>
                        Curso
                      </p>
                      <CardTitle className='text-lg font-black text-foreground'>
                        {session.courseName}
                      </CardTitle>
                    </div>
                    <div className='flex items-center gap-4 text-[10px] font-black tracking-widest text-muted-foreground uppercase'>
                      <div className='flex items-center gap-1.5'>
                        <Calendar className='h-3 w-3 text-primary' />
                        {new Date(session.date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </div>
                      <div className='flex items-center gap-1.5'>
                        <Clock className='h-3 w-3 text-primary' />
                        {session.duration}min
                      </div>
                    </div>
                  </div>
                  {displayTags.length > 0 ? (
                    <div className='mt-3 flex flex-wrap gap-1.5'>
                      {displayTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant='outline'
                          className='rounded-full border-primary/25 bg-background/50 px-2 py-0 text-[10px] font-bold tracking-wide text-primary uppercase'
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </CardHeader>
                <CardContent className='p-8'>
                  <div className='relative'>
                    <div className='absolute top-0 bottom-0 -left-4 w-1 rounded-full bg-primary/20' />
                    <p className='text-sm leading-relaxed font-medium whitespace-pre-wrap text-foreground italic'>
                      &quot;{session.notes}&quot;
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
