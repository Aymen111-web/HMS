import React from 'react';

const DoctorCard = ({ doctor }) => {
    return (
        <div className="doctor-card">
            <h3>{doctor?.name || 'Doctor Name'}</h3>
            <p>{doctor?.specialization || 'Specialization'}</p>
        </div>
    );
};

export default DoctorCard;
