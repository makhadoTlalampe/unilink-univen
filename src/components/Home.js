import React from 'react';
import { Link } from 'react-router-dom';

const features = [
    { label: 'Feature 1', route: null },
    { label: 'Feature 2', route: null },
    { label: 'Feature 3', route: null },
    { label: 'Feature 4', route: null },
    { label: 'Feature 5', route: null },
    { label: 'Feature 6', route: null },
    { label: 'Feature 7', route: null },
    { label: 'Feature 8', route: null },
    { label: 'Feature 9', route: null },
    { label: 'Feature 10', route: null },
    { label: 'Feature 11', route: null },
    { label: 'Feature 12', route: null },
    { label: 'Feature 13', route: null },
    { label: 'Feature 14', route: null },
    { label: 'Feature 15', route: null },
    { label: 'AI Content Scanner', route: '/text-scanner' },
];

const Home = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {features.map((feature, index) => (
                <div key={index} style={{ border: '1px solid #ddd', padding: '20px', textAlign: 'center' }}>
                    {feature.route ? (
                        <Link to={feature.route} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h3>{feature.label}</h3>
                        </Link>
                    ) : (
                        <h3>{feature.label}</h3>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Home;