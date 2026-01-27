import { Lock } from 'lucide-react'

export function TimerLockAlert() {
  return (
    <div className='mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-2'>
      <Lock className='w-4 h-4 text-primary' />
      <span className='text-sm text-primary font-medium'>
        Sesión de estudio activa - Los tabs están bloqueados
      </span>
    </div>
  )
}
