'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/ui/common/ui/card'
import { Button } from '@/src/ui/common/ui/button'
import { Badge } from '@/src/ui/common/ui/badge'
import { Progress } from '@/src/ui/common/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/ui/common/ui/tooltip'
import {
  Eye,
  Edit,
  Trash2,
  Calendar,
  Target,
  Clock,
  Play,
  Check,
} from 'lucide-react'
import { Course } from '../../domain/entities'

interface CourseCardProps {
  course: Course
  onShow: (course: Course) => void
  onEdit: (course: Course) => void
  onDelete: (id: string) => void
  onCalendar: (course: Course) => void
  onStartSession: (course: Course) => void
}

export function CourseCard({
  course,
  onShow,
  onEdit,
  onDelete,
  onCalendar,
  onStartSession,
}: CourseCardProps) {
  const isCompleted = course.progress === 100

  return (
    <Card className='border-border shadow-lg hover:shadow-xl transition-shadow'>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <CardTitle className='font-serif text-lg line-clamp-2'>
              {course.name}
            </CardTitle>
            <CardDescription className='mt-2 line-clamp-2'>
              {course.description}
            </CardDescription>
          </div>
          <CardActions
            course={course}
            onShow={onShow}
            onEdit={onEdit}
            onDelete={onDelete}
            onCalendar={onCalendar}
          />
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Progreso</span>
            <span className='font-medium'>{course.progress}%</span>
          </div>
          <Progress value={course.progress} className='h-2' />
        </div>

        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div className='flex items-center gap-2'>
            <Target className='w-4 h-4 text-primary' />
            <span className='text-muted-foreground'>
              {course.frequency}x/semana
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Clock className='w-4 h-4 text-accent' />
            <span className='text-muted-foreground'>
              {course.sessionsCompleted}/{course.totalSessions}
            </span>
          </div>
        </div>

        {course.schedule && (
          <div className='text-sm text-muted-foreground bg-muted p-2 rounded'>
            <strong>Horario:</strong> {course.schedule}
          </div>
        )}

        <CourseActionButton
          isCompleted={isCompleted}
          course={course}
          onStartSession={onStartSession}
          onCalendar={onCalendar}
        />
      </CardContent>
    </Card>
  )
}

interface CardActionsProps {
  course: Course
  onShow: (course: Course) => void
  onEdit: (course: Course) => void
  onDelete: (id: string) => void
  onCalendar: (course: Course) => void
}

function CardActions({
  course,
  onShow,
  onEdit,
  onDelete,
  onCalendar,
}: CardActionsProps) {
  return (
    <div className='flex items-center gap-2 ml-2'>
      <Badge variant='secondary'>{course.duration}w</Badge>
      <div className='flex gap-1'>
        <ActionIcon
          icon={Eye}
          label='Ver detalles'
          onClick={() => onShow(course)}
        />
        <ActionIcon
          icon={Edit}
          label='Editar curso'
          onClick={() => onEdit(course)}
        />
        <ActionIcon
          icon={Trash2}
          label='Eliminar curso'
          onClick={() => onDelete(course.id)}
        />
        <ActionIcon
          icon={Calendar}
          label='Agregar a Google Calendar'
          onClick={() => onCalendar(course)}
        />
      </div>
    </div>
  )
}

interface ActionIconProps {
  icon: any
  label: string
  onClick: () => void
}

function ActionIcon({ icon: Icon, label, onClick }: ActionIconProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            onClick={onClick}
            className='h-8 w-8 p-0'
          >
            <Icon className='w-4 h-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

interface CourseActionButtonProps {
  isCompleted: boolean
  course: Course
  onStartSession: (course: Course) => void
  onCalendar: (course: Course) => void
}

function CourseActionButton({
  isCompleted,
  course,
  onStartSession,
  onCalendar,
}: CourseActionButtonProps) {
  if (isCompleted) {
    return (
      <Button
        disabled
        className='w-full bg-primary disabled:bg-primary/90'
        size='sm'
      >
        <Check className='w-4 h-4 mr-2' /> Curso Completado
      </Button>
    )
  }

  return (
    <div className='flex flex-col gap-2'>
      <Button
        className='w-full bg-primary hover:bg-primary/90'
        size='sm'
        onClick={() => onStartSession(course)}
      >
        <Play className='w-4 h-4 mr-2' /> Iniciar Sesión
      </Button>
      <Button
        className='w-full bg-primary hover:bg-primary/90'
        size='sm'
        onClick={() => onCalendar(course)}
      >
        <Calendar className='w-4 h-4 mr-2' /> Agregar al Calendario
      </Button>
    </div>
  )
}
