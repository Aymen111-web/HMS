import api from './api';

export const getDoctors = () => api.get('/doctors');
export const getDoctor = (id) => api.get(`/doctors/${id}`);
export const createDoctor = (doctorData) => api.post('/doctors', doctorData);
export const updateDoctor = (id, doctorData) => api.put(`/doctors/${id}`, doctorData);
export const deleteDoctor = (id) => api.delete(`/doctors/${id}`);
