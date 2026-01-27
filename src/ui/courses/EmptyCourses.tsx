'use client'

import React from 'react'
import { BookOpen, Plus } from 'lucide-react'
import { Button } from '@/src/ui/common/ui/button'

interface EmptyCoursesProps {
  onAdd: () => void
}

export function EmptyCourses({ onAdd }: EmptyCoursesProps) {
  return (
    <div className='text-center py-24 bg-card/40 backdrop-blur-md rounded-[2.5rem] border border-primary/5 shadow-2xl'>
      <div className='w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse'>
        <BookOpen className='w-10 h-10 text-primary opacity-80' />
      </div>
      <h3 className='text-3xl font-black text-foreground mb-2 tracking-tight'>
        ¡Prepárate para brillar! ✨
      </h3>
      <p className='text-muted-foreground font-medium uppercase text-[10px] tracking-[0.3em] mb-10 opacity-60'>
        Tu biblioteca de aprendizaje está vacía
      </p>
      <Button
        onClick={onAdd}
        size='lg'
        className='h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 gap-3'
      >
        <Plus className='w-6 h-6 stroke-[3]' /> Registrar mi primer curso
      </Button>
    </div>
  )
}
