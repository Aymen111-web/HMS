import React from 'react';

const Appointments = () => {
    return (
        <div className="appointments-page">
            <h2>Appointments</h2>
            <table>
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Rows will go here */}
                </tbody>
            </table>
        </div>
    );
};

export default Appointments;
