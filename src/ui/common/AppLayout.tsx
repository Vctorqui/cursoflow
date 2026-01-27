'use client'

import React from 'react'
import { Header } from './Header'
import Footer from './Footer'
import { Course } from '@/src/domain/entities'

interface AppLayoutProps {
  children: React.ReactNode
  headerProps: {
    onNewCourse: () => void
    isTimerRunning: boolean
    courses: Course[]
    sessions: any[]
    onImport: (data: any) => void
    searchQuery: string
    onSearchChange: (query: string) => void
  }
}

export function AppLayout({ children, headerProps }: AppLayoutProps) {
  return (
    <div className='min-h-screen max-w-screen-xl mx-auto bg-background flex flex-col'>
      <Header {...headerProps} />
      <main className='container mx-auto px-4 py-8 flex-1'>{children}</main>
      <Footer />
    </div>
  )
}
