import { useLocation } from "react-router-dom";
import AuthForm from "../components/auth-form";
import mockupImg from "../assets/nowww_landing_mockup.png"

const AuthPage = () => {
  let location = useLocation().pathname

  return (
    <div className="row justify-content-center align-items-center vh-100">
      <div className="col-12 col-lg-6">
        <AuthForm action={location}></AuthForm>
      </div>
      <div className="d-none d-lg-block col-lg-6" style={{height: '60vh'}}>
        <div className="d-flex justify-content-center" style={{height: '100%'}}>
          <img src={mockupImg} alt="" srcSet="" className="rounded rounded-3 shadow-lg" />
        </div>
      </div>
    </div>
  )
}

export default AuthPage