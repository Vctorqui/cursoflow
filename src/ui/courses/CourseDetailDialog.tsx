'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/ui/common/ui/dialog'
import { Badge } from '@/src/ui/common/ui/badge'
import { Button } from '@/src/ui/common/ui/button'
import { Progress } from '@/src/ui/common/ui/progress'
import { Calendar, Target, Clock, BookOpen } from 'lucide-react'
import { Course } from '../../domain/entities'

interface CourseDetailDialogProps {
  course: Course | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CourseDetailDialog({
  course,
  open,
  onOpenChange,
}: CourseDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[min(90dvh,calc(100vh-2rem))] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-[2.5rem] border border-primary/10 bg-card/80 p-0 shadow-2xl backdrop-blur-2xl sm:max-w-[520px]'>
        {course ? (
          <>
            <div className='pointer-events-none absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl' />
            <DialogHeader className='shrink-0 space-y-2 px-8 pt-8 pb-4 pr-14 text-left'>
              <DialogTitle className='wrap-break-word text-2xl font-black tracking-tight text-foreground sm:text-3xl'>
                {course.name}
              </DialogTitle>
              <DialogDescription className='text-[10px] font-medium tracking-[0.2em] text-muted-foreground/60 uppercase'>
                Vista de solo lectura
              </DialogDescription>
            </DialogHeader>
            <div className='min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-8 pb-6 [scrollbar-gutter:stable] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border'>
              <div className='space-y-6'>
                <div className='flex flex-wrap items-center gap-2'>
                  <Badge
                    variant='secondary'
                    className='border-none bg-primary/10 px-2 py-0 text-[10px] font-bold tracking-widest text-primary uppercase'
                  >
                    {course.duration} semanas
                  </Badge>
                  <Badge
                    variant='outline'
                    className='rounded-full border-primary/20 text-xs font-semibold text-primary'
                  >
                    {course.frequency}x / semana
                  </Badge>
                </div>

                {(course.tags?.length ?? 0) > 0 ? (
                  <div className='space-y-2'>
                    <p className='text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
                      Etiquetas
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {(course.tags ?? []).map((tag) => (
                        <Badge
                          key={tag}
                          variant='outline'
                          className='rounded-full border-primary/25 bg-primary/5 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-primary uppercase'
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className='space-y-2'>
                  <p className='flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
                    <BookOpen className='h-3.5 w-3.5 text-primary' />
                    Descripción
                  </p>
                  <p className='text-sm leading-relaxed font-medium whitespace-pre-wrap text-foreground'>
                    {course.description.trim() || 'Sin descripción.'}
                  </p>
                </div>

                <div className='space-y-3'>
                  <div className='flex items-end justify-between'>
                    <span className='text-xs font-bold tracking-widest text-muted-foreground uppercase'>
                      Progreso
                    </span>
                    <span className='text-xl font-bold text-primary'>
                      {course.progress}%
                    </span>
                  </div>
                  <Progress value={course.progress} className='h-2 bg-primary/10' />
                  <p className='text-xs text-muted-foreground'>
                    {course.sessionsCompleted} de {course.totalSessions} sesiones
                    completadas
                  </p>
                </div>

                <div className='flex flex-wrap gap-4'>
                  <div className='flex items-center gap-2.5 rounded-2xl border border-primary/10 bg-primary/5 px-3 py-2'>
                    <Target className='h-4 w-4 text-primary' />
                    <span className='text-sm font-semibold'>
                      {course.frequency}x/sem
                    </span>
                  </div>
                  <div className='flex items-center gap-2.5 rounded-2xl border border-primary/10 bg-primary/5 px-3 py-2'>
                    <Clock className='h-4 w-4 text-primary' />
                    <span className='text-sm font-semibold'>
                      {course.sessionsCompleted}/{course.totalSessions}
                    </span>
                  </div>
                </div>

                {course.schedule ? (
                  <div className='flex items-start gap-3 rounded-2xl border border-primary/10 bg-muted/30 p-4'>
                    <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10'>
                      <Calendar className='h-5 w-5 text-primary' />
                    </div>
                    <div className='min-w-0 space-y-0.5'>
                      <p className='text-[10px] font-bold tracking-widest text-muted-foreground uppercase'>
                        Horario
                      </p>
                      <p className='wrap-break-word text-sm font-semibold'>
                        {course.schedule}
                      </p>
                    </div>
                  </div>
                ) : null}

                <p className='text-[10px] text-muted-foreground/70'>
                  Registrado el {course.createdAt}
                </p>
              </div>
            </div>
            <div className='shrink-0 border-t border-primary/10 bg-card/95 px-8 py-4 backdrop-blur-md supports-backdrop-filter:bg-card/80'>
              <Button
                type='button'
                className='h-12 w-full rounded-2xl font-black'
                onClick={() => onOpenChange(false)}
              >
                Cerrar
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
