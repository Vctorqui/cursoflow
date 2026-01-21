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
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Completa la información sobre el curso que deseas estudiar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Nombre del Curso</Label>
            <Input
              id='name'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Descripción</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='duration'>Semanas (Duración)</Label>
              <Input
                id='duration'
                type='number'
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='frequency'>Sesiones por Semana</Label>
              <Input
                id='frequency'
                type='number'
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='schedule'>Horario (Opcional)</Label>
            <Input
              id='schedule'
              value={formData.schedule}
              onChange={(e) =>
                setFormData({ ...formData, schedule: e.target.value })
              }
            />
          </div>
          <Button type='submit' className='w-full'>
            {initialData ? 'Actualizar' : 'Registrar'} Curso
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
