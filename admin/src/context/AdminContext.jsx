import { createContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../utils/constants'

export const AdminContext = createContext()

const AdminContextProvider = ({ children }) => {
  const [aToken, setAToken] = useState(localStorage.getItem('aToken') || '')
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(null)

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
        headers: { aToken }
      })
      if (data.success) setDoctors(data.doctors)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/change-availability`,
        { docId },
        { headers: { aToken } }
      )
      if (data.success) { toast.success(data.message); getAllDoctors() }
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: { aToken }
      })
      if (data.success) setAppointments(data.appointments.reverse())
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId },
        { headers: { aToken } }
      )
      if (data.success) { toast.success(data.message); getAllAppointments() }
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: { aToken }
      })
      if (data.success) setDashData(data.dashData)
      else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const value = {
    aToken, setAToken,
    doctors, getAllDoctors, changeAvailability,
    appointments, getAllAppointments, cancelAppointment,
    dashData, getDashData,
    backendUrl
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider
