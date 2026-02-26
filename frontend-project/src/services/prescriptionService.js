import api from './api';

export const getPrescriptions = () => api.get('/prescriptions');
export const getPrescription = (id) => api.get(`/prescriptions/${id}`);
export const createPrescription = (data) => api.post('/prescriptions', data);
export const updatePrescription = (id, data) => api.put(`/prescriptions/${id}`, data);
export const getPrescriptionInitData = (appointmentId) => api.get(`/prescriptions/init/${appointmentId}`);

const prescriptionService = {
    getPrescriptions,
    getPrescription,
    createPrescription,
    updatePrescription,
    getPrescriptionInitData
};

export default prescriptionService;
