import { MdOutlineMail, MdEmail, MdLock, MdRemoveRedEye, MdOutlineEast } from "react-icons/md"
import { ImSpinner8 } from "react-icons/im"
import { IoMdEyeOff } from "react-icons/io"
import { useRef, useState } from 'react'
import { toast } from "react-toastify";
import Button from "../components/layout/Button";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import OAuth from "../components/layout/OAuth";

function SignIn() {
  const navigate = useNavigate();
  const [state, setState] = useState({email: "", password: "", showPassword: false, loading: false})
  const classNames = ["absolute", "text-lg", "right-2", "bottom-1", "box-content", "hover:bg-gray-300", "hover:right-2", "hover:bottom-1", "p-1", "duration-100", "rounded-full"];
  const handleInput = (e) => {
    const { name, value, type } = e.target;
    setState({ ...state, [name]: value });
  }
  const handleShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(state.email.trim() === "" || state.password.trim() === "" ) {
      toast.error("Please enter all the fields!");
      return;
    }
    const auth = getAuth();
    setState(prevState => ({ ...prevState, loading: true }))
    try {
      const userCredential = await signInWithEmailAndPassword(auth, state.email, state.password);
      if(userCredential.user) {
        navigate("/profile");
      }
    } catch(error) {
      toast.error("Incorrect credentials!");
      setState({ ...state, loading: false })
    }
  }
  return (
    <div className="container">
      <div className='text-5xl mb-12'>Welcome back!</div>
      <form onSubmit={handleSubmit} className='flex flex-col justify-between h-60'>
        <div className="relative">
          <MdEmail className="absolute text-lg left-3 bottom-2"/>
          <input type="text" name="email" id="email" value={state.email} onChange={handleInput} className='w-full px-10 h-9 rounded-full' placeholder='Email'/>
        </div>
        <div className="relative">
          <MdLock className="absolute text-lg left-3 bottom-2"/>
          <input type={state.showPassword ? "text" : "password"} name="password" id="psw" value={state.password} onChange={handleInput} className='w-full px-10 h-9 rounded-full' placeholder='Password'/>
          {state.showPassword ? 
          <IoMdEyeOff onClick={handleShowPassword} name="showPassword" className={classNames.join(" ")} /> : 
          <MdRemoveRedEye onClick={handleShowPassword} name="showPassword" className={classNames.join(" ")} />}
        </div>
        <div className="container">
          <Link to="/forgot-password" className="w-fit text-green-500 hover:text-green-300 float-right">Forgot password?</Link>
        </div>
        <Button type="submit" position="mx-auto">
          {state.loading ? <ImSpinner8 className="animate-spin text-2xl" /> : 
          <span>Sign In</span>}
        </Button>
      </form>
      <OAuth/>
      <div className="w-fit mx-auto">
        <Link to="/sign-up" className="text-green-500 hover:text-green-300">Don't have an account? Register here!</Link>
      </div>
    </div>
  )
}

export default SignIn