import api from './client'

export const getApplications = () => api.get('/applications/').then(r => r.data)
export const createApplication = (data) => api.post('/applications/', data).then(r => r.data)
export const updateApplication = (id, data) => api.patch(`/applications/${id}`, data).then(r => r.data)
export const deleteApplication = (id) => api.delete(`/applications/${id}`)