import { Check, Pause } from 'lucide-react'

interface CircularTimerProps {
  timeLeft: number
  formatTime: (seconds: number) => string
  duration: number
  circumference: number
  strokeDashoffset: number
  isRunning: boolean
  isCompleted: boolean
}

export function CircularTimer({
  timeLeft,
  formatTime,
  circumference,
  strokeDashoffset,
  isRunning,
  isCompleted,
}: CircularTimerProps) {
  return (
    <div className='flex justify-center'>
      <div className='relative w-48 h-48'>
        <svg
          className='w-full h-full transform -rotate-90'
          viewBox='0 0 200 200'
        >
          <circle
            cx='100'
            cy='100'
            r='90'
            stroke='currentColor'
            strokeWidth='8'
            fill='none'
            className='text-muted'
          />
          <circle
            cx='100'
            cy='100'
            r='90'
            stroke='currentColor'
            strokeWidth='8'
            fill='none'
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ${isCompleted ? 'text-accent' : 'text-primary'}`}
            strokeLinecap='round'
          />
        </svg>
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <div
            className={`text-6xl font-black tracking-tight ${isCompleted ? 'text-accent' : 'text-foreground'}`}
          >
            {formatTime(timeLeft)}
          </div>
          <div className='text-[10px] items-center gap-1.5 flex uppercase font-bold tracking-[0.2em] text-muted-foreground mt-4'>
            {isCompleted ? (
              <Check className='w-4 h-4 text-green-500' />
            ) : isRunning ? (
              <span className='w-2 h-2 rounded-full bg-primary animate-pulse' />
            ) : (
              <Pause className='w-3 h-3' />
            )}
            {isCompleted ? 'Finalizado' : isRunning ? 'En Curso' : 'En Pausa'}
          </div>
        </div>
      </div>
    </div>
  )
}
