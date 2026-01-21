export const useDateToday = () => {
    const getDateToday = () => {
      const date = new Date()
      return date.toISOString().split('T')[0]
    }
  
    return { getDateToday }
  }
  
  export default useDateToday