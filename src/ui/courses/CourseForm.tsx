'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/src/ui/common/ui/button'
import { Input } from '@/src/ui/common/ui/input'
import { Textarea } from '@/src/ui/common/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/src/ui/common/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/ui/common/ui/form'

import {
  Course,
  CourseInputData,
  courseFormInputSchema,
  type CourseFormValues,
} from '../../domain/entities'

interface CourseFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CourseInputData) => void
  initialData?: Course | null
  title: string
}

function toCourseInputData(values: CourseFormValues): CourseInputData {
  return {
    name: values.name,
    description: values.description,
    duration: values.duration,
    frequency: values.frequency,
    schedule: values.schedule.trim() ? values.schedule.trim() : undefined,
  }
}

export function CourseForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
}: CourseFormProps) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormInputSchema),
    defaultValues: {
      name: '',
      description: '',
      duration: '',
      frequency: '',
      schedule: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const emptyValues: CourseFormValues = {
    name: '',
    description: '',
    duration: '',
    frequency: '',
    schedule: '',
  }

  useEffect(() => {
    if (!open) {
      form.reset(emptyValues)
      return
    }
    form.reset(
      initialData
        ? {
            name: initialData.name,
            description: initialData.description,
            duration: initialData.duration.toString(),
            frequency: initialData.frequency.toString(),
            schedule: initialData.schedule ?? '',
          }
        : emptyValues,
    )
  }, [open, initialData, form])

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(toCourseInputData(values))
    onOpenChange(false)
  })

  const labelClass =
    'text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[min(90dvh,calc(100vh-2rem))] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-[2.5rem] border border-primary/10 bg-card/80 p-0 shadow-2xl backdrop-blur-2xl sm:max-w-[520px]'>
        <div className='pointer-events-none absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl' />
        <DialogHeader className='shrink-0 space-y-2 px-8 pt-8 pb-4 pr-14 text-left'>
          <DialogTitle className='text-2xl font-black tracking-tight text-foreground sm:text-3xl'>
            {title}
          </DialogTitle>
          <DialogDescription className='text-[10px] font-medium tracking-[0.2em] text-muted-foreground/60 uppercase'>
            Gestiona la información de tu ruta de aprendizaje
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className='flex min-h-0 flex-1 flex-col'
            noValidate
          >
            <div className='min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-8 [scrollbar-gutter:stable] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border'>
              <div className='space-y-5 pb-2 sm:space-y-6'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem className='space-y-2'>
                      <FormLabel className={labelClass}>
                        Nombre del Curso
                      </FormLabel>
                      <FormControl>
                        <Input
                          id='name'
                          placeholder='Ej: Master en React 2024'
                          className='h-14 bg-muted/50 border-primary/10 rounded-2xl focus:ring-primary/50 text-foreground font-medium placeholder:text-muted-foreground/50'
                          autoComplete='off'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem className='space-y-2'>
                      <FormLabel className={labelClass}>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          id='description'
                          placeholder='¿De qué trata este curso?'
                          className='min-h-[100px] bg-muted/50 border-primary/10 rounded-2xl focus:ring-primary/50 text-foreground font-medium resize-none placeholder:text-muted-foreground/50'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='duration'
                    render={({ field }) => (
                      <FormItem className='space-y-2'>
                        <FormLabel className={labelClass}>Semanas</FormLabel>
                        <FormControl>
                          <Input
                            id='duration'
                            type='number'
                            min={1}
                            step={1}
                            className='h-14 bg-muted/50 border-primary/10 rounded-2xl focus:ring-primary/50 text-foreground font-medium'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='frequency'
                    render={({ field }) => (
                      <FormItem className='space-y-2'>
                        <FormLabel className={labelClass}>
                          Sesiones/Sem
                        </FormLabel>
                        <FormControl>
                          <Input
                            id='frequency'
                            type='number'
                            min={1}
                            step={1}
                            className='h-14 bg-muted/50 border-primary/10 rounded-2xl focus:ring-primary/50 text-foreground font-medium'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name='schedule'
                  render={({ field }) => (
                    <FormItem className='space-y-2'>
                      <FormLabel className={labelClass}>
                        Horario (Opcional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          id='schedule'
                          placeholder='Ej: Lunes y Miércoles 09:00 - 10:30'
                          className='h-14 bg-muted/50 border-primary/10 rounded-2xl focus:ring-primary/50 text-foreground font-medium placeholder:text-muted-foreground/50'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className='shrink-0 border-t border-primary/10 bg-card/95 px-8 py-4 backdrop-blur-md supports-backdrop-filter:bg-card/80'>
              <Button
                type='submit'
                className='h-14 w-full rounded-2xl bg-primary font-black text-base text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98] sm:h-16 sm:text-lg'
              >
                {initialData ? 'Actualizar Datos' : 'Registrar Curso'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
