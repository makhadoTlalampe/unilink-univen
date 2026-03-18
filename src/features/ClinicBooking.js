import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Feature.css';

const ClinicBooking = () => {
    const [form, setForm] = useState({ name: '', studentNumber: '', date: '', time: '', reason: '' });
    const [submitted, setSubmitted] = useState(false);

    const timeSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '14:00', '14:30', '15:00', '15:30', '16:00'];

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
            <h1>🏥 Clinic Booking</h1>
            <p className="feature-subtitle">Book an appointment at the UNIVEN campus clinic</p>
            <div className="feature-card-content">
                {submitted ? (
                    <div className="status-message success">
                        ✅ Your appointment has been booked for {form.date} at {form.time}. Please arrive 10 minutes early.
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
                        <label htmlFor="date">Preferred Date</label>
                        <input
                            id="date"
                            name="date"
                            type="date"
                            min={today}
                            value={form.date}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="time">Preferred Time</label>
                        <select id="time" name="time" value={form.time} onChange={handleChange} required>
                            <option value="">-- Select Time --</option>
                            {timeSlots.map((slot) => (
                                <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>
                        <label htmlFor="reason">Reason for Visit</label>
                        <textarea
                            id="reason"
                            name="reason"
                            placeholder="Briefly describe your reason for visiting..."
                            value={form.reason}
                            onChange={handleChange}
                            required
                        />
                        <button type="submit" className="btn-primary">Book Appointment</button>
                    </form>
                )}
                <div className="contact-info">
                    <h3>Campus Clinic</h3>
                    <p>Phone: <strong>015 962 8152</strong></p>
                    <p>Location: <strong>Student Services Building</strong></p>
                    <p>Hours: <strong>Mon – Fri, 08:00 – 16:30</strong></p>
                </div>
            </div>
        </div>
    );
};

export default ClinicBooking;
