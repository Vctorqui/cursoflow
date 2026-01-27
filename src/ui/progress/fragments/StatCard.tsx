import { Card, CardContent } from '@/src/ui/common/ui/card'

interface StatCardProps {
  icon: any
  label: string
  value: string | number
  color: string
  bgColor: string
}

export function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
}: StatCardProps) {
  return (
    <Card className='border-none bg-card/40 backdrop-blur-md shadow-2xl rounded-[1.5rem]'>
      <CardContent className='p-6 flex items-center gap-4'>
        <div
          className={`w-12 h-12 flex items-center justify-center ${bgColor} rounded-2xl`}
        >
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
          <p className='text-[10px] uppercase font-bold tracking-widest text-muted-foreground'>
            {label}
          </p>
          <p className='text-xl font-bold text-foreground leading-tight'>
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
