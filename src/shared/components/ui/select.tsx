import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'flex h-14 w-full appearance-none rounded-xl border-2 border-talenta-tan bg-talenta-white px-4 pr-11 text-base text-talenta-black transition-colors focus-visible:outline-none focus-visible:border-talenta-gold focus-visible:ring-2 focus-visible:ring-talenta-gold/40 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-talenta-brown-mid" />
      </div>
    )
  },
)
Select.displayName = 'Select'

export { Select }
