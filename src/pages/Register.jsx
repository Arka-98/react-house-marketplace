import { MdPerson, MdEmail, MdLock, MdRemoveRedEye, MdInfo } from "react-icons/md"
import { IoMdEyeOff } from "react-icons/io"
import React, { useEffect, useRef, useState } from 'react'
import Button from "../components/layout/Button";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config"
import { ImSpinner8 } from "react-icons/im";
import { toast } from "react-toastify";
import OAuth from "../components/layout/OAuth";

function Register() {
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(true)
  const [errors, setErrors] = useState({
    username: null,
    email: null,
    password: null,
    confirmPassword: null
  })
  useEffect(()=>{
    setIsDisabled(isError())
  }, [errors])
  const [state, setState] = useState({username: "", email: "", password: "", confirmPassword: "", showPassword1: false, showPassword2: false, loading: false})
  const classNames = ["absolute", "text-lg", "right-2", "bottom-1", "box-content", "hover:bg-gray-300", "hover:right-2", "hover:bottom-1", "p-1", "duration-100", "rounded-full"];
  const isError = () => {
    for(let i in errors) {
        if(errors[i] || errors[i] === null) {
            return true
        }
    }
    return false
  }
  const handleInput = (e) => {
    const { name, value } = e.target;
    setErrors({ ...errors, [name]: !Boolean(value) })
    setState({ ...state, [name]: value });
  }
  const handleShowPassword1 = (e) => {
    setState(prevState => ({ ...prevState, showPassword1: !state.showPassword1 }))
  }
  const handleShowPassword2 = (e) => {
    setState(prevState => ({ ...prevState, showPassword2: !state.showPassword2 }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(state.password !== state.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setState({ ...state, loading: true })
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, state.email, state.password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: state.username });
      const formData = { username: state.username, email: state.email };
      formData.timestamp = serverTimestamp();
      await setDoc(doc(db, "users", user.uid), formData);
      navigate("/");
    } catch(error) {
      console.log(error)
      toast.error("Failed to register! "+error.message)
    }
  }
  return (
    <div className="container">
      <div className='text-5xl mb-12'>Create an account</div>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <div className="relative">
          <MdPerson className="absolute text-lg left-3 bottom-2"/>
          <input type="text" name="username" id="username" value={state.username} onChange={handleInput} className='w-full px-10 h-9 rounded-full' placeholder='Name'/>
        </div>
        {errors.username && <span className="flex items-center text-red-500"><MdInfo className="mr-2" />Please enter a username</span>}
        <div className="relative">
          <MdEmail className="absolute text-lg left-3 bottom-2"/>
          <input type="text" name="email" id="email" value={state.email} onChange={handleInput} className='w-full px-10 h-9 rounded-full' placeholder='Email'/>
        </div>
        {errors.email && <span className="flex items-center text-red-500"><MdInfo className="mr-2" />Please enter an email</span>}
        <div className="relative">
          <MdLock className="absolute text-lg left-3 bottom-2"/>
          <input type={state.showPassword1 ? "text" : "password"} name="password" id="psw1" value={state.password} onChange={handleInput} className='w-full px-10 h-9 rounded-full' placeholder='Password'/>
          {state.showPassword1 ? 
          <IoMdEyeOff onClick={handleShowPassword1} className={classNames.join(" ")} /> : 
          <MdRemoveRedEye onClick={handleShowPassword1} className={classNames.join(" ")} />}
        </div>
        {errors.password && <span className="flex items-center text-red-500"><MdInfo className="mr-2" />Please enter a password</span>}
        <div className="relative">
          <MdLock className="absolute text-lg left-3 bottom-2"/>
          <input type={state.showPassword2 ? "text" : "password"} name="confirmPassword" id="psw2" value={state.confirmPassword} onChange={handleInput} className='w-full px-10 h-9 rounded-full' placeholder='Confirm Password'/>
          {state.showPassword2 ? 
          <IoMdEyeOff onClick={handleShowPassword2} className={classNames.join(" ")} /> : 
          <MdRemoveRedEye onClick={handleShowPassword2} className={classNames.join(" ")} />}
        </div>
        {errors.confirmPassword && <span className="flex items-center text-red-500"><MdInfo className="mr-2" />Please re-enter password</span>}
        <Button type="submit" position="mx-auto" isDisabled={isDisabled}>
          {state.loading ? <ImSpinner8 className="animate-spin text-2xl" /> : 
            <span>Sign Up</span>}
        </Button>
      </form>
      <OAuth/>
      <div className="w-fit mx-auto my-5">
        <Link to="/sign-in" className="text-green-500 hover:text-green-300">Have an account? Sign in!</Link>
      </div>
    </div>
  )
}

export default Register;