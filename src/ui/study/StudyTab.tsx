'use client'

import { Plus, Timer } from 'lucide-react'
import { Button } from '@/src/ui/common/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/ui/common/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/ui/common/ui/select'
import { PomodoroTimer } from '@/src/ui/timer/PomodoroTimer'
import { Course } from '@/src/domain/entities'

interface StudyTabProps {
  courses: Course[]
  selectedCourse: Course | null
  setSelectedCourse: (course: Course) => void
  isTimerRunning: boolean
  onSessionComplete: (duration: number) => void
  onTimerStart: () => void
  onTimerPause: () => void
  onAddCourse: () => void
}

export function StudyTab({
  courses,
  selectedCourse,
  setSelectedCourse,
  isTimerRunning,
  onSessionComplete,
  onTimerStart,
  onTimerPause,
  onAddCourse,
}: StudyTabProps) {
  if (courses.length === 0) {
    return (
      <div className='text-center py-12'>
        <Timer className='w-16 h-16 mx-auto text-muted-foreground mb-4' />
        <h3 className='text-xl font-serif font-semibold mb-2'>
          Registra un curso primero
        </h3>
        <Button onClick={onAddCourse} className='bg-primary'>
          <Plus className='w-4 h-4 mr-2' /> Registrar Curso
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedCourse?.id || ''}
            onValueChange={(val) => {
              const course = courses.find((c) => c.id === val)
              if (course) setSelectedCourse(course)
            }}
            disabled={isTimerRunning}
          >
            <SelectTrigger>
              <SelectValue placeholder='Selecciona un curso' />
            </SelectTrigger>
            <SelectContent>
              {courses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} ({c.progress}%)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <div className='max-w-md mx-auto'>
        <PomodoroTimer
          onSessionComplete={onSessionComplete}
          courseName={selectedCourse?.name}
          onTimerStart={onTimerStart}
          onTimerPause={onTimerPause}
        />
      </div>
    </div>
  )
}
