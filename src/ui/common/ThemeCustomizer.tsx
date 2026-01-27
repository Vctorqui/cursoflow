'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/src/ui/common/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/ui/common/ui/popover'
import { Check, Palette } from 'lucide-react'

const THEME_PRESETS = [
  { name: 'Naranja', value: 'oklch(0.7 0.22 45)', hex: '#ff7a2d' },
  { name: 'Azul', value: 'oklch(0.65 0.2 250)', hex: '#3b82f6' },
  { name: 'Esmeralda', value: 'oklch(0.7 0.15 160)', hex: '#10b981' },
  { name: 'Rosa', value: 'oklch(0.65 0.2 340)', hex: '#ec4899' },
  { name: 'Cian', value: 'oklch(0.7 0.15 200)', hex: '#06b6d4' },
  { name: 'Índigo', value: 'oklch(0.6 0.2 280)', hex: '#6366f1' },
]

export function ThemeCustomizer() {
  const [activeColor, setActiveColor] = useState(THEME_PRESETS[0].value)

  useEffect(() => {
    const savedColor = localStorage.getItem('cursoflow-primary-color')
    if (savedColor) {
      setActiveColor(savedColor)
      document.documentElement.style.setProperty('--primary', savedColor)
    }
  }, [])

  const handleColorChange = (color: string) => {
    setActiveColor(color)
    document.documentElement.style.setProperty('--primary', color)
    localStorage.setItem('cursoflow-primary-color', color)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='w-9 h-9 rounded-full bg-muted border border-border hover:bg-muted/80'
          aria-label='Personalizar tema'
        >
          <Palette className='w-4 h-4 text-foreground' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-64 p-4 border-primary/10 bg-card/95 backdrop-blur-xl rounded-3xl'>
        <div className='space-y-4'>
          <div className='space-y-1.5'>
            <h4 className='text-xs font-black uppercase tracking-widest text-muted-foreground pl-1'>
              Color Principal
            </h4>
            <div className='grid grid-cols-6 gap-2'>
              {THEME_PRESETS.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorChange(color.value)}
                  className='relative w-8 h-8 rounded-full border border-primary/10 transition-transform active:scale-90 flex items-center justify-center overflow-hidden'
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {activeColor === color.value && (
                    <Check className='w-4 h-4 text-white drop-shadow-md' />
                  )}
                </button>
              ))}
            </div>
          </div>
          <p className='text-[10px] text-muted-foreground/60 leading-relaxed italic'>
            Personaliza el acento visual de tu espacio de estudio.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
