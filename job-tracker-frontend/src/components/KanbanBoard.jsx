import React from 'react'

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Edit2, Trash2, Calendar, Building2 } from 'lucide-react'

const COLUMNS = [
  { id: 'applied', label: 'Applied', color: 'border-blue-500/40', dot: 'bg-blue-400' },
  { id: 'interview', label: 'Interview', color: 'border-amber-400/40', dot: 'bg-amber-400' },
  { id: 'offer', label: 'Offer', color: 'border-green-500/40', dot: 'bg-green-400' },
  { id: 'rejected', label: 'Rejected', color: 'border-red-500/40', dot: 'bg-red-400' },
  { id: 'withdrawn', label: 'Withdrawn', color: 'border-slate-500/40', dot: 'bg-slate-500' },
]

export default function KanbanBoard({ applications, onEdit, onDelete, onStatusChange }) {
  const byStatus = COLUMNS.reduce((acc, col) => {
    acc[col.id] = applications.filter(a => a.status === col.id)
    return acc
  }, {})

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId) return

    const app = applications.find(a => String(a.id) === draggableId)
    if (app) await onStatusChange(app.id, destination.droppableId)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[60vh]">
        {COLUMNS.map(col => (
          <div key={col.id} className={`flex-shrink-0 w-64 bg-ink-800 border ${col.color} rounded-xl flex flex-col`}>
            <div className="px-4 py-3 border-b border-ink-600 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${col.dot}`} />
              <span className="font-display text-sm font-semibold text-white">{col.label}</span>
              <span className="ml-auto text-xs text-slate-500 bg-ink-700 px-2 py-0.5 rounded-full">
                {byStatus[col.id]?.length || 0}
              </span>
            </div>

            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 p-3 space-y-2 min-h-[100px] transition-colors rounded-b-xl ${
                    snapshot.isDraggingOver ? 'bg-ink-700/50' : ''
                  }`}
                >
                  {byStatus[col.id]?.map((app, index) => (
                    <Draggable key={String(app.id)} draggableId={String(app.id)} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-ink-900 border border-ink-600 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-shadow ${
                            snapshot.isDragging ? 'shadow-xl shadow-black/40 rotate-1' : 'hover:border-ink-500'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">{app.role_title}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <Building2 size={11} className="text-slate-500 flex-shrink-0" />
                                <p className="text-slate-400 text-xs truncate">{app.company}</p>
                              </div>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <button
                                onClick={() => onEdit(app)}
                                className="text-slate-600 hover:text-amber-400 transition-colors p-0.5"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => onDelete(app.id)}
                                className="text-slate-600 hover:text-red-400 transition-colors p-0.5"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                          {app.applied_date && (
                            <div className="flex items-center gap-1 mt-2">
                              <Calendar size={10} className="text-slate-600" />
                              <span className="text-slate-600 text-xs">{app.applied_date}</span>
                            </div>
                          )}
                          {app.notes && (
                            <p className="text-slate-500 text-xs mt-1.5 line-clamp-2">{app.notes}</p>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}