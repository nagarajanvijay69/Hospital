import { useState } from 'react'
import { toast } from 'react-toastify'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you soon.')
      setForm({ name: '', email: '', message: '' })
      setSending(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-violet-50 py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl font-extrabold gradient-text">Contact Us</h1>
          <p className="text-slate-500 mt-3">We're here to help. Reach out to our support team.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Info */}
          <div className="space-y-5">
            {[
              { icon: '📍', title: 'Address', info: '123 Healthcare Ave, Medical City, HC 90210' },
              { icon: '📞', title: 'Phone', info: '+1 (555) 123-4567' },
              { icon: '📧', title: 'Email', info: 'care@medcare.com' },
              { icon: '🕐', title: 'Hours', info: 'Mon–Sat: 8AM – 8PM' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center text-xl shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-slate-700 text-sm">{item.title}</h3>
                  <p className="text-slate-500 text-sm mt-0.5">{item.info}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 animate-fadeIn">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Message</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm resize-none"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 text-white font-bold text-sm hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-60"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Contact
