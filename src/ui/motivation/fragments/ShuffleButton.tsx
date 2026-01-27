import { Button } from '@/src/ui/common/ui/button'
import { Shuffle } from 'lucide-react'

export function ShuffleButton({
  onClick,
  label = 'Otro mensaje',
}: {
  onClick: () => void
  label?: string
}) {
  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={onClick}
      className='bg-primary/5 hover:bg-primary/10 border-primary/10 text-primary rounded-2xl px-6 h-12 transition-all duration-300 backdrop-blur-md gap-3'
    >
      <Shuffle className='w-4 h-4' />
      <span className='font-medium text-primary'>{label}</span>
    </Button>
  )
}
