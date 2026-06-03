import { cn } from '@/lib/utils'

type Variant = 'default' | 'green' | 'red' | 'blue' | 'gray'

const variants: Record<Variant, string> = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  green:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  red:     'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  blue:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  gray:    'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
}

type Props = {
  children: React.ReactNode
  variant?: Variant
  className?: string
}

export function Badge({ children, variant = 'default', className }: Props) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}
