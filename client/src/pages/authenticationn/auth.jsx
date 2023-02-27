import AuthForm from "./components/auth-form.tsx";
import mockupImg from "../../assets/nowww_landing_mockup.png"

const AuthPage = () => {
  return (
    <div className="row justify-content-center align-items-center vh-100">
      <div className="col-12 col-lg-6">
        <AuthForm/>
      </div>
      <div className="d-none d-lg-block col-lg-6" style={{height: '60vh'}}>
        <div className="d-flex justify-content-center" style={{height: '100%'}}>
          <img src={mockupImg} alt="user profile mockup for mobile devices" srcSet="" className="rounded rounded-3 shadow-lg" />
        </div>
      </div>
    </div>
  )
}

export default AuthPage