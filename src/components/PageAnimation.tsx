'use client'
import { motion } from 'motion/react'
import React from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  delay?: number
}

export const PageAnimation: React.FC<Props> = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth fade
        delay: delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
