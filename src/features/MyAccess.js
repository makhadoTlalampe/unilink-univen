import React from 'react';
import { Link } from 'react-router-dom';
import './Feature.css';

const MyAccess = () => {
    return (
        <div className="feature-page">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1>🔒 My Access – Campus Access Card</h1>
            <p className="feature-subtitle">Manage your campus access card and facility permissions</p>
            <div className="feature-card-content">
                <p style={{ marginBottom: 20, color: '#555' }}>
                    The My Access system manages your student access card, which grants you entry
                    to campus buildings, residences, and facilities. Use this portal to report lost
                    cards, request access, or check your access history.
                </p>
                <a
                    href="https://myaccess.univen.ac.za"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link"
                >
                    Open My Access Portal →
                </a>
                <div className="contact-info">
                    <h3>Access Card Services</h3>
                    <ul className="info-list">
                        <li>Report a lost or stolen access card immediately.</li>
                        <li>Request temporary access if your card is unavailable.</li>
                        <li>View which buildings you have access to.</li>
                        <li>Collect replacement cards from Security Office.</li>
                    </ul>
                </div>
                <div className="contact-info">
                    <h3>Security Office</h3>
                    <p>Phone: <strong>015 962 8000</strong></p>
                    <p>Location: <strong>Main Gate, Security Building</strong></p>
                    <p>Hours: <strong>24/7</strong></p>
                </div>
            </div>
        </div>
    );
};

export default MyAccess;
