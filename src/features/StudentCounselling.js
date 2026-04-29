import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Feature.css';

const StudentCounselling = () => {
    const [form, setForm] = useState({ name: '', studentNumber: '', email: '', concern: '', date: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="feature-page">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1>💬 Student Counselling</h1>
            <p className="feature-subtitle">Book a confidential counselling session at UNIVEN</p>
            <div className="feature-card-content">
                <div className="emergency-warning">
                    <strong>🆘 In a mental health crisis? Call SADAG: 0800 21 22 23 (free, 24/7).</strong>
                </div>
                {submitted ? (
                    <div className="status-message success">
                        ✅ Your counselling session request has been received. A counsellor will contact you at {form.email} to confirm your appointment.
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
                        <label htmlFor="date">Preferred Appointment Date</label>
                        <input
                            id="date"
                            name="date"
                            type="date"
                            min={today}
                            value={form.date}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="concern">Briefly Describe Your Concern (optional)</label>
                        <textarea
                            id="concern"
                            name="concern"
                            placeholder="Your response is confidential..."
                            value={form.concern}
                            onChange={handleChange}
                        />
                        <button type="submit" className="btn-primary">Book Session</button>
                    </form>
                )}
                <div className="contact-info">
                    <h3>Student Counselling Centre</h3>
                    <p>Phone: <strong>015 962 8126</strong></p>
                    <p>Location: <strong>Student Services Building</strong></p>
                    <p>Hours: <strong>Mon – Fri, 08:00 – 16:30</strong></p>
                    <p style={{ marginTop: 8, fontSize: 13, color: '#888' }}>All sessions are strictly confidential.</p>
                </div>
            </div>
        </div>
    );
};

export default StudentCounselling;
