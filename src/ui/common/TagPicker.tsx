'use client'

import { useState, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'

import { cn } from '@/src/lib/utils'
import { normalizeTags } from '@/src/domain/tags'
import { Badge } from '@/src/ui/common/ui/badge'
import { Button } from '@/src/ui/common/ui/button'
import { Input } from '@/src/ui/common/ui/input'

interface TagPickerProps {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions: string[]
  label?: string
  placeholder?: string
  className?: string
  maxTags?: number
}

export function TagPicker({
  value,
  onChange,
  suggestions,
  label = 'Etiquetas',
  placeholder = 'Escribe y pulsa Enter…',
  className,
  maxTags = 15,
}: TagPickerProps) {
  const [draft, setDraft] = useState('')

  const addFromInput = () => {
    const next = normalizeTags([...value, draft])
    if (next.length <= maxTags) {
      onChange(next)
      setDraft('')
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addFromInput()
    }
  }

  const remove = (t: string) => {
    onChange(
      value.filter((x) => x.toLowerCase() !== t.toLowerCase()),
    )
  }

  const pickSuggestion = (s: string) => {
    const next = normalizeTags([...value, s])
    if (next.length <= maxTags) onChange(next)
  }

  const availableSuggestions = suggestions.filter(
    (s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()),
  )

  return (
    <div className={cn('space-y-3', className)}>
      {label ? (
        <p className='ml-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground'>
          {label}
        </p>
      ) : null}
      <div className='flex min-h-8 flex-wrap gap-2'>
        {value.map((tag) => (
          <Badge
            key={tag}
            variant='secondary'
            className='gap-1 rounded-full border border-primary/20 bg-primary/15 px-3 py-1 pr-1 text-xs font-semibold text-primary hover:bg-primary/20'
          >
            {tag}
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='h-5 w-5 rounded-full p-0 hover:bg-primary/30'
              onClick={() => remove(tag)}
              aria-label={`Quitar ${tag}`}
            >
              <X className='h-3 w-3' />
            </Button>
          </Badge>
        ))}
      </div>
      <div className='flex gap-2'>
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className='h-11 rounded-xl border-primary/10 bg-muted/50'
        />
        <Button
          type='button'
          variant='outline'
          className='shrink-0 rounded-xl border-primary/20'
          onClick={addFromInput}
          disabled={!draft.trim() || value.length >= maxTags}
        >
          Añadir
        </Button>
      </div>
      {availableSuggestions.length > 0 ? (
        <div className='space-y-2'>
          <p className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70'>
            Sugerencias
          </p>
          <div className='flex flex-wrap gap-2'>
            {availableSuggestions.slice(0, 12).map((s) => (
              <button
                key={s}
                type='button'
                onClick={() => pickSuggestion(s)}
                disabled={value.length >= maxTags}
                className='rounded-full border border-primary/15 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground disabled:opacity-40'
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
