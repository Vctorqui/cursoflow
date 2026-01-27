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
      className='flex items-center gap-2 px-3 md:px-6 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white transition-all text-xs md:text-sm font-medium whitespace-nowrap'
    >
      <Icon className='w-4 h-4' />
      <span className='hidden sm:inline'>{label}</span>
    </TabsTrigger>
  )
}
