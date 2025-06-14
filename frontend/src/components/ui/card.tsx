import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "glass" | "gradient" | "premium" | "minimal"
    hoverable?: boolean
    glowing?: boolean
  }
>(({ className, variant = "default", hoverable = false, glowing = false, ...props }, ref) => {
  const variants = {
    default: "premium-card",
    glass: "glass-effect rounded-2xl shadow-xl",
    gradient: "bg-gradient-to-br from-white via-purple-50 to-blue-50 rounded-2xl shadow-2xl border-0",
    premium: "premium-card bg-gradient-to-br from-white/90 via-white/80 to-white/70",
    minimal: "bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg"
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        variants[variant],
        hoverable && "transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer",
        glowing && "pulse-glow",
        "relative overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Gradient overlay for premium effect */}
      {variant === "premium" && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-teal-500/5 pointer-events-none" />
      )}
      {props.children}
    </div>
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    gradient?: boolean
  }
>(({ className, gradient = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 p-6",
      gradient && "bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-2xl",
      className
    )}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    gradient?: boolean
    size?: "sm" | "md" | "lg" | "xl"
  }
>(({ className, gradient = false, size = "md", ...props }, ref) => {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl"
  }
  
  return (
    <h3
      ref={ref}
      className={cn(
        "font-bold leading-none tracking-tight",
        sizes[size],
        gradient && "gradient-text",
        className
      )}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    muted?: boolean
  }
>(({ className, muted = true, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm leading-relaxed",
      muted ? "text-muted-foreground" : "text-gray-600",
      className
    )}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    padding?: "none" | "sm" | "md" | "lg"
  }
>(({ className, padding = "md", ...props }, ref) => {
  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6 pt-0",
    lg: "p-8 pt-0"
  }
  
  return (
    <div 
      ref={ref} 
      className={cn(paddings[padding], className)} 
      {...props} 
    />
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    gradient?: boolean
  }
>(({ className, gradient = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-0",
      gradient && "bg-gradient-to-r from-gray-50 to-purple-50 rounded-b-2xl mt-4 pt-4",
      className
    )}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }