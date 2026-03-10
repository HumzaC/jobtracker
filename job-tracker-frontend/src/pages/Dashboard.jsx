import React from 'react'

import { useState, useEffect, useCallback } from 'react'
import { Plus, LayoutGrid, List, LogOut, Briefcase } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getApplications, createApplication, updateApplication, deleteApplication } from '../api/applications'
import KanbanBoard from '../components/KanbanBoard'
import ApplicationTable from '../components/ApplicationTable'
import ApplicationModal from '../components/ApplicationModal'

const STATUSES = ['applied', 'interview', 'offer', 'rejected', 'withdrawn']

const STAT_COLORS = {
  applied: 'text-blue-400',
  interview: 'text-amber-400',
  offer: 'text-green-400',
  rejected: 'text-red-400',
  withdrawn: 'text-slate-500',
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [applications, setApplications] = useState([])
  const [view, setView] = useState('kanban')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchApps = useCallback(async () => {
    try {
      const data = await getApplications()
      setApplications(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchApps() }, [fetchApps])

  const handleSave = async (payload) => {
    if (editing) {
      const updated = await updateApplication(editing.id, payload)
      setApplications(prev => prev.map(a => a.id === editing.id ? updated : a))
    } else {
      const created = await createApplication(payload)
      setApplications(prev => [created, ...prev])
    }
    setEditing(null)
  }

  const handleEdit = (app) => {
    setEditing(app)
    setModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return
    await deleteApplication(id)
    setApplications(prev => prev.filter(a => a.id !== id))
  }

  const handleStatusChange = async (id, newStatus) => {
    const updated = await updateApplication(id, { status: newStatus })
    setApplications(prev => prev.map(a => a.id === id ? updated : a))
  }

  const stats = STATUSES.map(s => ({
    status: s,
    count: applications.filter(a => a.status === s).length
  }))

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Navbar */}
      <header className="border-b border-ink-700 bg-ink-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-6 py-3 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-white tracking-tight">
            Job<span className="text-amber-400">Track</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-sm hidden sm:block">{user?.email}</span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors text-sm"
            >
              <LogOut size={14} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-5 gap-3 mb-8">
          {stats.map(({ status, count }) => (
            <div key={status} className="bg-ink-800 border border-ink-600 rounded-xl px-4 py-3">
              <p className={`font-display text-2xl font-bold ${STAT_COLORS[status]}`}>{count}</p>
              <p className="text-slate-500 text-xs mt-0.5 capitalize">{status}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-slate-500" />
            <span className="font-display text-white font-semibold">
              {applications.length} Application{applications.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-ink-800 border border-ink-600 rounded-lg p-0.5">
              <button
                onClick={() => setView('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  view === 'kanban' ? 'bg-ink-600 text-white' : 'text-slate-500 hover:text-white'
                }`}
              >
                <LayoutGrid size={14} />
                <span className="hidden sm:inline">Board</span>
              </button>
              <button
                onClick={() => setView('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  view === 'table' ? 'bg-ink-600 text-white' : 'text-slate-500 hover:text-white'
                }`}
              >
                <List size={14} />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>

            <button
              onClick={() => { setEditing(null); setModalOpen(true) }}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-ink-950 font-semibold px-4 py-2 rounded-lg text-sm transition-colors font-display"
            >
              <Plus size={15} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Views */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-600">Loading...</div>
        ) : view === 'kanban' ? (
          <KanbanBoard
            applications={applications}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <ApplicationTable
            applications={applications}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      <ApplicationModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSave={handleSave}
        initial={editing}
      />
    </div>
  )
}