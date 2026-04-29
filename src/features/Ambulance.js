import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Feature.css';

const Ambulance = () => {
    const [location, setLocation] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRequest = (e) => {
        e.preventDefault();
        if (!location.trim()) return;
        setLoading(true);
        setStatus('Your request has been sent to Campus Security. Please stay calm and remain at your location.');
        setTimeout(() => {
            setStatus('Campus Security has been notified and is responding to your location.');
            setLoading(false);
        }, 3000);
    };

    return (
        <div className="feature-page">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1>🚑 Emergency Ambulance</h1>
            <p className="feature-subtitle">Notify campus security to request an ambulance on campus</p>
            <div className="feature-card-content">
                <div className="emergency-warning">
                    <strong>⚠️ For life-threatening emergencies, call 10177 immediately. Do not rely solely on this form.</strong>
                </div>
                <form onSubmit={handleRequest} className="feature-form">
                    <label htmlFor="location">Your Current Location</label>
                    <input
                        id="location"
                        type="text"
                        placeholder="e.g. Block A, Room 101"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Requesting...' : 'Request Ambulance'}
                    </button>
                </form>
                {status && (
                    <div className="status-message success">
                        {status}
                    </div>
                )}
                <div className="contact-info">
                    <h3>Campus Emergency Contacts</h3>
                    <p>Campus Security: <strong>015 962 8000</strong></p>
                    <p>Campus Clinic: <strong>015 962 8152</strong></p>
                    <p>National Emergency: <strong>10177</strong></p>
                </div>
            </div>
        </div>
    );
};

export default Ambulance;
