import { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { backendUrl } from '../utils/constants'

const MyAppointments = () => {
  const { token } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token }
      })
      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) fetchAppointments()
  }, [token])

  const getStatusBadge = (appt) => {
    if (appt.cancelled) return { label: 'Cancelled', color: 'bg-red-100 text-red-600' }
    if (appt.isCompleted) return { label: 'Completed', color: 'bg-green-100 text-green-600' }
    return { label: 'Upcoming', color: 'bg-sky-100 text-sky-600' }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-violet-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8 animate-fadeIn">
          <h1 className="text-3xl font-extrabold gradient-text">My Appointments</h1>
          <p className="text-slate-500 mt-1">View and manage your upcoming appointments</p>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-16 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-slate-700">No appointments yet</h3>
            <p className="text-slate-400 mt-2">Book your first appointment with one of our doctors.</p>
            <a
              href="/doctors"
              className="inline-block mt-5 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 text-white font-semibold hover:scale-105 transition-all"
            >
              Find a Doctor
            </a>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            {appointments.map((appt) => {
              const status = getStatusBadge(appt)
              return (
                <div
                  key={appt._id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Doctor Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center text-white text-lg font-bold">
                        {appt.docData?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-800">Dr. {appt.docData?.name}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{appt.docData?.speciality}</p>

                        <div className="mt-2 flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {appt.slotDate?.replace(/_/g, '/')}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {appt.slotTime}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            ₹{appt.amount}
                          </div>
                        </div>

                        {appt.symptoms && (
                          <div className="mt-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 max-w-xs">
                            <span className="font-semibold">Symptoms:</span> {appt.symptoms}
                          </div>
                        )}

                        {/* Doctor notes (if completed) */}
                        {appt.isCompleted && appt.doctorNotes && (
                          <div className="mt-2 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 max-w-xs border border-green-100">
                            <span className="font-semibold">Doctor Notes:</span> {appt.doctorNotes}
                          </div>
                        )}
                        {appt.isCompleted && appt.prescription && (
                          <div className="mt-1 text-xs text-violet-700 bg-violet-50 rounded-lg px-3 py-2 max-w-xs border border-violet-100">
                            <span className="font-semibold">Prescription:</span> {appt.prescription}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex sm:flex-col gap-2 sm:items-end justify-end">
                      {!appt.cancelled && !appt.isCompleted && (
                        <button
                          onClick={() => {
                            if (window.confirm('Cancel this appointment?')) {
                              cancelAppointment(appt._id)
                            }
                          }}
                          className="px-4 py-2 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-all"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyAppointments
