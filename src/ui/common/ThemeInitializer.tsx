'use client'

import { useEffect } from 'react'
import { applyStoredCursoflowTheme } from '@/src/lib/themeSurface'

export function ThemeInitializer() {
  useEffect(() => {
    applyStoredCursoflowTheme()
  }, [])

  return null
}
