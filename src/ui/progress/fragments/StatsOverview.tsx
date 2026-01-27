import { Flame, Trophy, Clock, Target } from 'lucide-react'
import { StatCard } from './StatCard'

interface StatsOverviewProps {
  streak: { current: number; longest: number }
  totalTime: number
  sessionsCount: number
}

export function StatsOverview({
  streak,
  totalTime,
  sessionsCount,
}: StatsOverviewProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
      <StatCard
        icon={Flame}
        label='Racha Actual'
        value={streak.current}
        color='text-primary'
        bgColor='bg-primary/10'
      />
      <StatCard
        icon={Trophy}
        label='Mejor Racha'
        value={streak.longest}
        color='text-accent'
        bgColor='bg-accent/10'
      />
      <StatCard
        icon={Clock}
        label='Tiempo Total'
        value={`${Math.floor(totalTime / 60)}h ${totalTime % 60}m`}
        color='text-chart-1'
        bgColor='bg-chart-1/10'
      />
      <StatCard
        icon={Target}
        label='Sesiones'
        value={sessionsCount}
        color='text-chart-2'
        bgColor='bg-chart-2/10'
      />
    </div>
  )
}
