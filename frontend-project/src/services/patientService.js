import api from './api';

export const getPatients = () => api.get('/patients');
export const getPatient = (id) => api.get(`/patients/${id}`);
export const createPatient = (patientData) => api.post('/patients', patientData);
export const updatePatient = (id, patientData) => api.put(`/patients/${id}`, patientData);
export const deletePatient = (id) => api.delete(`/patients/${id}`);
