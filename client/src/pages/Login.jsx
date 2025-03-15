import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify';

const Login = () => {

  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext)

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true;
      if (state === "Sign Up") {
        await axios.post(backendUrl + "/api/auth/register", { name, email, password })
          .then(function (response) {
            if (response.data.success) {
              setIsLoggedin(true)
              navigate("/")
              getUserData()
            } else {
              toast.error(response.data.Message)
            }
          })
          .catch(function (error) {
            toast.error(error.Message)
          });
      } else {
        await axios.post(backendUrl + "/api/auth/login", { email, password })
          .then(function (response) {
            if (response.data.success) {
              toast.success(response.data.Message);
              setIsLoggedin(true)
              navigate("/")
              getUserData()
            } else {
              toast.error(response.data.Message);
            }
          })
          .catch(function (error) {
            console.log(error)
            toast.error(error)
          });
      }
    } catch (error) {
      toast.error(error.Message)
    }
  }

  const navigate = useNavigate()
  return (
    <div className='h-screen w-screen flex items-center justify-center flex-col gap-5 bg-color'>
      <button onClick={() => { navigate('/') }} className='text-2xl font-bold flex items-center justify-center gap-2'>
        <img className='h-10 w-10' src={assets.locked_key} alt="" />
        <h1>MERN - Authencation</h1></button>
      <div className="w-80 rounded-lg shadow h-auto p-6 bg-white relative overflow-hidden form-shadow">
        <div className="flex flex-col justify-center items-center space-y-2">
          <h2 className="text-2xl font-medium text-slate-700 select-none">{state === "Sign Up" ? "Create Account" : "Login"}</h2>
        </div>
        <form onSubmit={submitHandler} className="w-full mt-4 space-y-3">
          {state === "Sign Up" && (<div>
            <input onChange={e => setName(e.target.value)} value={name} className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300" placeholder="Username" id="username" name="username" type="text" required />
          </div>)}
          <div>
            <input onChange={e => setEmail(e.target.value)} value={email} className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300" placeholder="Email Id" id="email" name="email" type="email" required />
          </div>
          <div>
            <input onChange={e => setPassword(e.target.value)} value={password} className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300" placeholder="Password" id="password" name="password" type="password" required />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input className="mr-2 w-4 h-4" id="remember" name="remember" type="checkbox" />
              <label htmlFor="remember">
                <span className="text-slate-500 select-none">Remember me </span>
              </label>
            </div>
            {state === "Login" && (<a className="text-blue-500 font-medium hover:underline" href="#" onClick={() => { navigate('/reset-password') }}>Forgot Password</a>)}
          </div>
          <button className="w-full justify-center py-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md text-white ring-2" id="login" name="login" type="submit">
            {state === "Sign Up" ? "Sign Up" : "Login"}
          </button>
          {
            state === "Sign Up" ? (
              <p className="flex justify-center space-x-1">
                <span className="text-slate-700 select-none">Already have an account? </span>
                <a className="text-blue-500 hover:underline" href="#" onClick={() => { setState("Login") }}>Login</a>
              </p>) : (
              <p className="flex justify-center space-x-1">
                <span className="text-slate-700 select-none"> Don't have an account? </span>
                <a className="text-blue-500 hover:underline" href="#" onClick={() => { setState("Sign Up") }}>Sign Up</a>
              </p>)
          }
        </form>
      </div>
    </div>
  )
}

export default Login