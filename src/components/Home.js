import React from 'react';

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
        </div>
    );
};

export default Home;