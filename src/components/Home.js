import React from 'react';

const features = [
    { label: 'Academic Programs', path: '/academic-programs' },
    { label: 'Ambulance', path: '/ambulance' },
    { label: 'Apply for Admission', path: '/apply-for-admission' },
    { label: 'Clinic Booking', path: '/clinic-booking' },
    { label: 'Fundi', path: '/fundi' },
    { label: 'Google Scholar', path: '/google-scholar' },
    { label: 'Grammarly Access', path: '/grammarly-access' },
    { label: 'ICT Contact', path: '/ict-contact' },
    { label: 'Library Booking', path: '/library-booking' },
    { label: 'Microsoft Reset', path: '/microsoft-reset' },
    { label: 'Moodle Login', path: '/moodle-login' },
    { label: 'My Access', path: '/my-access' },
    { label: 'Past Question Papers', path: '/past-question-papers' },
    { label: 'Student Counselling', path: '/student-counselling' },
    { label: '📝 Text Analyzer', path: '/text-analyzer' },
    { label: 'UNIVEN Admin', path: '/univen-admin' },
];

const Home = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {features.map((feature, index) => (
                <a
                    key={index}
                    href={feature.path}
                    style={{
                        border: '1px solid #ddd',
                        padding: '20px',
                        textAlign: 'center',
                        textDecoration: 'none',
                        color: 'inherit',
                        borderRadius: '8px',
                        display: 'block',
                    }}
                >
                    <h3>{feature.label}</h3>
                </a>
            ))}
        </div>
    );
};

export default Home;