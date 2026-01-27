import { Button } from '@/src/ui/common/ui/button'
import { Play, Pause, RotateCcw } from 'lucide-react'

interface TimerControlsProps {
  isRunning: boolean
  timeLeft: number
  duration: number
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export function TimerControls({
  isRunning,
  timeLeft,
  duration,
  onStart,
  onPause,
  onReset,
}: TimerControlsProps) {
  return (
    <div className='flex justify-center gap-4'>
      {!isRunning ? (
        <Button
          onClick={onStart}
          className='h-16 px-10 rounded-[2rem] bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 transition-all active:scale-95 font-black text-lg gap-3'
          disabled={timeLeft === 0}
        >
          <Play className='w-6 h-6 fill-current' /> Iniciar
        </Button>
      ) : (
        <Button
          onClick={onPause}
          variant='ghost'
          className='h-16 px-10 rounded-[2rem] bg-primary/5 hover:bg-primary/10 border border-primary/10 backdrop-blur-md active:scale-95 text-lg font-bold gap-3'
        >
          <Pause className='w-6 h-6 fill-current' /> Pausar
        </Button>
      )}
      <Button
        onClick={onReset}
        variant='ghost'
        className='w-16 h-16 rounded-[2rem] bg-primary/5 hover:bg-primary/10 border border-primary/10 backdrop-blur-md active:scale-95 p-0 flex items-center justify-center'
        disabled={timeLeft === duration * 60 && !isRunning}
      >
        <RotateCcw className='w-6 h-6' />
      </Button>
    </div>
  )
}
