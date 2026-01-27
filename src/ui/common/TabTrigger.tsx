import { TabsTrigger } from '@/src/ui/common/ui/tabs'

interface TabTriggerProps {
  value: string
  icon: any
  label: string
  disabled?: boolean
}

export function TabTrigger({
  value,
  icon: Icon,
  label,
  disabled,
}: TabTriggerProps) {
  return (
    <TabsTrigger
      value={value}
      disabled={disabled}
      className='flex items-center gap-2 px-6 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-xs md:text-sm font-medium'
    >
      <Icon className='w-3 h-3 md:w-4 md:h-4' />
      <span>{label}</span>
    </TabsTrigger>
  )
}
