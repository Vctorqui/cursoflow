const Footer = () => {
  return (
    <>
      <footer className='mt-auto border-t border-border bg-card py-6'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <div className='text-center md:text-left'>
              <p className='text-sm text-muted-foreground'>
                Desarrollado con ❤️ por{' '}
                <span className='font-medium text-foreground'>
                  <a
                    href='https://www.linkedin.com/in/victorqui/'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline'
                  >
                    Victor Quiñones
                  </a>
                </span>
              </p>
            </div>
            <div className='text-center md:text-right'>
              <p className='text-xs text-muted-foreground'>
                CursoFlow v0.1.0 - Tu compañero de estudio constante
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
