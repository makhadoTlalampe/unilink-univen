import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Feature.css';

const MicrosoftReset = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="feature-page">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1>🔑 Microsoft 365 Password Reset</h1>
            <p className="feature-subtitle">Reset your UNIVEN Microsoft 365 account password</p>
            <div className="feature-card-content">
                {submitted ? (
                    <div className="status-message success">
                        ✅ A password reset link has been sent to {email}. Check your inbox and follow the instructions.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="feature-form">
                        <label htmlFor="email">UNIVEN Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="e.g. u21234567@univen.ac.za"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn-primary">Send Reset Link</button>
                    </form>
                )}
                <div className="info-box">
                    You can also reset your password directly at{' '}
                    <a href="https://passwordreset.microsoftonline.com" target="_blank" rel="noopener noreferrer">
                        Microsoft Online Password Reset
                    </a>.
                </div>
                <div className="contact-info">
                    <h3>Still Having Trouble?</h3>
                    <p>Contact the ICT Helpdesk: <strong>015 962 8500</strong></p>
                    <p>Email: <strong>ict@univen.ac.za</strong></p>
                </div>
            </div>
        </div>
    );
};

export default MicrosoftReset;
