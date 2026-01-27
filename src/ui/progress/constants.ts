export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedDate?: string
}

export const ACHIEVEMENT_DATA = [
  {
    id: '1',
    title: 'Primer Paso',
    description: 'Completa tu primera sesión de estudio.',
    icon: 'Star',
  },
  {
    id: '2',
    title: 'Constancia Inicial',
    description: 'Mantén una racha de 3 días.',
    icon: 'Flame',
  },
  {
    id: '3',
    title: 'Guerrero del Estudio',
    description: 'Completa 10 sesiones totales.',
    icon: 'Target',
  },
  {
    id: '4',
    title: 'Maratonista',
    description: 'Acumula más de 5 horas de estudio.',
    icon: 'Clock',
  },
  {
    id: '5',
    title: 'Fuego Eterno',
    description: 'Logra una racha de 7 días.',
    icon: 'Flame',
  },
  {
    id: '6',
    title: 'Graduado',
    description: 'Completa un curso al 100%.',
    icon: 'Trophy',
  },
]
