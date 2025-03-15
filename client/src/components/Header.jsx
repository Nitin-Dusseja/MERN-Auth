import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'


const Header = () => {
  const { userData } = useContext(AppContext)
  return (
    <div className='h-screen w-screen flex items-center justify-center flex-col bg-color'>
      <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/People%20with%20professions/Man%20Technologist%20Light%20Skin%20Tone.png" alt="Man Technologist Light Skin Tone" width="250" height="250" />
      <div className='flex text-3xl items-center justify-center gap-3 select-none pt-2'><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Hand%20gestures/Waving%20Hand%20Light%20Skin%20Tone.png" alt="Waving Hand Light Skin Tone" width="55" height="55" /><h1 className='select-none'>Hey {userData ? userData.name : "Developers"}!</h1></div>
      <div><h1 className='text-3xl p-3 text-center select-none sm:text-5xl'>Welcome to Auth App</h1></div>
    </div>
  )
}

export default Header