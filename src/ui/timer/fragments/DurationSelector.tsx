import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/ui/common/ui/select'
import { Input } from '../../common/ui/input'
import { DEFAULT_PRESETS } from '../constants'

interface DurationSelectorProps {
  duration: number
  isRunning: boolean
  onDurationChange: (val: number) => void
}

export function DurationSelector({
  duration,
  isRunning,
  onDurationChange,
}: DurationSelectorProps) {
  const [isCustom, setIsCustom] = useState(false)

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <label className='text-[10px] uppercase font-black tracking-widest text-muted-foreground pl-1'>
          Duración del Bloque
        </label>
        {isCustom && (
          <button
            onClick={() => {
              setIsCustom(false)
              onDurationChange(25)
            }}
            className='text-[10px] font-bold text-primary hover:underline transition-all'
          >
            Volver a ajustes
          </button>
        )}
      </div>

      {!isCustom ? (
        <Select
          value={duration.toString()}
          onValueChange={(val) => {
            if (val === 'custom') {
              setIsCustom(true)
            } else {
              onDurationChange(parseInt(val))
            }
          }}
          disabled={isRunning}
        >
          <SelectTrigger
            className='rounded-2xl bg-primary/5 border-primary/10 h-12 font-semibold transition-all hover:bg-primary/10'
            aria-label={`Seleccionar duración. Actual: ${duration} min`}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className='bg-card/95 backdrop-blur-xl border-primary/10 rounded-2xl'>
            {DEFAULT_PRESETS.map((v) => (
              <SelectItem
                key={v}
                value={v.toString()}
                className='rounded-xl focus:bg-primary/20 focus:text-primary'
              >
                {v} minutos {v === 25 ? '🎯' : ''}
              </SelectItem>
            ))}
            <SelectItem
              value='custom'
              className='rounded-xl focus:bg-primary/20 focus:text-primary font-bold'
            >
              ⏱️ Personalizado...
            </SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <div className='relative'>
          <Input
            type='number'
            min='1'
            max='480'
            value={duration}
            onChange={(e) => onDurationChange(parseInt(e.target.value) || 1)}
            disabled={isRunning}
            className='h-12 rounded-2xl bg-primary/5 border-primary/10 pl-4 pr-12 font-bold focus:ring-primary/30 transition-all'
          />
          <div className='absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground uppercase tracking-widest pointer-events-none'>
            min
          </div>
        </div>
      )}
    </div>
  )
}
