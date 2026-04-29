import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Feature.css';

const GoogleScholar = () => {
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            const url = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="feature-page">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1>🔍 Google Scholar</h1>
            <p className="feature-subtitle">Search academic publications, journals, and theses</p>
            <div className="feature-card-content">
                <form onSubmit={handleSearch} className="feature-form">
                    <label htmlFor="query">Search Academic Literature</label>
                    <input
                        id="query"
                        type="text"
                        placeholder="e.g. machine learning in education"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-primary">Search on Google Scholar</button>
                </form>
                <a
                    href="https://scholar.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link"
                    style={{ marginTop: 12 }}
                >
                    Open Google Scholar →
                </a>
                <div className="info-box">
                    Google Scholar provides access to academic articles, citations, and full-text papers.
                    Use your UNIVEN institutional login to access full-text articles where available.
                </div>
            </div>
        </div>
    );
};

export default GoogleScholar;
