import React from 'react';
import { Link } from 'react-router-dom';
import './Feature.css';

const adminLinks = [
    { label: 'Student Portal (ITS)', url: 'https://student.univen.ac.za', description: 'View academic records, fees, and results' },
    { label: 'UNIVEN Official Website', url: 'https://www.univen.ac.za', description: 'University news, policies, and information' },
    { label: 'Online Application System', url: 'https://apply.univen.ac.za', description: 'Apply for admission online' },
    { label: 'Fee Payment Portal', url: 'https://fees.univen.ac.za', description: 'Pay your fees online' },
    { label: 'Results Portal', url: 'https://results.univen.ac.za', description: 'View semester examination results' },
];

const UNIVENAdmin = () => {
    return (
        <div className="feature-page">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1>🏛️ UNIVEN Administrative Services</h1>
            <p className="feature-subtitle">Access key administrative portals and student services</p>
            <div className="feature-card-content">
                <ul className="info-list">
                    {adminLinks.map((link) => (
                        <li key={link.url} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                            <div>
                                <strong>{link.label}</strong>
                                <p style={{ fontSize: 13, color: '#777', margin: '2px 0 0' }}>{link.description}</p>
                            </div>
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary"
                                style={{ padding: '6px 14px', fontSize: 13 }}
                            >
                                Open →
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="contact-info" style={{ marginTop: 24 }}>
                    <h3>Registrar's Office</h3>
                    <p>Phone: <strong>015 962 8000</strong></p>
                    <p>Email: <strong>registrar@univen.ac.za</strong></p>
                    <p>Location: <strong>Administration Building</strong></p>
                    <p>Hours: <strong>Mon – Fri, 08:00 – 16:30</strong></p>
                </div>
            </div>
        </div>
    );
};

export default UNIVENAdmin;
