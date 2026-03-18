import React from 'react';
import { Link } from 'react-router-dom';
import './Feature.css';

const MoodleLogin = () => {
    return (
        <div className="feature-page">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1>📚 Moodle – Online Learning</h1>
            <p className="feature-subtitle">Access your UNIVEN online courses and learning materials</p>
            <div className="feature-card-content">
                <p style={{ marginBottom: 20, color: '#555' }}>
                    Moodle is the official Learning Management System (LMS) for the University of Venda.
                    Log in to access course materials, submit assignments, and communicate with lecturers.
                </p>
                <a
                    href="https://lms.univen.ac.za"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link"
                >
                    Go to Moodle (UNIVEN LMS) →
                </a>
                <div className="contact-info">
                    <h3>Quick Tips</h3>
                    <ul className="info-list">
                        <li>Use your student number as your username (e.g. u21234567).</li>
                        <li>Your initial password is your date of birth (DDMMYYYY).</li>
                        <li>Change your password on first login for security.</li>
                        <li>Contact ICT if you experience login issues.</li>
                    </ul>
                </div>
                <div className="info-box">
                    ICT Helpdesk: <strong>015 962 8500</strong> | Email: <strong>ict@univen.ac.za</strong>
                </div>
            </div>
        </div>
    );
};

export default MoodleLogin;
