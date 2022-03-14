import React, { useState } from 'react'
import { MdEmail } from "react-icons/md"
import { ImSpinner8 } from "react-icons/im"
import Button from '../components/layout/Button';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const [state, setState] = useState({email: "", loading: false});
  const handleInput = (e) => {
    const {name, value} = e.target;
    setState(prevState => ({ ...prevState, [name]: value }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(state.email.trim() === "") {
      toast.error("Please enter all the fields!");
      return;
    }
    const auth = getAuth();
    try {
      setState({ ...state, loading: true })
      await sendPasswordResetEmail(auth, state.email)
      toast.success("Reset email sent!")
    } catch (error) {
      toast.error("Could not send reset email!")
    }
    setState({ ...state, loading: false })
  }
  return (
    <>
      <div className='text-5xl mb-12'>Forgot Password</div>
      <form onSubmit={handleSubmit} className='flex flex-col justify-between h-28'>
          <div className="relative">
            <MdEmail className="absolute text-lg left-3 bottom-2"/>
            <input type="text" name="email" id="email" value={state.email} onChange={handleInput} className='w-full px-10 h-9 rounded-full' placeholder='Email'/>
          </div>
          <Button type="submit" position="mx-auto">
            {state.loading ? <ImSpinner8 className="animate-spin text-2xl" /> : 
            <span>Reset Account</span>}
          </Button>
      </form>
      <div className="w-fit mx-auto my-5">
        <Link to="/sign-in" className="text-green-500 hover:text-green-300">Sign in here!</Link>
      </div>
    </>
  )
}

export default ForgotPassword