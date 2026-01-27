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
import { motion } from 'framer-motion'
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className='border-none bg-card/40 backdrop-blur-md shadow-2xl hover:bg-card/60 transition-all duration-300 rounded-[2rem] overflow-hidden group border border-primary/5'>
        <CardHeader className='pb-4'>
          <div className='flex items-start justify-between gap-4'>
            <div className='space-y-1'>
              <div className='flex items-center gap-2'>
                <CardTitle className='text-2xl font-bold tracking-tight'>
                  {course.name}
                </CardTitle>
                <Badge
                  variant='secondary'
                  className='bg-primary/10 text-primary border-none px-2 py-0 text-[10px] uppercase font-bold tracking-widest'
                >
                  {course.duration}W
                </Badge>
              </div>
              <CardDescription className='text-sm text-muted-foreground leading-relaxed line-clamp-1'>
                {course.description}
              </CardDescription>
            </div>
            <div className='flex gap-1 items-center bg-muted/50 p-1 rounded-xl backdrop-blur-sm border border-primary/10'>
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
            </div>
          </div>
        </CardHeader>

        <CardContent className='space-y-6 pt-0'>
          <div className='space-y-3'>
            <div className='flex justify-between items-end'>
              <span className='text-xs font-bold uppercase tracking-widest text-muted-foreground'>
                Progreso
              </span>
              <span className='text-xl font-bold text-primary'>
                {course.progress}%
              </span>
            </div>
            <div className='h-1.5 w-full bg-primary/10 rounded-full overflow-hidden'>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                className='h-full bg-primary shadow-[0_0_15px_rgba(255,122,33,0.3)]'
              />
            </div>
          </div>

          <div className='flex items-center gap-6 py-2'>
            <div className='flex items-center gap-2.5 bg-primary/5 px-3 py-2 rounded-2xl border border-primary/10'>
              <Target className='w-4 h-4 text-primary' />
              <span className='text-sm font-semibold'>
                {course.frequency}x/sem
              </span>
            </div>
            <div className='flex items-center gap-2.5 bg-primary/5 px-3 py-2 rounded-2xl border border-primary/10'>
              <Clock className='w-4 h-4 text-primary' />
              <span className='text-sm font-semibold'>
                {course.sessionsCompleted}/{course.totalSessions}
              </span>
            </div>
          </div>

          {course.schedule && (
            <div className='flex items-center gap-3 bg-muted/30 p-4 rounded-2xl border border-primary/10'>
              <div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center'>
                <Calendar className='w-5 h-5 text-primary' />
              </div>
              <div className='space-y-0.5'>
                <p className='text-[10px] uppercase font-bold tracking-widest text-muted-foreground'>
                  Horario
                </p>
                <p className='text-xs font-semibold uppercase'>
                  {course.schedule}
                </p>
              </div>
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
    </motion.div>
  )
}

// CardActions removed as its functionality is now integrated directly in CourseCard's CardHeader

interface ActionIconProps {
  icon: any
  label: string
  onClick: () => void
}

function ActionIcon({ icon: Icon, label, onClick }: ActionIconProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          onClick={onClick}
          className='h-8 w-8 p-0 rounded-lg hover:bg-primary/20 hover:text-primary transition-colors'
        >
          <Icon className='w-4 h-4' />
          <span className='sr-only'>{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent className='bg-black border-white/10'>
        <p className='text-[10px] uppercase font-bold tracking-widest'>
          {label}
        </p>
      </TooltipContent>
    </Tooltip>
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
        className='w-full bg-primary/20 text-primary border-none rounded-2xl grayscale opacity-50'
        size='sm'
      >
        <Check className='w-4 h-4 mr-2' /> Curso Completado
      </Button>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-3'>
      <Button
        className='w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-2xl h-12 font-bold transition-all group/btn active:scale-95'
        size='sm'
        onClick={() => onStartSession(course)}
      >
        <Play className='w-4 h-4 mr-2 fill-current group-hover/btn:scale-110 transition-transform' />
        Iniciar Sesión
      </Button>
      <Button
        variant='outline'
        className='w-full border-primary/30 text-primary hover:bg-primary/10 rounded-2xl h-12 font-bold transition-all active:scale-95'
        size='sm'
        onClick={() => onCalendar(course)}
      >
        <Calendar className='w-4 h-4 mr-2' />
        Agregar al Calendario
      </Button>
    </div>
  )
}
