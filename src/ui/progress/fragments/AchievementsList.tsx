import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/ui/common/ui/card'
import { Award, Trophy, Check, Star, Flame, Target, Clock } from 'lucide-react'
import { Achievement } from '../constants'

export function AchievementsList({
  achievements,
}: {
  achievements: Achievement[]
}) {
  if (achievements.length === 0) {
    return (
      <div className='text-center py-24 bg-primary/5 rounded-[2rem] border border-primary/10'>
        <Trophy className='w-20 h-20 mx-auto mb-6 text-muted-foreground/10' />
        <h4 className='text-xl font-black text-foreground mb-2 uppercase tracking-widest opacity-50'>
          Próximamente
        </h4>
        <p className='text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground/30'>
          Sigue estudiando para desbloquear el sistema de logros
        </p>
      </div>
    )
  }

  return (
    <Card className='border-none bg-card/40 backdrop-blur-md shadow-2xl rounded-[2rem] overflow-hidden border border-primary/5'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-lg flex items-center gap-2 font-bold'>
          <Award className='w-5 h-5 text-primary' />
          Logros Desbloqueados
        </CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-1 md:grid-cols-2 gap-4 p-6'>
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-6 rounded-[1.5rem] border transition-all ${achievement.unlocked ? 'border-primary/20 bg-primary/5 shadow-xl' : 'border-muted/20 bg-muted/10 grayscale opacity-40'}`}
          >
            <div className='flex items-start gap-4'>
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${achievement.unlocked ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground'}`}
              >
                <AchievementIcon name={achievement.icon} className='w-7 h-7' />
              </div>
              <div className='flex-1 space-y-1'>
                <h4
                  className={`text-lg font-black tracking-tight ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {achievement.title}
                </h4>
                <p className='text-xs font-medium text-muted-foreground/70 leading-relaxed'>
                  {achievement.description}
                </p>
              </div>
              {achievement.unlocked && (
                <div className='bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20'>
                  <Check className='w-4 h-4 stroke-[3]' />
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function AchievementIcon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  switch (name) {
    case 'Star':
      return <Star className={className} />
    case 'Flame':
      return <Flame className={className} />
    case 'Target':
      return <Target className={className} />
    case 'Clock':
      return <Clock className={className} />
    case 'Trophy':
      return <Trophy className={className} />
    default:
      return <Award className={className} />
  }
}
