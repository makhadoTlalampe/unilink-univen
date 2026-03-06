import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const { handleSignInWithGoogle, handleSignInWithMicrosoft } = useAuth();

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>UniLink UNIVEN</h1>
                <p>Welcome to your Student Hub</p>
                <button onClick={handleSignInWithGoogle} className="btn btn-google">
                    <img src="https://www.gstatic.com/images/branding/product/1x/googleg_standard_color_92dp.png" alt="Google" />
                    Sign in with Google
                </button>
                <button onClick={handleSignInWithMicrosoft} className="btn btn-microsoft">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1200px-Microsoft_logo_%282012%29.svg.png" alt="Microsoft" />
                    Sign in with Microsoft
                </button>
            </div>
        </div>
    );
};

export default Login;