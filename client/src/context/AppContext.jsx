import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import axios from 'axios'


export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  axios.defaults.withCredentials = true;

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);


  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
      if (data.success) {
        setIsLoggedin(true)
        getUserData()
      }else{
        console.log(data.message,"getAuthState")
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error.message, "getAuthState")
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getAuthState();
  }, [])

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      console.log(data.message, data, {data})
      data.success ? setUserData(data.userdata) : toast.error(data.Message)
    } catch (error) {
      console.log(error.massage, "getUserData")
      toast.error(error.message)
    }
  }

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};
