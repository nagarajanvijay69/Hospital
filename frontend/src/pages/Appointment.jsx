import { useContext, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { backendUrl, BLOOD_GROUPS, getAvailableDates } from '../utils/constants'

const Appointment = () => {
  const { docId } = useParams()
  const navigate = useNavigate()
  const { token, doctors } = useContext(AppContext)

  const [doctor, setDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [bookedSlots, setBookedSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [booking, setBooking] = useState(false)

  const [healthDetails, setHealthDetails] = useState({
    symptoms: '',
    medicalHistory: '',
    bloodGroup: '',
    age: ''
  })

  const availableDates = getAvailableDates()

  useEffect(() => {
    const doc = doctors.find(d => d._id === docId)
    if (doc) setDoctor(doc)
  }, [doctors, docId])

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate.dateStr)
    }
  }, [selectedDate])

  const fetchSlots = async (dateStr) => {
    setLoadingSlots(true)
    setSelectedSlot('')
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/doctor-slots?docId=${docId}&slotDate=${dateStr}`
      )
      if (data.success) {
        setAvailableSlots(data.availableSlots)
        setBookedSlots(data.bookedSlots)
      }
    } catch (error) {
      toast.error('Failed to load slots')
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleBooking = async () => {
    if (!token) {
      toast.warn('Please login to book an appointment')
      return navigate('/login')
    }
    if (!selectedDate || !selectedSlot) {
      return toast.warn('Please select a date and time slot')
    }
    if (!healthDetails.age || !healthDetails.symptoms) {
      return toast.warn('Please fill in your age and symptoms')
    }

    setBooking(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        {
          docId,
          slotDate: selectedDate.dateStr,
          slotTime: selectedSlot,
          symptoms: healthDetails.symptoms,
          medicalHistory: healthDetails.medicalHistory,
          bloodGroup: healthDetails.bloodGroup,
          age: parseInt(healthDetails.age)
        },
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        navigate('/my-appointments')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setBooking(false)
    }
  }

  const allSlotsForDisplay = [
    { label: 'Morning Session', time: '10:00 AM – 1:00 PM', slots: ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM'] },
    { label: 'Afternoon Session', time: '3:00 PM – 6:00 PM', slots: ['03:00 PM', '04:00 PM', '05:00 PM'] }
  ]

  const getSlotStatus = (slot) => {
    if (bookedSlots.includes(slot)) return 'booked'
    if (slot === selectedSlot) return 'selected'
    if (availableSlots.includes(slot)) return 'available'
    return 'unavailable'
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading doctor details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-violet-50 py-10">
      <div className="max-w-5xl mx-auto px-6">
        {/* Doctor Info Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-8 mb-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-28 h-28 shrink-0 rounded-2xl bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {doctor.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-start gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Dr. {doctor.name}</h1>
                  <p className="text-slate-500 text-sm mt-0.5">{doctor.degree} · {doctor.experience} experience</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  doctor.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                }`}>
                  {doctor.available ? '🟢 Available' : '🔴 Unavailable'}
                </span>
              </div>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold bg-sky-100 text-sky-700">
                {doctor.speciality}
              </span>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">{doctor.about}</p>
              <div className="mt-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-slate-600 text-sm">
                  Consultation Fee: <span className="font-bold text-sky-600 text-lg">₹{doctor.fees}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Date & Time selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Select Date
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {availableDates.map((date, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={`shrink-0 flex flex-col items-center px-4 py-3 rounded-2xl border-2 text-sm font-semibold transition-all duration-200 ${
                      selectedDate?.dateStr === date.dateStr
                        ? 'border-sky-500 bg-sky-500 text-white shadow-lg scale-105'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50'
                    }`}
                  >
                    <span className="text-xs font-normal">{date.day}</span>
                    <span className="text-lg font-bold">{date.display.split(' ')[1]}</span>
                    <span className="text-xs">{date.display.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fadeIn">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Available Time Slots
                  <span className="ml-auto text-xs font-normal text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                    1 hour per session
                  </span>
                </h2>

                {loadingSlots ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-5">
                    {allSlotsForDisplay.map((session) => (
                      <div key={session.label}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 rounded-full bg-sky-500" />
                          <span className="text-sm font-semibold text-slate-700">{session.label}</span>
                          <span className="text-xs text-slate-400">{session.time}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {session.slots.map(slot => {
                            const status = getSlotStatus(slot)
                            return (
                              <button
                                key={slot}
                                disabled={status === 'booked' || status === 'unavailable'}
                                onClick={() => status !== 'booked' && setSelectedSlot(slot)}
                                className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                  status === 'booked' || status === 'unavailable'
                                    ? 'slot-booked'
                                    : status === 'selected'
                                    ? 'slot-selected'
                                    : 'slot-available'
                                }`}
                              >
                                {slot}
                                {status === 'booked' && <span className="block text-xs font-normal">Booked</span>}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Legend */}
                <div className="flex gap-4 mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <div className="w-3 h-3 rounded-full bg-emerald-200 border border-emerald-400" />
                    Available
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <div className="w-3 h-3 rounded-full bg-sky-500" />
                    Selected
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                    Booked
                  </div>
                </div>
              </div>
            )}

            {/* Health Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Patient Health Details
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Age *</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      value={healthDetails.age}
                      onChange={e => setHealthDetails(p => ({ ...p, age: e.target.value }))}
                      placeholder="e.g. 30"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Blood Group</label>
                    <select
                      value={healthDetails.bloodGroup}
                      onChange={e => setHealthDetails(p => ({ ...p, bloodGroup: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm bg-white"
                    >
                      <option value="">Select</option>
                      {BLOOD_GROUPS.map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Symptoms / Reason for Visit *
                  </label>
                  <textarea
                    value={healthDetails.symptoms}
                    onChange={e => setHealthDetails(p => ({ ...p, symptoms: e.target.value }))}
                    placeholder="Describe your symptoms or reason for consultation..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Medical History (Optional)
                  </label>
                  <textarea
                    value={healthDetails.medicalHistory}
                    onChange={e => setHealthDetails(p => ({ ...p, medicalHistory: e.target.value }))}
                    placeholder="Any previous surgeries, allergies, ongoing medications..."
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-24">
              <h3 className="font-bold text-slate-800 mb-5 text-base">Booking Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Doctor</span>
                  <span className="font-semibold text-slate-700 text-right max-w-[130px]">Dr. {doctor.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Speciality</span>
                  <span className="font-semibold text-slate-700">{doctor.speciality}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Date</span>
                  <span className="font-semibold text-slate-700">
                    {selectedDate ? selectedDate.display : <span className="text-slate-300">Not selected</span>}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Time</span>
                  <span className="font-semibold text-slate-700">
                    {selectedSlot || <span className="text-slate-300">Not selected</span>}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-semibold text-slate-700">1 Hour</span>
                </div>
                <div className="border-t border-slate-100 pt-3 mt-1 flex justify-between">
                  <span className="font-bold text-slate-700">Consultation Fee</span>
                  <span className="font-extrabold text-sky-600 text-lg">₹{doctor.fees}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={booking || !selectedDate || !selectedSlot}
                className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 text-white font-bold text-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {booking ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Booking...
                  </>
                ) : 'Confirm Appointment'}
              </button>

              <p className="text-xs text-slate-400 text-center mt-3">
                By booking, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Appointment
