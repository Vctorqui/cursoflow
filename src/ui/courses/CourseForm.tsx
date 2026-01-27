'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/src/ui/common/ui/button'
import { Input } from '@/src/ui/common/ui/input'
import { Label } from '@/src/ui/common/ui/label'
import { Textarea } from '@/src/ui/common/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/ui/common/ui/dialog'
import { Course, CourseInputData } from '../../domain/entities'

interface CourseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CourseInputData) => void
  initialData?: Course | null
  title: string
}

export function CourseForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
}: CourseFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    frequency: '',
    schedule: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        duration: initialData.duration.toString(),
        frequency: initialData.frequency.toString(),
        schedule: initialData.schedule || '',
      })
    } else {
      setFormData({
        name: '',
        description: '',
        duration: '',
        frequency: '',
        schedule: '',
      })
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px] border border-primary/10 bg-card/80 backdrop-blur-2xl shadow-2xl rounded-[2.5rem] p-8 overflow-hidden'>
        <div className='absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10 rounded-full' />
        <DialogHeader className='space-y-2 mb-4'>
          <DialogTitle className='text-3xl font-black tracking-tight text-foreground'>
            {title}
          </DialogTitle>
          <DialogDescription className='text-muted-foreground/60 font-medium uppercase text-[10px] tracking-[0.2em]'>
            Gestiona la información de tu ruta de aprendizaje
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label
              htmlFor='name'
              className='text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1'
            >
              Nombre del Curso
            </Label>
            <Input
              id='name'
              placeholder='Ej: Master en React 2024'
              className='h-14 bg-muted/50 border-primary/10 rounded-2xl focus:ring-primary/50 text-foreground font-medium placeholder:text-muted-foreground/50'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className='space-y-2'>
            <Label
              htmlFor='description'
              className='text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1'
            >
              Descripción
            </Label>
            <Textarea
              id='description'
              placeholder='¿De qué trata este curso?'
              className='min-h-[100px] bg-muted/50 border-primary/10 rounded-2xl focus:ring-primary/50 text-foreground font-medium resize-none placeholder:text-muted-foreground/50'
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label
                htmlFor='duration'
                className='text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1'
              >
                Semanas
              </Label>
              <Input
                id='duration'
                type='number'
                className='h-14 bg-muted/50 border-primary/10 rounded-2xl focus:ring-primary/50 text-foreground font-medium'
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                required
              />
            </div>
            <div className='space-y-2'>
              <Label
                htmlFor='frequency'
                className='text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1'
              >
                Sesiones/Sem
              </Label>
              <Input
                id='frequency'
                type='number'
                className='h-14 bg-muted/50 border-primary/10 rounded-2xl focus:ring-primary/50 text-foreground font-medium'
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label
              htmlFor='schedule'
              className='text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1'
            >
              Horario (Opcional)
            </Label>
            <Input
              id='schedule'
              placeholder='Ej: Lunes y Miércoles 09:00 - 10:30'
              className='h-14 bg-muted/50 border-primary/10 rounded-2xl focus:ring-primary/50 text-foreground font-medium placeholder:text-muted-foreground/50'
              value={formData.schedule}
              onChange={(e) =>
                setFormData({ ...formData, schedule: e.target.value })
              }
            />
          </div>
          <div className='pt-2'>
            <Button
              type='submit'
              className='w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-2xl text-lg shadow-xl shadow-primary/20 transition-all active:scale-95'
            >
              {initialData ? 'Actualizar Datos' : 'Registrar Curso'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
