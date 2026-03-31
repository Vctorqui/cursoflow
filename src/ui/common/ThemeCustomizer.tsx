'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/src/ui/common/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/ui/common/ui/popover'
import { Check, Palette } from 'lucide-react'
import {
  THEME_LS,
  DARK_BACKGROUND_PRESETS,
  DARK_CARD_PRESETS,
  applyStoredCursoflowTheme,
} from '@/src/lib/themeSurface'

const PRIMARY_PRESETS = [
  { name: 'Naranja', value: 'oklch(0.7 0.22 45)', hex: '#ff7a2d' },
  { name: 'Azul', value: 'oklch(0.65 0.2 250)', hex: '#3b82f6' },
  { name: 'Esmeralda', value: 'oklch(0.7 0.15 160)', hex: '#10b981' },
  { name: 'Rosa', value: 'oklch(0.65 0.2 340)', hex: '#ec4899' },
  { name: 'Cian', value: 'oklch(0.7 0.15 200)', hex: '#06b6d4' },
  { name: 'Índigo', value: 'oklch(0.6 0.2 280)', hex: '#6366f1' },
]

function PrimarySwatchRow({
  activeValue,
  onSelect,
}: {
  activeValue: string
  onSelect: (value: string) => void
}) {
  return (
    <div className='grid grid-cols-6 gap-2'>
      {PRIMARY_PRESETS.map((p) => {
        const selected = activeValue === p.value
        return (
          <button
            key={p.name}
            type='button'
            onClick={() => onSelect(p.value)}
            className='relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-primary/10 transition-transform active:scale-90'
            style={{ backgroundColor: p.hex }}
            title={p.name}
          >
            {selected ? (
              <Check className='h-4 w-4 text-white drop-shadow-md' />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

function DarkSurfaceSwatchRow({
  presets,
  activeValue,
  onSelect,
}: {
  presets: readonly { name: string; value: string }[]
  activeValue: string
  onSelect: (value: string) => void
}) {
  return (
    <div className='grid grid-cols-6 gap-2'>
      {presets.map((p) => {
        const selected = activeValue === p.value
        return (
          <button
            key={p.name}
            type='button'
            onClick={() => onSelect(p.value)}
            className='relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-white/15 transition-transform active:scale-90'
            style={{ backgroundColor: p.value }}
            title={p.name}
          >
            {selected ? (
              <Check className='h-4 w-4 text-white drop-shadow-md' />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export function ThemeCustomizer() {
  const [activePrimary, setActivePrimary] = useState(PRIMARY_PRESETS[0].value)
  const [activeBackground, setActiveBackground] = useState<string | null>(null)
  const [activeCard, setActiveCard] = useState<string | null>(null)

  useEffect(() => {
    applyStoredCursoflowTheme()

    const sp = localStorage.getItem(THEME_LS.primary)
    if (sp) setActivePrimary(sp)

    setActiveBackground(localStorage.getItem(THEME_LS.background))
    setActiveCard(localStorage.getItem(THEME_LS.card))
  }, [])

  const handlePrimaryChange = (value: string) => {
    setActivePrimary(value)
    localStorage.setItem(THEME_LS.primary, value)
    applyStoredCursoflowTheme()
  }

  const handleBackgroundChange = (value: string) => {
    setActiveBackground(value)
    localStorage.setItem(THEME_LS.background, value)
    localStorage.setItem(THEME_LS.pairedDarkBg, '1')
    applyStoredCursoflowTheme()
  }

  const handleCardChange = (value: string) => {
    setActiveCard(value)
    localStorage.setItem(THEME_LS.card, value)
    localStorage.setItem(THEME_LS.pairedDarkCard, '1')
    applyStoredCursoflowTheme()
  }

  const resetSurfaces = () => {
    localStorage.removeItem(THEME_LS.background)
    localStorage.removeItem(THEME_LS.card)
    localStorage.removeItem(THEME_LS.pairedDarkBg)
    localStorage.removeItem(THEME_LS.pairedDarkCard)
    setActiveBackground(null)
    setActiveCard(null)
    applyStoredCursoflowTheme()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='h-9 w-9 rounded-full border border-border bg-muted hover:bg-muted/80'
          aria-label='Personalizar tema'
        >
          <Palette className='h-4 w-4 text-foreground' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='max-h-[min(80vh,560px)] w-72 overflow-y-auto rounded-3xl border-primary/10 bg-card/95 p-4 backdrop-blur-xl'>
        <div className='space-y-5'>
          <div className='space-y-1.5'>
            <h4 className='pl-1 text-xs font-black tracking-widest text-muted-foreground uppercase'>
              Color principal
            </h4>
            <PrimarySwatchRow
              activeValue={activePrimary}
              onSelect={handlePrimaryChange}
            />
          </div>

          <div className='space-y-1.5'>
            <h4 className='pl-1 text-xs font-black tracking-widest text-muted-foreground uppercase'>
              Fondo oscuro
            </h4>
            <DarkSurfaceSwatchRow
              presets={DARK_BACKGROUND_PRESETS}
              activeValue={activeBackground ?? ''}
              onSelect={handleBackgroundChange}
            />
          </div>

          <div className='space-y-1.5'>
            <h4 className='pl-1 text-xs font-black tracking-widest text-muted-foreground uppercase'>
              Tarjetas oscuras
            </h4>
            <DarkSurfaceSwatchRow
              presets={DARK_CARD_PRESETS}
              activeValue={activeCard ?? ''}
              onSelect={handleCardChange}
            />
          </div>

          <div className='flex flex-col gap-2 border-t border-primary/10 pt-3'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='h-8 text-[10px] font-bold tracking-wide text-muted-foreground'
              onClick={resetSurfaces}
            >
              Restaurar fondo y tarjetas
            </Button>
            <p className='text-[10px] leading-relaxed text-muted-foreground/60 italic'>
              Mismos matices que el acento, en tonos oscuros; el texto se aclara
              solo para fondo y tarjetas. Se guarda en este dispositivo.
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
