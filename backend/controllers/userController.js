import validator from 'validator'
import bcrypt from 'bcryptjs'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import jwt from 'jsonwebtoken'

// ============================================================
// TIME SLOTS LOGIC
// Morning: 10:00 AM - 1:00 PM  (slots: 10:00, 11:00, 12:00, 1:00 PM — total 4)
// Afternoon: 3:00 PM - 6:00 PM (slots: 3:00, 4:00, 5:00 PM — total 3 + 6PM end)
// Each session = 1 hour
// ============================================================
export const TIME_SLOTS = [
  '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM',
  '03:00 PM', '04:00 PM', '05:00 PM'
]

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !password || !email) {
      return res.json({ success: false, message: 'Missing Details' })
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Enter a valid email' })
    }
    if (password.length < 8) {
      return res.json({ success: false, message: 'Enter a strong password (min 8 chars)' })
    }
    const existingUser = await userModel.findOne({ email })
    if (existingUser) {
      return res.json({ success: false, message: 'Email already registered' })
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const userData = { name, email, password: hashedPassword }
    const newUser = new userModel(userData)
    const user = await newUser.save()
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: 'User does not exist' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Invalid credentials' })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body
    const userData = await userModel.findById(userId).select('-password')
    res.json({ success: true, userData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body
    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: 'Data Missing' })
    }
    await userModel.findByIdAndUpdate(userId, {
      name, phone, address: JSON.parse(address), dob, gender
    })
    res.json({ success: true, message: 'Profile Updated' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to book appointment
// Core logic: 1 person per slot per doctor — no double booking
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime, symptoms, medicalHistory, bloodGroup, age } = req.body

    // Validate slot time
    if (!TIME_SLOTS.includes(slotTime)) {
      return res.json({ success: false, message: 'Invalid slot time selected' })
    }

    const docData = await doctorModel.findById(docId).select('-password')
    if (!docData) {
      return res.json({ success: false, message: 'Doctor not found' })
    }
    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor not available' })
    }

    // Check if slot is already booked (max 1 person per slot)
    let slots_booked = docData.slots_booked
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: 'This slot is already booked. Please select another time.' })
      }
    } else {
      slots_booked[slotDate] = []
    }

    // Check if user already has appointment with this doctor on same date
    const existingAppointment = await appointmentModel.findOne({
      userId,
      docId,
      slotDate,
      cancelled: false
    })
    if (existingAppointment) {
      return res.json({ success: false, message: 'You already have an appointment with this doctor on this date.' })
    }

    // Book the slot
    slots_booked[slotDate].push(slotTime)
    const userData = await userModel.findById(userId).select('-password')

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      slotDate,
      slotTime,
      symptoms: symptoms || '',
      medicalHistory: medicalHistory || '',
      bloodGroup: bloodGroup || '',
      age: age || 0,
      amount: docData.fees,
      date: Date.now()
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    // Update doctor's booked slots
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })
    res.json({ success: true, message: 'Appointment Booked Successfully!' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to get user appointments
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body
    const appointments = await appointmentModel.find({ userId })
    res.json({ success: true, appointments })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)
    if (!appointmentData || appointmentData.userId !== userId) {
      return res.json({ success: false, message: 'Unauthorized action' })
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    // Release the slot
    const { docId, slotDate, slotTime } = appointmentData
    const doctorData = await doctorModel.findById(docId)
    let slots_booked = doctorData.slots_booked
    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
    }
    await doctorModel.findByIdAndUpdate(docId, { slots_booked })
    res.json({ success: true, message: 'Appointment Cancelled' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to get all doctors (for patient)
const getDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password -slots_booked')
    res.json({ success: true, doctors })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

// API to get doctor available slots
const getDoctorSlots = async (req, res) => {
  try {
    const { docId, slotDate } = req.query
    const docData = await doctorModel.findById(docId)
    if (!docData) {
      return res.json({ success: false, message: 'Doctor not found' })
    }

    const slots_booked = docData.slots_booked[slotDate] || []
    const availableSlots = TIME_SLOTS.filter(slot => !slots_booked.includes(slot))
    res.json({ success: true, availableSlots, bookedSlots: slots_booked })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export {
  registerUser, loginUser, getProfile, updateProfile,
  bookAppointment, listAppointment, cancelAppointment,
  getDoctors, getDoctorSlots
}
