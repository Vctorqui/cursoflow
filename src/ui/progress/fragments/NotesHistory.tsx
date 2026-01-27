import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/ui/common/ui/card'
import { Calendar, Clock, BookOpen } from 'lucide-react'
import { StudySession } from '../../../domain/entities'

export function NotesHistory({ sessions }: { sessions: StudySession[] }) {
  const sessionsWithNotes = sessions
    .filter((s) => s.notes && s.notes.trim() !== '')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (sessionsWithNotes.length === 0) {
    return (
      <div className='text-center py-20 bg-white/5 rounded-[2rem] border border-white/5'>
        <BookOpen className='w-16 h-16 mx-auto mb-4 text-muted-foreground/20' />
        <p className='text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/40'>
          No has guardado notas aún
        </p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-6'>
      {sessionsWithNotes.map((session) => (
        <Card
          key={session.id}
          className='border-none bg-card/40 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden group hover:bg-card/60 transition-all border border-primary/5'
        >
          <CardHeader className='bg-primary/5 py-4 px-8 border-b border-primary/10'>
            <div className='flex justify-between items-center'>
              <div className='space-y-0.5'>
                <p className='text-[10px] uppercase font-bold tracking-[0.2em] text-primary/80'>
                  Curso
                </p>
                <CardTitle className='text-lg font-black text-foreground'>
                  {session.courseName}
                </CardTitle>
              </div>
              <div className='flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
                <div className='flex items-center gap-1.5'>
                  <Calendar className='w-3 h-3 text-primary' />
                  {new Date(session.date).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </div>
                <div className='flex items-center gap-1.5'>
                  <Clock className='w-3 h-3 text-primary' />
                  {session.duration}min
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className='p-8'>
            <div className='relative'>
              <div className='absolute -left-4 top-0 bottom-0 w-1 bg-primary/20 rounded-full' />
              <p className='text-sm text-foreground font-medium leading-relaxed whitespace-pre-wrap italic'>
                &quot;{session.notes}&quot;
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
