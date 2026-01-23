'use client'

import { useEffect } from 'react'

export function ThemeInitializer() {
  useEffect(() => {
    const savedColor = localStorage.getItem('cursoflow-primary-color')
    if (savedColor) {
      document.documentElement.style.setProperty('--primary', savedColor)
    }
  }, [])

  return null
}
