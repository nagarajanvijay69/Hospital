import { createContext, useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../utils/constants'
import { toast } from 'react-toastify'

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userData, setUserData] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(false)

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: { token }
      })
      if (data.success) {
        setUserData(data.userData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/doctors`)
      if (data.success) {
        setDoctors(data.doctors)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getDoctors()
  }, [])

  useEffect(() => {
    if (token) {
      loadUserProfileData()
    } else {
      setUserData(null)
    }
  }, [token])

  const value = {
    token, setToken,
    userData, setUserData,
    loadUserProfileData,
    doctors, getDoctors,
    loading, setLoading,
    backendUrl
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
