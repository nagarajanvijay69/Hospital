import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../../context/DoctorContext'
import { backendUrl } from '../../utils/constants'

const DoctorProfile = () => {
  const { dToken, profileData, getProfileData, setProfileData } = useContext(DoctorContext)
  const [isEdit, setIsEdit] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (dToken) getProfileData()
  }, [dToken])

  const updateProfile = async () => {
    setSaving(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        {
          fees: profileData.fees,
          address: profileData.address,
          available: profileData.available
        },
        { headers: { dToken } }
      )
      if (data.success) {
        toast.success(data.message)
        await getProfileData()
        setIsEdit(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (!profileData) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 animate-fadeIn">
      <div className="mb-6">
        <h1 className="text-2xl font-bold gradient-text">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your doctor profile</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-violet-600 p-8 flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 border-4 border-white/30 flex items-center justify-center text-white text-2xl font-bold">
              {profileData.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Dr. {profileData.name}</h2>
              <p className="text-sky-100 text-sm mt-0.5">{profileData.degree} · {profileData.experience}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white">
                {profileData.speciality}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Info */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Professional Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Email</span>
                  <span className="text-sm font-medium text-slate-700">{profileData.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Speciality</span>
                  <span className="text-sm font-medium text-slate-700">{profileData.speciality}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-50">
                  <span className="text-sm text-slate-500">Experience</span>
                  <span className="text-sm font-medium text-slate-700">{profileData.experience}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-slate-500">About</span>
                  <span className="text-sm text-slate-600 text-right max-w-xs">{profileData.about}</span>
                </div>
              </div>
            </div>

            {/* Editable Section */}
            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Editable Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Consultation Fee (₹)
                  </label>
                  {isEdit ? (
                    <input
                      type="number"
                      min="0"
                      value={profileData.fees}
                      onChange={e => setProfileData(p => ({ ...p, fees: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
                    />
                  ) : (
                    <p className="text-sm text-slate-700 px-4 py-3 bg-slate-50 rounded-xl font-semibold text-sky-600">
                      ₹{profileData.fees}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Address Line 1</label>
                  {isEdit ? (
                    <input
                      type="text"
                      value={profileData.address?.line1}
                      onChange={e => setProfileData(p => ({ ...p, address: { ...p.address, line1: e.target.value } }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
                    />
                  ) : (
                    <p className="text-sm text-slate-700 px-4 py-3 bg-slate-50 rounded-xl">{profileData.address?.line1 || 'Not set'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Address Line 2</label>
                  {isEdit ? (
                    <input
                      type="text"
                      value={profileData.address?.line2}
                      onChange={e => setProfileData(p => ({ ...p, address: { ...p.address, line2: e.target.value } }))}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
                    />
                  ) : (
                    <p className="text-sm text-slate-700 px-4 py-3 bg-slate-50 rounded-xl">{profileData.address?.line2 || 'Not set'}</p>
                  )}
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Availability Status</p>
                    <p className="text-xs text-slate-400 mt-0.5">Patients can book appointments when you're available</p>
                  </div>
                  {isEdit ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.available}
                        onChange={e => setProfileData(p => ({ ...p, available: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-sky-500 transition-colors duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5 relative" />
                    </label>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      profileData.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {profileData.available ? 'Available' : 'Unavailable'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-slate-100 pt-6 flex gap-3">
              {isEdit ? (
                <>
                  <button
                    onClick={updateProfile}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 text-white font-semibold text-sm hover:shadow-md transition-all disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEdit(false)}
                    className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEdit(true)}
                  className="px-6 py-2.5 rounded-xl border-2 border-sky-500 text-sky-600 font-semibold text-sm hover:bg-sky-50 transition-all"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
