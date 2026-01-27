import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/ui/common/ui/card'
import { TrendingUp, BookOpen } from 'lucide-react'
import { Course } from '../../../domain/entities'

export function CoursesProgress({ courses }: { courses: Course[] }) {
  if (courses.length === 0)
    return (
      <div className='text-center py-20 bg-primary/5 rounded-[2rem] border border-primary/10'>
        <BookOpen className='w-16 h-16 mx-auto mb-4 text-muted-foreground/20' />
        <p className='text-sm font-bold uppercase tracking-widest text-muted-foreground/40'>
          No hay cursos registrados aún
        </p>
      </div>
    )

  return (
    <Card className='border-none bg-card/40 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden border border-primary/5'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-lg flex items-center gap-2 font-bold'>
          <TrendingUp className='w-5 h-5 text-primary' />
          Progreso Detallado
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-8 p-6'>
        {courses.map((course) => (
          <div key={course.id} className='space-y-4 group'>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <h4 className='font-bold text-foreground text-lg tracking-tight group-hover:text-primary transition-colors'>
                  {course.name}
                </h4>
                <p className='text-[10px] items-center flex gap-1.5 uppercase font-bold tracking-widest text-muted-foreground'>
                  {course.sessionsCompleted} sesiones de {course.totalSessions}
                </p>
              </div>
              <div className='bg-primary/10 text-primary px-4 py-1.5 rounded-full font-black text-sm border border-primary/20'>
                {course.progress}%
              </div>
            </div>
            <div className='h-3 w-full bg-primary/10 rounded-full overflow-hidden'>
              <div
                className='h-full bg-primary shadow-[0_0_10px_rgba(255,122,33,0.3)]'
                style={{ width: `${course.progress}%` }}
              />
            </div>
            <div className='flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground px-1'>
              <span>Iniciado</span>
              <span>
                {course.progress === 100
                  ? 'Completado'
                  : `${course.totalSessions - course.sessionsCompleted} restantes`}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
