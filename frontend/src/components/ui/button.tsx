import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg hover:shadow-xl hover:from-gray-700 hover:to-gray-800 transform hover:scale-105",
        
        destructive: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105",
        
        outline: "border-2 border-purple-200 bg-white/50 backdrop-blur-sm hover:bg-purple-50 hover:border-purple-300 hover:shadow-lg transform hover:scale-105",
        
        secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg transform hover:scale-105",
        
        ghost: "hover:bg-purple-50 hover:text-purple-900 transition-colors",
        
        link: "text-purple-600 underline-offset-4 hover:underline",
        
        premium: "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white shadow-xl hover:shadow-2xl hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 transform hover:scale-105",
        
        glass: "bg-white/20 backdrop-blur-lg border border-white/30 text-gray-900 hover:bg-white/30 shadow-lg hover:shadow-xl transform hover:scale-105",
        
        success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105",
        
        warning: "bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg hover:shadow-xl hover:from-yellow-600 hover:to-orange-700 transform hover:scale-105",
        
        gradient: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-xl hover:shadow-2xl hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 transform hover:scale-105",
        
        neon: "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 animate-pulse",
        
        luxury: "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-gray-900 shadow-xl hover:shadow-2xl hover:shadow-yellow-500/50 transform hover:scale-105 font-bold",
        
        minimal: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md transform hover:scale-105",
        
        dark: "bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg hover:shadow-xl hover:from-gray-900 hover:to-black transform hover:scale-105",
        
        rainbow: "bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 animate-gradient-x",
        
        cosmic: "bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-800 text-white shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 relative",
        
        fire: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-xl hover:shadow-2xl hover:shadow-red-500/50 transform hover:scale-105",
        
        ocean: "bg-gradient-to-r from-blue-400 via-teal-500 to-cyan-600 text-white shadow-xl hover:shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-105",
        
        forest: "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white shadow-xl hover:shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-105",
        
        sunset: "bg-gradient-to-r from-orange-400 via-pink-500 to-red-500 text-white shadow-xl hover:shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105",
        
        aurora: "bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-xl px-8 text-base",
        xl: "h-16 rounded-2xl px-10 text-lg",
        xxl: "h-20 rounded-3xl px-12 text-xl",
        icon: "h-12 w-12",
      },
      animation: {
        none: "",
        float: "animate-bounce",
        pulse: "animate-pulse",
        glow: "animate-pulse hover:animate-none",
        shimmer: "bg-[length:200%_100%] animate-shimmer",
        wiggle: "hover:animate-wiggle",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
  loadingText?: string
  glowEffect?: boolean
  particleEffect?: boolean
  soundEffect?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    asChild = false, 
    loading = false, 
    icon, 
    rightIcon, 
    children, 
    loadingText = "Loading...",
    glowEffect = false,
    particleEffect = false,
    soundEffect = false,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Sound effect
      if (soundEffect && !loading) {
        const audio = new Audio('/sounds/click.mp3')
        audio.volume = 0.2
        audio.play().catch(() => {}) // Ignore errors if sound fails
      }
      
      // Particle effect
      if (particleEffect && !loading) {
        createParticleEffect(e)
      }
      
      props.onClick?.(e)
    }
    
    const createParticleEffect = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div')
        particle.className = 'fixed w-1 h-1 bg-white rounded-full pointer-events-none z-50'
        particle.style.left = `${rect.left + x}px`
        particle.style.top = `${rect.top + y}px`
        
        document.body.appendChild(particle)
        
        const angle = (i / 12) * Math.PI * 2
        const velocity = 50 + Math.random() * 50
        const vx = Math.cos(angle) * velocity
        const vy = Math.sin(angle) * velocity
        
        particle.animate([
          { 
            transform: `translate(0, 0) scale(1)`,
            opacity: 1 
          },
          { 
            transform: `translate(${vx}px, ${vy}px) scale(0)`,
            opacity: 0 
          }
        ], {
          duration: 600,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
          document.body.removeChild(particle)
        }
      }
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        onClick={handleClick}
        {...props}
      >
        {/* Glow Effect */}
        {glowEffect && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 opacity-75 blur-lg group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        )}
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-700 pointer-events-none"></div>
        
        {/* Content */}
        <div className="relative flex items-center gap-2 z-10">
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{loadingText}</span>
            </>
          ) : (
            <>
              {icon && (
                <span className="flex-shrink-0 transform group-hover:scale-110 transition-transform duration-200">
                  {icon}
                </span>
              )}
              
              <span className="flex-1">{children}</span>
              
              {rightIcon && (
                <span className="flex-shrink-0 transform group-hover:translate-x-1 group-hover:scale-110 transition-all duration-200">
                  {rightIcon}
                </span>
              )}
            </>
          )}
        </div>
        
        {/* Cosmic variant special effects */}
        {variant === 'cosmic' && (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${10 + i * 15}%`,
                  top: `${20 + (i % 2) * 60}%`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </>
        )}
        
        {/* Rainbow variant animation */}
        {variant === 'rainbow' && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl" />
        )}
        
        {/* Neon variant glow */}
        {variant === 'neon' && (
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-50 blur-md group-hover:opacity-75 transition-opacity duration-300 rounded-xl -z-10" />
        )}
        
        {/* Aurora variant moving effect */}
        {variant === 'aurora' && (
          <div className="absolute inset-0 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-xl animate-pulse" />
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }