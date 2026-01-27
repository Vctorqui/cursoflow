import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/ui/common/ui/card'
import { Calendar } from 'lucide-react'

interface WeeklyActivityProps {
  weeklyData: any[]
  maxMinutes: number
}

export function WeeklyActivity({
  weeklyData,
  maxMinutes,
}: WeeklyActivityProps) {
  return (
    <Card className='border-none bg-card/40 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden border border-primary/5'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-lg flex items-center gap-2 font-bold'>
          <Calendar className='w-5 h-5 text-primary' />
          Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6 p-6'>
        {weeklyData.map((day: any) => (
          <div key={day.date} className='flex items-center gap-6'>
            <div className='w-12 text-xs font-bold uppercase tracking-widest text-muted-foreground'>
              {day.day}
            </div>
            <div className='flex-1'>
              <div className='flex items-center gap-4 mb-1.5'>
                <div className='flex-1 h-2 bg-primary/10 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-primary shadow-[0_0_10px_rgba(255,122,33,0.3)] transition-all'
                    style={{ width: `${(day.minutes / maxMinutes) * 100}%` }}
                  />
                </div>
                <div className='text-sm font-bold w-20 text-right text-primary'>
                  {day.minutes} min
                </div>
              </div>
              <p className='text-[10px] text-muted-foreground font-bold uppercase tracking-widest'>
                {day.sessions} {day.sessions === 1 ? 'Sesión' : 'Sesiones'}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
