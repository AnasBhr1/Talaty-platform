import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "gradient" | "dots" | "pulse" | "bars"
  color?: "default" | "primary" | "success" | "warning" | "danger"
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = "md", variant = "default", color = "primary", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-6 h-6", 
      lg: "w-8 h-8",
      xl: "w-12 h-12"
    }

    const colorClasses = {
      default: "border-gray-300 border-t-gray-600",
      primary: "border-purple-200 border-t-purple-600",
      success: "border-green-200 border-t-green-600",
      warning: "border-yellow-200 border-t-yellow-600",
      danger: "border-red-200 border-t-red-600"
    }

    if (variant === "gradient") {
      return (
        <div
          ref={ref}
          className={cn(
            "relative inline-block",
            sizeClasses[size],
            className
          )}
          {...props}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 animate-spin">
            <div className="absolute inset-1 rounded-full bg-white"></div>
          </div>
        </div>
      )
    }

    if (variant === "dots") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex space-x-1",
            className
          )}
          {...props}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse",
                size === "sm" && "w-1.5 h-1.5",
                size === "md" && "w-2 h-2",
                size === "lg" && "w-3 h-3",
                size === "xl" && "w-4 h-4"
              )}
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1s"
              }}
            />
          ))}
        </div>
      )
    }

    if (variant === "pulse") {
      return (
        <div
          ref={ref}
          className={cn(
            "relative inline-block",
            sizeClasses[size],
            className
          )}
          {...props}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-ping opacity-75"></div>
          <div className="relative rounded-full bg-gradient-to-r from-purple-600 to-blue-600 h-full w-full"></div>
        </div>
      )
    }

    if (variant === "bars") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-end space-x-1",
            className
          )}
          {...props}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-gradient-to-t from-purple-500 to-blue-500 animate-pulse",
                size === "sm" && "w-1 h-3",
                size === "md" && "w-1.5 h-4",
                size === "lg" && "w-2 h-6",
                size === "xl" && "w-3 h-8"
              )}
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: "1.2s"
              }}
            />
          ))}
        </div>
      )
    }

    // Default spinner
    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin rounded-full border-2",
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        {...props}
      />
    )
  }
)
LoadingSpinner.displayName = "LoadingSpinner"

// Skeleton Loader Component
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular" | "button"
  width?: string | number
  height?: string | number
  lines?: number
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "rectangular", width, height, lines = 1, ...props }, ref) => {
    const baseClasses = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200px_100%]"
    
    const variants = {
      text: "h-4 rounded",
      rectangular: "rounded-lg",
      circular: "rounded-full",
      button: "h-10 rounded-xl"
    }

    if (variant === "text" && lines > 1) {
      return (
        <div ref={ref} className={cn("space-y-2", className)} {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                baseClasses,
                variants.text,
                i === lines - 1 && "w-3/4" // Last line shorter
              )}
              style={{ width: i === lines - 1 ? "75%" : width, height }}
            />
          ))}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          className
        )}
        style={{ width, height }}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

// Page Loading Component
const PageLoader = ({ message = "Loading..." }: { message?: string }) => (
  <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center z-50">
    <div className="text-center space-y-6">
      <div className="relative">
        <LoadingSpinner size="xl" variant="gradient" />
        <div className="absolute inset-0 rounded-full border-2 border-purple-200 animate-ping opacity-30"></div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold gradient-text">Talaty</h3>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  </div>
)

export { LoadingSpinner, Skeleton, PageLoader }