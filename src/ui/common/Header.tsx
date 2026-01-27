'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/src/ui/common/ui/button'
import { ThemeCustomizer } from '@/src/ui/common/ThemeCustomizer'
import { ThemeToggle } from '@/src/ui/common/theme-toggle'
import { BackupActions } from '@/src/ui/common/BackupActions'
import { Course } from '@/src/domain/entities'

interface HeaderProps {
  onNewCourse: () => void
  isTimerRunning: boolean
  courses: Course[]
  sessions: any[]
  onImport: (data: any) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function Header({
  onNewCourse,
  isTimerRunning,
  courses,
  sessions,
  onImport,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className='border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50'>
      <div className='container mx-auto px-4 h-16 flex items-center justify-between gap-2 md:gap-4'>
        <div className='flex items-center gap-2 flex-shrink-0'>
          <h1 className='text-xl md:text-2xl font-serif font-bold text-primary'>
            CursoFlow
          </h1>
          <p className='hidden lg:block text-[10px] text-muted-foreground uppercase tracking-widest'>
            Tu compañero de estudio
          </p>
        </div>

        <div className='flex-1 max-w-md mx-2 hidden md:block'>
          <div className='relative'>
            <Plus className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
            <input
              type='text'
              placeholder='Buscar cursos...'
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className='w-full bg-muted/50 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary outline-none transition-all'
            />
          </div>
        </div>

        <div className='flex items-center gap-1 md:gap-2'>
          <ThemeCustomizer />
          <ThemeToggle />
          <div className='hidden sm:block'>
            <BackupActions
              courses={courses}
              sessions={sessions}
              onImport={onImport}
            />
          </div>
          <Button
            onClick={onNewCourse}
            disabled={isTimerRunning}
            size='sm'
            className='rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold px-3 md:px-4'
          >
            <Plus className='w-4 h-4 md:mr-2' />{' '}
            <span className='hidden md:inline'>Nuevo Curso</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
