import React from 'react';

const Register = () => {
    return (
        <div className="register-page">
            <h2>Register</h2>
            <form>
                <input type="text" placeholder="Full Name" />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
