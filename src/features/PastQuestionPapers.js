import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Feature.css';

const papers = [
    { id: 1, subject: 'Computer Science 101', year: 2023, semester: 1 },
    { id: 2, subject: 'Computer Science 101', year: 2022, semester: 1 },
    { id: 3, subject: 'Mathematics 101', year: 2023, semester: 1 },
    { id: 4, subject: 'Mathematics 101', year: 2023, semester: 2 },
    { id: 5, subject: 'Business Administration 201', year: 2023, semester: 1 },
    { id: 6, subject: 'Psychology 101', year: 2022, semester: 2 },
    { id: 7, subject: 'English Language & Communication', year: 2023, semester: 1 },
    { id: 8, subject: 'Accounting 101', year: 2023, semester: 2 },
];

const PastQuestionPapers = () => {
    const [search, setSearch] = useState('');

    const filtered = papers.filter((p) =>
        p.subject.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="feature-page">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1>📄 Past Question Papers</h1>
            <p className="feature-subtitle">Browse and download past examination papers</p>
            <div className="feature-card-content">
                <div className="feature-form" style={{ marginBottom: 20 }}>
                    <label htmlFor="search">Search by Subject</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="e.g. Computer Science"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {filtered.length === 0 ? (
                    <p style={{ color: '#777' }}>No papers found for "{search}".</p>
                ) : (
                    <ul className="info-list">
                        {filtered.map((paper) => (
                            <li key={paper.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>
                                    <strong>{paper.subject}</strong> — {paper.year}, Semester {paper.semester}
                                </span>
                                <span style={{ fontSize: 13, color: '#aaa', fontStyle: 'italic' }}>
                                    Coming soon
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
                <div className="info-box" style={{ marginTop: 20 }}>
                    More papers are available on the{' '}
                    <a href="https://library.univen.ac.za" target="_blank" rel="noopener noreferrer">
                        UNIVEN Library portal
                    </a>.
                </div>
            </div>
        </div>
    );
};

export default PastQuestionPapers;
