import mongoose from 'mongoose'

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  speciality: { type: String, required: true },
  degree: { type: String, required: true },
  experience: { type: String, required: true },
  about: { type: String, required: true },
  available: { type: Boolean, default: true },
  fees: { type: Number, required: true },
  image: { type: String, default: '' },
  address: { type: Object, default: { line1: '', line2: '' } },
  // slots_booked stores date => array of booked slot times
  slots_booked: { type: Object, default: {} }
}, { minimize: false, timestamps: true })

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', doctorSchema)
export default doctorModel
