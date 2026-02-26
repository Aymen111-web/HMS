import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import RoleDashboardRedirect from './components/RoleDashboardRedirect';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Patients from './pages/Patients';
import Pharmacists from './pages/Pharmacists';
import Appointments from './pages/Appointments';
import Departments from './pages/Departments';
import Billing from './pages/Billing';
import Reports from './pages/Reports';
import Support from './pages/Support';
import NotFound from './pages/NotFound';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions';
import CreatePrescription from './pages/doctor/CreatePrescription';
import UrgentCases from './pages/doctor/UrgentCases';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientAppointments from './pages/patient/PatientAppointments';
import BookAppointment from './pages/patient/BookAppointment';
import PatientPrescriptions from './pages/patient/PatientPrescriptions';
import MedicalRecords from './pages/patient/MedicalRecords';
import LabReports from './pages/patient/LabReports';
import PatientPayments from './pages/patient/PatientPayments';
import PatientProfile from './pages/patient/PatientProfile';
import PatientDoctors from './pages/patient/PatientDoctors';

// Pharmacist Pages
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <PublicRoute>
                                <Register />
                            </PublicRoute>
                        }
                    />

                    {/* Dashboard Redirect Handler */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute allowedRoles={['Admin', 'Doctor', 'Patient', 'Pharmacist']}>
                                <RoleDashboardRedirect />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['Admin']}>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="doctors" element={<Doctors />} />
                        <Route path="patients" element={<Patients />} />
                        <Route path="pharmacists" element={<Pharmacists />} />
                        <Route path="appointments" element={<Appointments />} />
                        <Route path="departments" element={<Departments />} />
                        <Route path="billing" element={<Billing />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="support" element={<Support />} />
                    </Route>

                    {/* Doctor Routes */}
                    <Route
                        path="/doctor"
                        element={
                            <ProtectedRoute allowedRoles={['Doctor']}>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="dashboard" element={<DoctorDashboard />} />
                        <Route path="patients" element={<DoctorPatients />} />
                        <Route path="appointments" element={<DoctorAppointments />} />
                        <Route path="prescriptions" element={<DoctorPrescriptions />} />
                        <Route path="prescriptions/new/:appointmentId" element={<CreatePrescription />} />
                        <Route path="urgent-cases" element={<UrgentCases />} />
                        <Route path="support" element={<Support />} />
                        <Route path="reports" element={<div>Doctor Reports Coming Soon</div>} />
                    </Route>

                    {/* Pharmacist Routes */}
                    <Route
                        path="/pharmacist"
                        element={
                            <ProtectedRoute allowedRoles={['Pharmacist']}>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="dashboard" element={<PharmacyDashboard />} />
                        <Route path="prescriptions" element={<PharmacyDashboard />} />
                        <Route path="support" element={<Support />} />
                    </Route>

                    {/* Patient Routes */}
                    <Route
                        path="/patient"
                        element={
                            <ProtectedRoute allowedRoles={['Patient']}>
                                <DashboardLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="dashboard" element={<PatientDashboard />} />
                        <Route path="appointments" element={<PatientAppointments />} />
                        <Route path="book-appointment" element={<BookAppointment />} />
                        <Route path="prescriptions" element={<PatientPrescriptions />} />
                        <Route path="records" element={<MedicalRecords />} />
                        <Route path="lab-reports" element={<LabReports />} />
                        <Route path="payments" element={<PatientPayments />} />
                        <Route path="profile" element={<PatientProfile />} />
                        <Route path="doctors" element={<PatientDoctors />} />
                        <Route path="support" element={<Support />} />
                    </Route>

                    {/* 404 Route */}
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
