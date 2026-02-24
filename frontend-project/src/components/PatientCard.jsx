import React from 'react';

const PatientCard = ({ patient }) => {
    return (
        <div className="patient-card">
            <h3>{patient?.name || 'Patient Name'}</h3>
            <p>Age: {patient?.age || 'N/A'}</p>
        </div>
    );
};

export default PatientCard;
