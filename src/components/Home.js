import React from 'react';

const features = [
    { label: '✍️ Text Humanizer', path: '/text-humanizer', description: 'Transform formal or AI-generated text into natural, conversational writing.' },
    { label: '🔍 Text Scanner', path: '/text-scanner', description: 'Paste text to detect AI-generation indicators and originality signals.' },
    { label: 'Feature 3', path: null, description: '' },
    { label: 'Feature 4', path: null, description: '' },
    { label: 'Feature 5', path: null, description: '' },
    { label: 'Feature 6', path: null, description: '' },
    { label: 'Feature 7', path: null, description: '' },
    { label: 'Feature 8', path: null, description: '' },
    { label: 'Feature 9', path: null, description: '' },
    { label: 'Feature 10', path: null, description: '' },
    { label: 'Feature 11', path: null, description: '' },
    { label: 'Feature 12', path: null, description: '' },
    { label: 'Feature 13', path: null, description: '' },
    { label: 'Feature 14', path: null, description: '' },
    { label: 'Feature 15', path: null, description: '' },
];

const Home = () => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {features.map((feature, index) => (
                <div key={index} style={{ border: '1px solid #ddd', padding: '20px', textAlign: 'center' }}>
                    {feature.path ? (
                        <a href={feature.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <h3 style={{ color: '#667eea' }}>{feature.label}</h3>
                            {feature.description && (
                                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '6px' }}>
                                    {feature.description}
                                </p>
                            )}
                        </a>
                    ) : (
                        <h3>{feature.label}</h3>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Home;