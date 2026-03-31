import { useState } from 'react'
import { Button } from '@/src/ui/common/ui/button'
import { TagPicker } from '@/src/ui/common/TagPicker'
import { Check, Clock } from 'lucide-react'
import { normalizeTags } from '@/src/domain/tags'

interface CompletionMessageProps {
  duration: number
  courseTags: string[]
  tagSuggestions: string[]
  onSave: (notes: string, sessionTags: string[]) => void
  onCancel: () => void
}

export function CompletionMessage({
  duration,
  courseTags,
  tagSuggestions,
  onSave,
  onCancel,
}: CompletionMessageProps) {
  const [notes, setNotes] = useState('')
  const [sessionTags, setSessionTags] = useState(() =>
    normalizeTags(courseTags),
  )

  return (
    <div className='space-y-6 rounded-[2.5rem] border border-primary/20 bg-primary/10 p-8 text-center'>
      <div className='mb-2'>
        <div className='mx-auto mb-6 flex h-20 w-20 rotate-3 items-center justify-center rounded-3xl bg-primary text-white shadow-2xl shadow-primary/40'>
          <Check className='h-10 w-10 stroke-[3]' />
        </div>
        <h3 className='mb-2 text-3xl font-black text-foreground'>
          ¡Increíble! 🌟
        </h3>
        <p className='text-sm font-medium uppercase tracking-widest text-muted-foreground'>
          Has completado{' '}
          <span className='font-black text-primary'>{duration} MIN</span> de
          estudio.
        </p>
      </div>

      <div className='space-y-3 text-left'>
        <label className='pl-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground'>
          Insights de la sesión
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder='¿Qué aprendiste hoy? (Opcional)'
          className='min-h-[120px] w-full resize-none rounded-[1.5rem] border border-primary/10 bg-muted/50 p-5 text-sm font-medium transition-all placeholder:text-muted-foreground/40 focus:ring-2 focus:ring-primary/50 focus:outline-none'
        />
      </div>

      <div className='text-left'>
        <TagPicker
          value={sessionTags}
          onChange={setSessionTags}
          suggestions={tagSuggestions}
          label='Etiquetas de esta nota (opcional)'
          placeholder='Añade o quita etiquetas…'
        />
        <p className='mt-2 pl-1 text-[10px] text-muted-foreground/80'>
          Por defecto usamos las del curso; puedes cambiarlas para filtrar en
          Progreso → Notas.
        </p>
      </div>

      <div className='flex flex-col gap-3 pt-2'>
        <Button
          onClick={() => onSave(notes, sessionTags)}
          className='h-16 w-full rounded-[2rem] bg-primary text-lg font-black text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95'
        >
          Guardar y Finalizar
        </Button>
        <Button
          onClick={onCancel}
          variant='ghost'
          size='sm'
          className='h-12 rounded-[1.5rem] text-muted-foreground transition-colors hover:text-primary'
        >
          Descartar registro
        </Button>
      </div>

      <div className='border-t border-primary/10 pt-6'>
        <p className='flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground/60'>
          <Clock className='h-3 w-3' /> RECOMENDACIÓN: TÓMATE 10 MIN DE DESCANSO
        </p>
      </div>
    </div>
  )
}
