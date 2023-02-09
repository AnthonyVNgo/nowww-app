import { useLocation } from "react-router-dom";
import AuthForm from "../components/auth-form";

const AuthPage = () => {
  let location = useLocation().pathname

  return (
    <div className="row justify-content-center align-items-center vh-100">
      {/* <div className="col-12 col-sm-9 col-md-6 col-lg-5 col-xl-4 h-fit"> */}
      <div className="col-12 col-lg-6">
        <AuthForm action={location}></AuthForm>
      </div>
      <div className="d-none d-lg-block col-lg-6">
        <h1>image or vector goes here</h1>
      </div>
    </div>
  )
}

export default AuthPage