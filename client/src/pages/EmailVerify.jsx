import React, { useContext, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify';

const EmailVerify = () => {
  const navigate = useNavigate()
  const { backendUrl, getUserData, isLoggedin, userData } = useContext(AppContext)
  const inputRefs = useRef([])

  axios.defaults.withCredentials = true;

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handlekeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text")
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp })
      if (data.success) {
        toast.success(data.message)
        getUserData()
        navigate("/")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    isLoggedin && userData && userData.idAccountVerified && navigate("/")
  }, [isLoggedin, userData])

  return (
    <div className='h-screen w-screen flex items-center justify-center flex-col bg-color'>
      <button onClick={() => { navigate('/') }} className='text-2xl mb-5 z-10 font-bold flex items-center justify-center gap-2'>
        <img className='h-10 w-10' src={assets.locked_key} alt="" />
        <h1>MERN - Authencation</h1></button>
      <div className="w-90 sm:w-90 rounded-lg shadow h-auto p-6 bg-white relative overflow-hidden">
        <div className="flex flex-col justify-center items-center space-y-2">
          <h2 className="text-2xl font-medium text-slate-700 select-none">Verify Email</h2>
          <p className="text-slate-500 select-none">Enter the 6-Digit Code Send to your Email Id.</p>
        </div>
        <form onSubmit={onSubmitHandler} className="w-full mt-4 space-y-3">
          <div className='flex items-center justify-center' onPaste={handlePaste} >
            {Array(6).fill(0).map((_, index) => (
              < input className='w-9 h-9 sm:w-12 sm:h-12 m-1 text-center bg-gray-200 text-xl rounded-md'
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handlekeyDown(e, index)}
                type="text"
                maxLength='1'
                key={index} required />
            ))}
          </div>
          <button className="w-full justify-center py-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md text-white ring-2" id="login" name="login" type="submit">
            Verify
          </button>
        </form>
      </div>
    </div >
  )
}


export default EmailVerify