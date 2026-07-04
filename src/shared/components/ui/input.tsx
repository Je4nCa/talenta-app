import * as React from 'react'
import { cn } from '@/shared/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'flex h-14 w-full rounded-xl border-2 border-talenta-tan bg-talenta-white px-4 text-base text-talenta-black placeholder:text-talenta-brown-mid/70 transition-colors focus-visible:outline-none focus-visible:border-talenta-gold focus-visible:ring-2 focus-visible:ring-talenta-gold/40 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
})
Input.displayName = 'Input'

export { Input }
