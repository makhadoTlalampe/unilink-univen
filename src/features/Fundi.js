import React from 'react';
import { Link } from 'react-router-dom';
import './Feature.css';

const Fundi = () => {
    return (
        <div className="feature-page">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1>💰 Fundi Student Funding</h1>
            <p className="feature-subtitle">Manage your student funding through the Fundi portal</p>
            <div className="feature-card-content">
                <p style={{ marginBottom: 20, color: '#555' }}>
                    Fundi provides education finance solutions to help students fund their studies.
                    Use the link below to access the Fundi portal and manage your funding applications.
                </p>
                <a
                    href="https://www.fundi.co.za"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link"
                >
                    Visit Fundi Portal →
                </a>
                <div className="info-box">
                    <strong>Need help?</strong> Contact the UNIVEN Financial Aid office at{' '}
                    <strong>015 962 8000</strong> or email <strong>financialaid@univen.ac.za</strong>.
                </div>
                <div className="contact-info">
                    <h3>Useful Information</h3>
                    <ul className="info-list">
                        <li>Apply for a Fundi study loan to cover tuition, accommodation, and textbooks.</li>
                        <li>Track your loan application status online.</li>
                        <li>Repayments begin after you complete your studies.</li>
                        <li>Speak to Financial Aid for NSFAS and bursary queries.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Fundi;
