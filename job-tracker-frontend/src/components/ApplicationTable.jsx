import React from 'react'

import { Edit2, Trash2 } from 'lucide-react'

const STATUS_STYLES = {
  applied: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  interview: 'bg-amber-400/15 text-amber-300 border border-amber-400/25',
  offer: 'bg-green-500/15 text-green-300 border border-green-500/25',
  rejected: 'bg-red-500/15 text-red-300 border border-red-500/25',
  withdrawn: 'bg-slate-500/15 text-slate-400 border border-slate-500/25',
}

export default function ApplicationTable({ applications, onEdit, onDelete }) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-16 text-slate-600">
        <p className="text-lg font-display">No applications yet</p>
        <p className="text-sm mt-1">Add your first application to get started.</p>
      </div>
    )
  }

  return (
    <div className="bg-ink-800 border border-ink-600 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink-600">
            <th className="text-left px-5 py-3 text-slate-500 font-medium font-display text-xs uppercase tracking-wider">Company</th>
            <th className="text-left px-5 py-3 text-slate-500 font-medium font-display text-xs uppercase tracking-wider">Role</th>
            <th className="text-left px-5 py-3 text-slate-500 font-medium font-display text-xs uppercase tracking-wider">Status</th>
            <th className="text-left px-5 py-3 text-slate-500 font-medium font-display text-xs uppercase tracking-wider">Applied</th>
            <th className="text-left px-5 py-3 text-slate-500 font-medium font-display text-xs uppercase tracking-wider">Notes</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {applications.map((app, i) => (
            <tr
              key={app.id}
              className={`border-b border-ink-700 hover:bg-ink-700/40 transition-colors ${
                i === applications.length - 1 ? 'border-b-0' : ''
              }`}
            >
              <td className="px-5 py-3.5 text-white font-medium">{app.company}</td>
              <td className="px-5 py-3.5 text-slate-300">{app.role_title}</td>
              <td className="px-5 py-3.5">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[app.status]}`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </td>
              <td className="px-5 py-3.5 text-slate-400">{app.applied_date || '—'}</td>
              <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate">{app.notes || '—'}</td>
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => onEdit(app)}
                    className="text-slate-500 hover:text-amber-400 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(app.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}