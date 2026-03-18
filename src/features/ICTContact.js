import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Feature.css';

const ICTContact = () => {
    const [form, setForm] = useState({ name: '', studentNumber: '', email: '', issue: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="feature-page">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1>💻 ICT Helpdesk</h1>
            <p className="feature-subtitle">Contact the ICT department for technical support</p>
            <div className="feature-card-content">
                <div className="contact-info" style={{ marginBottom: 24 }}>
                    <h3>Contact Details</h3>
                    <p>Email: <strong>ict@univen.ac.za</strong></p>
                    <p>Phone: <strong>015 962 8500</strong></p>
                    <p>Location: <strong>Administration Building, Room 002</strong></p>
                    <p>Hours: <strong>Mon – Fri, 07:30 – 16:30</strong></p>
                </div>
                {submitted ? (
                    <div className="status-message success">
                        ✅ Your support request has been submitted. The ICT team will respond to {form.email} within 24 hours.
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="feature-form">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="e.g. Thabo Sithole"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="studentNumber">Student Number</label>
                        <input
                            id="studentNumber"
                            name="studentNumber"
                            type="text"
                            placeholder="e.g. u21234567"
                            value={form.studentNumber}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="e.g. thabo@univen.ac.za"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="issue">Describe Your Issue</label>
                        <textarea
                            id="issue"
                            name="issue"
                            placeholder="Describe your technical issue in detail..."
                            value={form.issue}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit" className="btn-primary">Submit Request</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ICTContact;
