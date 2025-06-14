import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "premium" | "glass" | "minimal"
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: string
  success?: boolean
  loading?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", icon, rightIcon, error, success, loading, ...props }, ref) => {
    const variants = {
      default: "h-12 rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm transition-all duration-300 focus:border-purple-400 focus:bg-white focus:shadow-lg focus:shadow-purple-200/50",
      premium: "h-12 rounded-xl border-2 border-transparent bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm transition-all duration-300 focus:from-white/80 focus:to-white/60 focus:shadow-xl focus:shadow-purple-200/30 focus:border-purple-300",
      glass: "h-12 rounded-xl glass-effect border border-white/30 transition-all duration-300 focus:border-purple-300 focus:bg-white/30",
      minimal: "h-12 rounded-lg border border-gray-300 bg-white transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
    }

    return (
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}
        
        {/* Input Field */}
        <input
          type={type}
          className={cn(
            "flex w-full px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            variants[variant],
            icon && "pl-10",
            (rightIcon || loading) && "pr-10",
            error && "border-red-300 focus:border-red-400 focus:ring-red-200",
            success && "border-green-300 focus:border-green-400 focus:ring-green-200",
            className
          )}
          ref={ref}
          {...props}
        />
        
        {/* Right Icon or Loading */}
        {(rightIcon || loading) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin" />
            ) : (
              rightIcon
            )}
          </div>
        )}
        
        {/* Success Checkmark */}
        {success && !rightIcon && !loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }