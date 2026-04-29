import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Feature.css';

const LibraryBooking = () => {
    const [form, setForm] = useState({ name: '', studentNumber: '', date: '', space: '' });
    const [submitted, setSubmitted] = useState(false);

    const spaces = [
        'Individual Study Desk',
        'Group Study Room (4 people)',
        'Group Study Room (8 people)',
        'Computer Lab',
        'Quiet Reading Area',
    ];

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
            <h1>📖 Library Booking</h1>
            <p className="feature-subtitle">Reserve a study space at the UNIVEN library</p>
            <div className="feature-card-content">
                {submitted ? (
                    <div className="status-message success">
                        ✅ Your study space has been booked for {form.date}. Please bring your student card.
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
                        <label htmlFor="date">Date</label>
                        <input
                            id="date"
                            name="date"
                            type="date"
                            min={today}
                            value={form.date}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="space">Study Space</label>
                        <select id="space" name="space" value={form.space} onChange={handleChange} required>
                            <option value="">-- Select a Space --</option>
                            {spaces.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <button type="submit" className="btn-primary">Book Space</button>
                    </form>
                )}
                <div className="contact-info">
                    <h3>Library Information</h3>
                    <p>Phone: <strong>015 962 8260</strong></p>
                    <p>Hours: <strong>Mon – Fri, 07:30 – 21:00 | Sat, 08:00 – 16:00</strong></p>
                </div>
            </div>
        </div>
    );
};

export default LibraryBooking;
