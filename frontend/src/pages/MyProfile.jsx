import { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'
import { backendUrl } from '../utils/constants'

const MyProfile = () => {
  const { userData, setUserData, loadUserProfileData, token } = useContext(AppContext)
  const [isEdit, setIsEdit] = useState(false)
  const [saving, setSaving] = useState(false)

  const updateProfile = async () => {
    setSaving(true)
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        {
          name: userData.name,
          phone: userData.phone,
          address: JSON.stringify(userData.address),
          dob: userData.dob,
          gender: userData.gender
        },
        { headers: { token } }
      )
      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
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

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-violet-50 py-10">
      <div className="max-w-2xl mx-auto px-6">
        <div className="animate-fadeIn">
          <h1 className="text-3xl font-extrabold gradient-text mb-2">My Profile</h1>
          <p className="text-slate-500 mb-8">Manage your personal and health information</p>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-sky-500 to-violet-600 p-8 flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white/20 border-4 border-white/30 flex items-center justify-center text-white text-2xl font-bold">
                {userData.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                {isEdit ? (
                  <input
                    type="text"
                    value={userData.name}
                    onChange={e => setUserData(p => ({ ...p, name: e.target.value }))}
                    className="bg-white/20 text-white placeholder-white/60 border border-white/30 rounded-xl px-3 py-2 text-xl font-bold outline-none focus:bg-white/30"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-white">{userData.name}</h2>
                )}
                <p className="text-sky-100 text-sm mt-1">{userData.email}</p>
              </div>
            </div>

            {/* Profile Body */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email</label>
                      <p className="text-sm text-slate-700 px-3 py-2.5 bg-slate-50 rounded-xl">{userData.email}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">Phone</label>
                      {isEdit ? (
                        <input
                          type="tel"
                          value={userData.phone}
                          onChange={e => setUserData(p => ({ ...p, phone: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
                        />
                      ) : (
                        <p className="text-sm text-slate-700 px-3 py-2.5 bg-slate-50 rounded-xl">{userData.phone || 'Not set'}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Address Line 1</label>
                    {isEdit ? (
                      <input
                        type="text"
                        value={userData.address?.line1}
                        onChange={e => setUserData(p => ({ ...p, address: { ...p.address, line1: e.target.value } }))}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
                      />
                    ) : (
                      <p className="text-sm text-slate-700 px-3 py-2.5 bg-slate-50 rounded-xl">{userData.address?.line1 || 'Not set'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Address Line 2</label>
                    {isEdit ? (
                      <input
                        type="text"
                        value={userData.address?.line2}
                        onChange={e => setUserData(p => ({ ...p, address: { ...p.address, line2: e.target.value } }))}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
                      />
                    ) : (
                      <p className="text-sm text-slate-700 px-3 py-2.5 bg-slate-50 rounded-xl">{userData.address?.line2 || 'Not set'}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Date of Birth</label>
                    {isEdit ? (
                      <input
                        type="date"
                        value={userData.dob}
                        onChange={e => setUserData(p => ({ ...p, dob: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
                      />
                    ) : (
                      <p className="text-sm text-slate-700 px-3 py-2.5 bg-slate-50 rounded-xl">{userData.dob || 'Not set'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5">Gender</label>
                    {isEdit ? (
                      <select
                        value={userData.gender}
                        onChange={e => setUserData(p => ({ ...p, gender: e.target.value }))}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm bg-white"
                      >
                        <option value="Not Selected">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="text-sm text-slate-700 px-3 py-2.5 bg-slate-50 rounded-xl">{userData.gender || 'Not set'}</p>
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
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 text-white font-semibold text-sm hover:shadow-md hover:scale-105 transition-all disabled:opacity-60 flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Saving...
                        </>
                      ) : 'Save Changes'}
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
    </div>
  )
}

export default MyProfile
