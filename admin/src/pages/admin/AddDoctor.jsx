import { useState, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AdminContext } from '../../context/AdminContext'
import { backendUrl, SPECIALITIES } from '../../utils/constants'

const AddDoctor = () => {
  const { aToken } = useContext(AdminContext)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    speciality: '',
    degree: '',
    experience: '',
    about: '',
    fees: '',
    addressLine1: '',
    addressLine2: ''
  })

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          speciality: formData.speciality,
          degree: formData.degree,
          experience: formData.experience,
          about: formData.about,
          fees: Number(formData.fees),
          address: JSON.stringify({ line1: formData.addressLine1, line2: formData.addressLine2 })
        },
        { headers: { aToken } }
      )
      if (data.success) {
        toast.success(data.message)
        setFormData({
          name: '', email: '', password: '', speciality: '', degree: '',
          experience: '', about: '', fees: '', addressLine1: '', addressLine2: ''
        })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm text-slate-700 transition-all"
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5"

  return (
    <div className="p-6 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-text">Add New Doctor</h1>
        <p className="text-slate-500 text-sm mt-1">Fill in the details to register a new doctor</p>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center">1</div>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Dr. John Smith" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="doctor@hospital.com" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Password *</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Min 8 characters" minLength={8} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Consultation Fee (₹) *</label>
                <input type="number" name="fees" value={formData.fees} onChange={handleChange} required min="0" placeholder="500" className={inputCls} />
              </div>
            </div>
          </div>

          {/* Professional */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-violet-500 text-white text-xs flex items-center justify-center">2</div>
              Professional Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Speciality *</label>
                <select name="speciality" value={formData.speciality} onChange={handleChange} required className={inputCls + ' bg-white'}>
                  <option value="">Select Speciality</option>
                  {SPECIALITIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Degree *</label>
                <input type="text" name="degree" value={formData.degree} onChange={handleChange} required placeholder="MBBS, MD" className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Years of Experience *</label>
                <select name="experience" value={formData.experience} onChange={handleChange} required className={inputCls + ' bg-white'}>
                  <option value="">Select Experience</option>
                  {['1 Year', '2 Years', '3 Years', '4 Years', '5 Years', '6 Years', '7 Years', '8 Years', '9 Years', '10+ Years'].map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>About / Bio *</label>
                <textarea name="about" value={formData.about} onChange={handleChange} required rows={3} placeholder="Brief description about the doctor's expertise and background..." className={inputCls + ' resize-none'} />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center">3</div>
              Address
            </h3>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Address Line 1</label>
                <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Room No, Floor, Building" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Address Line 2</label>
                <input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} placeholder="Hospital Name, City" className={inputCls} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 text-white font-bold text-sm hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Adding Doctor...
              </>
            ) : 'Add Doctor'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddDoctor
