import api from './api';

const prescriptionService = {
    getAll: async () => {
        const response = await api.get('/prescriptions');
        return response.data;
    },
    getDoctorPrescriptions: async (doctorId) => {
        const response = await api.get(`/prescriptions/doctor/${doctorId}`);
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/prescriptions/${id}`);
        return response.data;
    },
    create: async (prescriptionData) => {
        const response = await api.post('/prescriptions', prescriptionData);
        return response.data;
    }
};

export default prescriptionService;
