import type React from "react"
import styles from "./Button.module.css"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button className={`${styles.button} ${className || ""}`} {...props}>
      {children}
    </button>
  )
}
