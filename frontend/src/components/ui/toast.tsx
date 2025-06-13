'use client'

import * as React from "react"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'destructive'
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
          variant === 'success' ? 'bg-green-600 text-white' :
          variant === 'destructive' ? 'bg-red-600 text-white' :
          'bg-white text-black border'
        } ${className || ''}`}
        {...props}
      />
    )
  }
)
Toast.displayName = "Toast"

export interface ToasterProps {
  toasts?: Array<{
    id: string
    title?: React.ReactNode
    description?: React.ReactNode
    action?: React.ReactNode
    variant?: 'default' | 'success' | 'destructive'
  }>
}

export function Toaster({ toasts = [] }: ToasterProps) {
  return (
    <div className="fixed top-0 right-0 p-4 space-y-2">
      {toasts.map(({ id, title, description, action, variant }) => (
        <Toast key={id} variant={variant}>
          <div>
            {title && <div className="font-semibold">{title}</div>}
            {description && <div className="text-sm">{description}</div>}
          </div>
          {action}
        </Toast>
      ))}
    </div>
  )
}

export { Toast }