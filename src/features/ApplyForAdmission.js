import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Feature.css';

const ApplyForAdmission = () => {
    const [form, setForm] = useState({ name: '', email: '', program: '', year: '' });
    const [submitted, setSubmitted] = useState(false);

    const programs = [
        'Bachelor of Science in Computer Science',
        'Bachelor of Arts in Psychology',
        'Bachelor of Commerce in Business Administration',
        'Bachelor of Education',
        'Bachelor of Science in Mathematics',
        'Bachelor of Social Work',
        'Bachelor of Laws (LLB)',
        'Bachelor of Nursing Science',
    ];

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
            <h1>📝 Apply for Admission</h1>
            <p className="feature-subtitle">Submit your application to the University of Venda</p>
            <div className="feature-card-content">
                {submitted ? (
                    <div className="status-message success">
                        ✅ Your application has been submitted successfully! We will contact you at {form.email} within 5–7 working days.
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
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="e.g. thabo@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                        <label htmlFor="program">Program of Interest</label>
                        <select id="program" name="program" value={form.program} onChange={handleChange} required>
                            <option value="">-- Select a Program --</option>
                            {programs.map((prog) => (
                                <option key={prog} value={prog}>{prog}</option>
                            ))}
                        </select>
                        <label htmlFor="year">Year of Study</label>
                        <select id="year" name="year" value={form.year} onChange={handleChange} required>
                            <option value="">-- Select Year --</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                        <button type="submit" className="btn-primary">Submit Application</button>
                    </form>
                )}
                <div className="info-box">
                    For more information, visit the{' '}
                    <a href="https://www.univen.ac.za/admissions" target="_blank" rel="noopener noreferrer">
                        UNIVEN Admissions page
                    </a>.
                </div>
            </div>
        </div>
    );
};

export default ApplyForAdmission;
