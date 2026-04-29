import React from 'react';
import { Link } from 'react-router-dom';
import './Feature.css';

const AcademicPrograms = () => {
    const programs = [
        { id: 1, faculty: 'Science, Engineering & Agriculture', name: 'Bachelor of Science in Computer Science' },
        { id: 2, faculty: 'Science, Engineering & Agriculture', name: 'Bachelor of Science in Mathematics' },
        { id: 3, faculty: 'Science, Engineering & Agriculture', name: 'Bachelor of Science in Agriculture' },
        { id: 4, faculty: 'Humanities, Social Sciences & Education', name: 'Bachelor of Arts in Psychology' },
        { id: 5, faculty: 'Humanities, Social Sciences & Education', name: 'Bachelor of Education' },
        { id: 6, faculty: 'Humanities, Social Sciences & Education', name: 'Bachelor of Social Work' },
        { id: 7, faculty: 'Management, Commerce & Law', name: 'Bachelor of Commerce in Business Administration' },
        { id: 8, faculty: 'Management, Commerce & Law', name: 'Bachelor of Laws (LLB)' },
        { id: 9, faculty: 'Management, Commerce & Law', name: 'Bachelor of Commerce in Accounting' },
        { id: 10, faculty: 'Health Sciences', name: 'Bachelor of Nursing Science' },
        { id: 11, faculty: 'Health Sciences', name: 'Bachelor of Environmental Health' },
    ];

    const faculties = [...new Set(programs.map((p) => p.faculty))];

    return (
        <div className="feature-page">
            <Link to="/" className="back-link">← Back to Home</Link>
            <h1>🎓 Academic Programs</h1>
            <p className="feature-subtitle">Browse degree programs offered at the University of Venda</p>
            <div className="feature-card-content">
                {faculties.map((faculty) => (
                    <div key={faculty} style={{ marginBottom: 24 }}>
                        <h3 style={{ color: '#1a3a5c', fontSize: 16, marginBottom: 10 }}>{faculty}</h3>
                        <ul className="info-list">
                            {programs.filter((p) => p.faculty === faculty).map((program) => (
                                <li key={program.id}>{program.name}</li>
                            ))}
                        </ul>
                    </div>
                ))}
                <div className="info-box">
                    For full program details and postgraduate offerings, visit the{' '}
                    <a href="https://www.univen.ac.za/programmes" target="_blank" rel="noopener noreferrer">
                        UNIVEN Programmes page
                    </a>.
                </div>
            </div>
        </div>
    );
};

export default AcademicPrograms;