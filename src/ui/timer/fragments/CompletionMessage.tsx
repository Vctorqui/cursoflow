import { useState } from 'react'
import { Button } from '@/src/ui/common/ui/button'
import { Check, Clock } from 'lucide-react'

interface CompletionMessageProps {
  duration: number
  onSave: (notes: string) => void
  onCancel: () => void
}

export function CompletionMessage({
  duration,
  onSave,
  onCancel,
}: CompletionMessageProps) {
  const [notes, setNotes] = useState('')

  return (
    <div className='text-center p-8 bg-primary/10 rounded-[2.5rem] border border-primary/20 space-y-6'>
      <div className='mb-2'>
        <div className='w-20 h-20 mx-auto bg-primary text-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-primary/40 rotate-3'>
          <Check className='w-10 h-10 stroke-[3]' />
        </div>
        <h3 className='text-3xl font-black text-foreground mb-2'>
          ¡Increíble! 🌟
        </h3>
        <p className='text-sm text-muted-foreground font-medium uppercase tracking-widest'>
          Has completado{' '}
          <span className='text-primary font-black'>{duration} MIN</span> de
          estudio.
        </p>
      </div>

      <div className='space-y-3 text-left'>
        <label className='text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1'>
          Insights de la sesión
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder='¿Qué aprendiste hoy? (Opcional)'
          className='w-full min-h-[120px] p-5 text-sm rounded-[1.5rem] bg-muted/50 border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none transition-all placeholder:text-muted-foreground/40 font-medium'
        />
      </div>

      <div className='flex flex-col gap-3 pt-2'>
        <Button
          onClick={() => onSave(notes)}
          className='w-full bg-primary hover:bg-primary/90 text-white font-black h-16 rounded-[2rem] text-lg shadow-xl shadow-primary/20 transition-all active:scale-95'
        >
          Guardar y Finalizar
        </Button>
        <Button
          onClick={onCancel}
          variant='ghost'
          size='sm'
          className='h-12 rounded-[1.5rem] text-muted-foreground hover:text-primary transition-colors'
        >
          Descartar registro
        </Button>
      </div>

      <div className='pt-6 border-t border-primary/10'>
        <p className='text-[10px] font-bold text-muted-foreground/60 flex items-center justify-center gap-2'>
          <Clock className='w-3 h-3' /> RECOMENDACIÓN: TÓMATE 10 MIN DE DESCANSO
        </p>
      </div>
    </div>
  )
}
