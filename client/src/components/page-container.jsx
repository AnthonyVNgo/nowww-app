import { useLocation } from "react-router-dom"

const PageContainer = ({children}) => {
  let location = useLocation().pathname
  let padding = location === '/login' || location === '/sign-up' 
    ? '0'
    : '5'

  return (
    // // <div className="bg-light">
    // <div className="bg-dark">
      <div className={`container py-${padding} min-vh-100`}>
        {children}
      </div>
    // </div>
  )
}

export default PageContainer