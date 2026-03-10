import React from 'react'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const STATUSES = ['applied', 'interview', 'offer', 'rejected', 'withdrawn']

export default function ApplicationModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    company: '', role_title: '', status: 'applied', applied_date: '', notes: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initial) {
      setForm({
        company: initial.company || '',
        role_title: initial.role_title || '',
        status: initial.status || 'applied',
        applied_date: initial.applied_date || '',
        notes: initial.notes || '',
      })
    } else {
      setForm({ company: '', role_title: '', status: 'applied', applied_date: '', notes: '' })
    }
  }, [initial, open])

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, applied_date: form.applied_date || null, notes: form.notes || null }
      await onSave(payload)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-ink-800 border border-ink-600 rounded-2xl p-6 w-full max-w-lg animate-slide-up shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-semibold text-white">
            {initial ? 'Edit application' : 'New application'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Company *</label>
              <input
                value={form.company}
                onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                required
                className="w-full bg-ink-700 border border-ink-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Role *</label>
              <input
                value={form.role_title}
                onChange={e => setForm(f => ({ ...f, role_title: e.target.value }))}
                required
                className="w-full bg-ink-700 border border-ink-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                placeholder="Software Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full bg-ink-700 border border-ink-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Applied date</label>
              <input
                type="date"
                value={form.applied_date}
                onChange={e => setForm(f => ({ ...f, applied_date: e.target.value }))}
                className="w-full bg-ink-700 border border-ink-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              className="w-full bg-ink-700 border border-ink-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
              placeholder="Referral from John, good culture fit..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-ink-700 hover:bg-ink-600 text-slate-300 font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-amber-400 hover:bg-amber-500 text-ink-950 font-semibold py-2.5 rounded-lg transition-colors text-sm font-display disabled:opacity-50"
            >
              {loading ? 'Saving...' : initial ? 'Save changes' : 'Add application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}