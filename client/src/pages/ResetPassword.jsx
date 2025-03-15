import React, { useContext, useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext'
import axios from 'axios'



const ResetPassword = () => {
  const navigate = useNavigate()
  const [isEmailSend, setIsEmailSend] = useState(false)
  const [otp, setOtp] = useState(0)
  const [isOtpSubmited, setIsOtpSubmited] = useState(false)

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setIsEmailSend(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map(e => e.value)
      setOtp(otpArray.join(''))
      setIsOtpSubmited(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword })
      data.success ? toast.success(data.messgae) : toast.error(data.message)
      data.success && navigate("/login")
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='h-screen w-screen flex items-center justify-center flex-col gap-5 bg-color'>
      <button onClick={() => { navigate('/') }} className='text-2xl mb-2 z-10 font-bold flex items-center justify-center gap-2'>
        <img className='h-10 w-10' src={assets.locked_key} alt="" />
        <h1>MERN - Authencation</h1></button>
      <div className="w-80 rounded-lg shadow h-auto p-6 bg-white relative overflow-hidden">
        <div className="flex flex-col justify-center items-center space-y-2">
          <h2 className="text-2xl font-medium text-slate-700">Reset Password</h2>
          {!isEmailSend && <p className="text-slate-500">Enter your Register Email.</p>}
          {!isOtpSubmited && isEmailSend && <p className="text-slate-500">Enter OTP send to your Email.</p>}
          {isOtpSubmited && isEmailSend && <p className="text-slate-500">Enter New Password.</p>}
        </div>

        {/* {Enter the Email} */}
        {!isEmailSend &&
          <div>
            <form onSubmit={onSubmitEmail} className="w-full mt-4 space-y-3">
              <div>
                <input onChange={e => setEmail(e.target.value)} value={email} className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300" placeholder="Email Id" id="email" name="email" type="email" />
              </div>
              <button className="w-full justify-center py-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md text-white ring-2" id="submit" name="submit" type="submit">
                Submit
              </button>
            </form>
          </div>
        }
        {/* {Enter the otp} */}
        {!isOtpSubmited && isEmailSend &&
          <form onSubmit={onSubmitOtp} className="w-full mt-4 space-y-3">
            <div className='flex items-center justify-center' onPaste={handlePaste} >
              {Array(6).fill(0).map((_, index) => (
                < input className='w-9 h-9 sm:w-10 sm:h-10 m-1 text-center bg-gray-200 text-xl rounded-md'
                  ref={e => inputRefs.current[index] = e}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handlekeyDown(e, index)}
                  type="text"
                  maxLength='1'
                  key={index} required />
              ))}
            </div>
            <button className="w-full justify-center py-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md text-white ring-2" id="submit" name="submit" type="submit">
              Verify
            </button>
          </form>
        }
        {/* {Enter the Email} */}
        {isOtpSubmited && isEmailSend &&
          <div>
            <form onSubmit={onSubmitNewPassword} className="w-full mt-4 space-y-3">
              <div>
                <input onChange={e => setNewPassword(e.target.value)} value={newPassword} className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300" placeholder="New Password" id="password" name="password" type="text" />
              </div>
              <button className="w-full justify-center py-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md text-white ring-2" id="submit" name="submit" type="submit">
                Submit
              </button>
            </form>
          </div>
        }
      </div>
    </div>
  )
}

export default ResetPassword