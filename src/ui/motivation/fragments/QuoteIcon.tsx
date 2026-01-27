import { Quote } from 'lucide-react'

export function QuoteIcon({
  size,
  iconSize,
  glow = false,
}: {
  size: string
  iconSize: string
  glow?: boolean
}) {
  return (
    <div className='flex-shrink-0'>
      <div
        className={`${size} rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 backdrop-blur-sm shadow-xl`}
      >
        <Quote className={`${iconSize} text-primary`} />
      </div>
    </div>
  )
}
