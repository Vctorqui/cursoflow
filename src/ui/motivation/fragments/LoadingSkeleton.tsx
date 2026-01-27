import { Card, CardContent } from '@/src/ui/common/ui/card'

export function LoadingSkeleton() {
  return (
    <Card className='border-accent/20 bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 shadow-lg'>
      <CardContent className='p-6'>
        <div className='flex items-start gap-4'>
          <div className='w-12 h-12 rounded-full bg-muted animate-pulse' />
          <div className='flex-1 space-y-3'>
            <div className='h-4 bg-muted rounded animate-pulse' />
            <div className='h-3 bg-muted rounded animate-pulse w-2/3' />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
