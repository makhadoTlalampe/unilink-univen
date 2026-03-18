import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const features = [
    { title: 'Academic Programs', path: '/academic-programs', icon: '🎓', description: 'Browse available degree programs' },
    { title: 'Apply for Admission', path: '/apply-for-admission', icon: '📝', description: 'Submit your application to UNIVEN' },
    { title: 'Moodle Login', path: '/moodle-login', icon: '📚', description: 'Access your online courses' },
    { title: 'Past Question Papers', path: '/past-question-papers', icon: '📄', description: 'Download past exam papers' },
    { title: 'Library Booking', path: '/library-booking', icon: '📖', description: 'Reserve a library study space' },
    { title: 'Clinic Booking', path: '/clinic-booking', icon: '🏥', description: 'Book a campus clinic appointment' },
    { title: 'Ambulance', path: '/ambulance', icon: '🚑', description: 'Request emergency ambulance service' },
    { title: 'Student Counselling', path: '/student-counselling', icon: '💬', description: 'Book a counselling session' },
    { title: 'Fundi', path: '/fundi', icon: '💰', description: 'Manage your student funding' },
    { title: 'Google Scholar', path: '/google-scholar', icon: '🔍', description: 'Search academic publications' },
    { title: 'Grammarly Access', path: '/grammarly-access', icon: '✍️', description: 'Access free Grammarly Premium' },
    { title: 'Microsoft Reset', path: '/microsoft-reset', icon: '🔑', description: 'Reset your Microsoft 365 password' },
    { title: 'My Access', path: '/my-access', icon: '🔒', description: 'Manage your campus access card' },
    { title: 'ICT Contact', path: '/ict-contact', icon: '💻', description: 'Contact the ICT helpdesk' },
    { title: 'UNIVEN Admin', path: '/univen-admin', icon: '🏛️', description: 'Access administrative services' },
];

const Home = () => {
    const { currentUser, handleSignOut } = useAuth();

    return (
        <div className="home-container">
            <header className="home-header">
                <div className="home-header-content">
                    <div className="home-brand">
                        <h1>UniLink UNIVEN</h1>
                        <p>Your Student Hub</p>
                    </div>
                    <div className="home-user-area">
                        {currentUser ? (
                            <>
                                <span className="home-user-name">
                                    {currentUser.displayName || currentUser.email}
                                </span>
                                <button onClick={handleSignOut} className="home-signout-btn">
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="home-signin-btn">Sign In</Link>
                        )}
                    </div>
                </div>
            </header>
            <main className="home-main">
                <h2 className="home-section-title">Services &amp; Resources</h2>
                <div className="features-grid">
                    {features.map((feature) => (
                        <Link to={feature.path} key={feature.path} className="feature-card">
                            <span className="feature-icon">{feature.icon}</span>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </Link>
                    ))}
                </div>
            </main>
            <footer className="home-footer">
                <p>&copy; 2026 UNIVEN UniLink. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
