export function StatusLabel({ label }: { label: string }) {
  return (
    <div className='flex items-center gap-2 text-xs text-muted-foreground mb-2'>
      <div className='w-2 h-2 rounded-full bg-accent/40 animate-pulse' />
      <span>{label}</span>
    </div>
  )
}
