import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from "react-router-dom"
import { AppContext } from '../context/AppContext'
import { useContext } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

const Navbar = () => {
  const navigate = useNavigate()

  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext)

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + `/api/auth/send-verify-otp`)
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout')
      data.success && setIsLoggedin(false)
      data.success && setUserData(false)
      navigate("/")
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='w-full flex justify-between items-center p-6 sm:p-7 sm:px-24 absolute top-0'>
      <button onClick={() => { navigate('/') }} className='text-2xl font-bold flex items-center justify-center gap-2'>
        <img className='h-8 w-8 sm:h-10 sm:w-10' src={assets.locked_key} alt="" />
        <h1 className='select-none text-xl' >MERN - Authencation</h1></button>

      {userData ? <div className='w-10 h-10 bn5 flex justify-center items-center rounded-full bg-white text-2xl shadow text-black relative group'>
        {userData.name[0].toUpperCase()}
        <div className='absolute w-32 hidden group-hover:block top-3 right-1 z-10 text-black rounded py-10'>
          <ul className='verify-list list-none shadow m-0 p-2 bg-gray-100 text-sm'>
            {
              !userData.idAccountVerified &&
              <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer' onClick={sendVerificationOtp}>Verify Email</li>
            }
            <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Logout</li>
          </ul>
        </div>
      </div> :
        <button onClick={() => { navigate('/login') }} className='bn5 text-sm flex items-center rounded-full py-2 px-4 text-gray-800 sm:text-lg'>Login
          <img className='h-6 w-6' src={assets.right_arrow} alt="" />
        </button>
      }
    </div>
  )
}

export default Navbar