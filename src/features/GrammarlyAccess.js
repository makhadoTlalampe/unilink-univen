import React from 'react';
import { Link } from 'react-router-dom';
import './Feature.css';

const GrammarlyAccess = () => {
    return (
        <div className="feature-page">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1>✍️ Grammarly Access</h1>
            <p className="feature-subtitle">Access free Grammarly Premium through UNIVEN</p>
            <div className="feature-card-content">
                <p style={{ marginBottom: 20, color: '#555' }}>
                    UNIVEN students have access to Grammarly Premium for free. Grammarly helps you
                    write clearly and correctly by checking grammar, spelling, style, and tone.
                </p>
                <a
                    href="https://www.grammarly.com/edu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link"
                >
                    Access Grammarly Premium →
                </a>
                <div className="contact-info">
                    <h3>How to Access</h3>
                    <ul className="info-list">
                        <li>Visit the Grammarly for Education link above.</li>
                        <li>Sign up or log in using your UNIVEN student email address.</li>
                        <li>Activate your free Premium subscription.</li>
                        <li>Install the browser extension or desktop app for the best experience.</li>
                    </ul>
                </div>
                <div className="info-box">
                    For access issues, contact the ICT Helpdesk at <strong>ict@univen.ac.za</strong>.
                </div>
            </div>
        </div>
    );
};

export default GrammarlyAccess;
