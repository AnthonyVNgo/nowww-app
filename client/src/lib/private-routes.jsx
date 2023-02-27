import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = (props) => {
  let auth = props.isAuthenticated

  return (
    auth ? <Outlet /> : <Navigate to="/login" />
  )
}

export default PrivateRoutes