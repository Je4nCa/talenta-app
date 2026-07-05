import * as React from 'react'
import { cn } from '@/shared/lib/utils'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-32 w-full rounded-xl border-2 border-talenta-tan bg-talenta-white px-4 py-3 text-base text-talenta-black placeholder:text-talenta-brown-mid/70 transition-colors focus-visible:outline-none focus-visible:border-talenta-gold focus-visible:ring-2 focus-visible:ring-talenta-gold/40 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
