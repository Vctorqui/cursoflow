import { useState, useCallback } from 'react'
import { Course } from '../domain/entities'

export function useStudyFocus() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [activeTab, setActiveTab] = useState('courses')

  const startStudySession = useCallback((course: Course) => {
    setSelectedCourse(course)
    setActiveTab('study')
  }, [])

  const handleTimerStart = useCallback(() => {
    setIsTimerRunning(true)
  }, [])

  const handleTimerPause = useCallback(() => {
    setIsTimerRunning(false)
  }, [])

  return {
    selectedCourse,
    setSelectedCourse,
    isTimerRunning,
    activeTab,
    setActiveTab,
    startStudySession,
    handleTimerStart,
    handleTimerPause,
  }
}
