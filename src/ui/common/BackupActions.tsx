'use client'

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/ui/common/ui/dropdown-menu'
import { Button } from '@/src/ui/common/ui/button'
import { Settings, Database, Download, Upload } from 'lucide-react'
import { Course, StudySession } from '../../domain/entities'

interface BackupActionsProps {
  courses: Course[]
  sessions: StudySession[]
  onImport: (data: any) => void
}

export function BackupActions({
  courses,
  sessions,
  onImport,
}: BackupActionsProps) {
  const handleExport = () => {
    const data = { courses, sessions, exportDate: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cursoflow-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (!data.courses || !Array.isArray(data.courses)) {
          throw new Error('Formato inválido')
        }
        onImport(data)
      } catch (error) {
        alert('Error al importar los datos. El archivo JSON no es válido.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='w-9 h-9 rounded-full bg-white/5 border border-white/5 hover:bg-white/10'
          aria-label='Ajustes de datos'
        >
          <Settings className='w-4 h-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-72 p-2 border-white/10 bg-card/95 backdrop-blur-xl rounded-2xl'
      >
        <DropdownMenuLabel className='flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground px-3 py-2'>
          <Database className='w-4 h-4 text-primary' />
          Gestión de Datos
        </DropdownMenuLabel>
        <DropdownMenuSeparator className='bg-white/5 mx-2' />

        <DropdownMenuItem
          onClick={handleExport}
          className='flex flex-col items-start gap-1 p-3 cursor-pointer rounded-xl focus:bg-primary/10'
        >
          <div className='flex items-center gap-2 font-bold text-foreground'>
            <Download className='w-4 h-4 text-primary' />
            Exportar Backup
          </div>
          <p className='text-[10px] text-muted-foreground leading-relaxed font-medium'>
            Descarga un archivo JSON con todos tus cursos, progreso y notas.
          </p>
        </DropdownMenuItem>

        <DropdownMenuSeparator className='bg-white/5 mx-2' />

        <div className='relative'>
          <label className='cursor-pointer w-full'>
            <DropdownMenuItem
              asChild
              className='flex flex-col items-start gap-1 p-3 cursor-pointer rounded-xl focus:bg-primary/10'
            >
              <div>
                <div className='flex items-center gap-2 font-bold text-foreground'>
                  <Upload className='w-4 h-4 text-primary' />
                  Importar Backup
                </div>
                <p className='text-[10px] text-muted-foreground leading-relaxed font-medium'>
                  Restaurar datos desde un archivo .json generado previamente.
                </p>
              </div>
            </DropdownMenuItem>
            <input
              type='file'
              className='hidden'
              accept='.json'
              onChange={handleImport}
            />
          </label>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
