import Link from 'next/link'
import { Button } from '@/src/ui/common/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/ui/common/ui/card'
import { BookOpen, Home, Search } from 'lucide-react'
import Footer from '@/src/ui/common/Footer'

const NotFound = () => {
  return (
    <>
      {/* Main Content */}
      <main className='container mx-auto px-4 py-16 flex-1'>
        <div className='max-w-2xl mx-auto text-center'>
          {/* 404 Icon */}
          <div className='mb-8'>
            <div className='w-32 h-32 mx-auto bg-gradient-to-br from-accent/20 to-accent/30 rounded-full flex items-center justify-center border border-accent/30'>
              <BookOpen className='w-16 h-16 text-accent' />
            </div>
          </div>

          {/* 404 Message */}
          <Card className='border-accent/20 bg-gradient-to-br from-accent/5 via-accent/10 to-accent/5 shadow-lg'>
            <CardHeader className='text-center pb-4'>
              <CardTitle className='text-4xl font-serif font-bold text-foreground mb-2'>
                404
              </CardTitle>
              <CardDescription className='text-xl text-muted-foreground'>
                ¡Ups! Página no encontrada
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <p className='text-foreground leading-relaxed'>
                Parece que te has perdido en tu viaje de aprendizaje. La página
                que buscas no existe o ha sido movida.
              </p>

              <div className='space-y-4'>
                <div className='p-4 bg-muted/50 rounded-lg border border-muted'>
                  <h3 className='font-medium text-foreground mb-2 flex items-center gap-2'>
                    <Search className='w-4 h-4 text-accent' />
                    ¿Qué puedes hacer?
                  </h3>
                  <ul className='text-sm text-muted-foreground space-y-1 text-left'>
                    <li>• Verificar que la URL esté escrita correctamente</li>
                    <li>• Volver a la página principal</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                <Button asChild className='bg-primary hover:bg-primary/90'>
                  <Link href='/'>
                    <Home className='w-4 h-4 mr-2' />
                    Ir al Inicio
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default NotFound
