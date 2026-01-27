export function LoadingScreen() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='text-center'>
        <div className='w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4' />
        <p className='text-muted-foreground'>Cargando...</p>
      </div>
    </div>
  )
}
