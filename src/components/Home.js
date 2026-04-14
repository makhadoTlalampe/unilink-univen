import React from 'react';
import { Link } from 'react-router-dom';

const features = [
    'Feature 1',
    'Feature 2',
    'Feature 3',
    'Feature 4',
    'Feature 5',
    'Feature 6',
    'Feature 7',
    'Feature 8',
    'Feature 9',
    'Feature 10',
    'Feature 11',
    'Feature 12',
    'Feature 13',
    'Feature 14',
    'Feature 15'
];

const Home = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {features.map((feature, index) => (
                <div key={index} style={{ border: '1px solid #ddd', padding: '20px', textAlign: 'center' }}>
                    <h3>{feature}</h3>
                </div>
            ))}
            <Link
                to="/text-scanner"
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                <div
                    style={{
                        border: '1px solid #764ba2',
                        padding: '20px',
                        textAlign: 'center',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #f5f3ff 0%, #ede7f6 100%)',
                        cursor: 'pointer',
                    }}
                >
                    <h3 style={{ color: '#764ba2', margin: 0 }}>🔍 AI Content Scanner</h3>
                    <p style={{ color: '#555', fontSize: '0.85rem', marginTop: '8px' }}>
                        Scan pasted text for AI-generated content
                    </p>
                </div>
            </Link>
        </div>
    );
};

export default Home;