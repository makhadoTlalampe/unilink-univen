import React, { createContext, useContext, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleSignInWithGoogle = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        await firebase.auth().signInWithPopup(provider);
    };

    const handleSignInWithMicrosoft = async () => {
        const provider = new firebase.auth.OAuthProvider('microsoft.com');
        await firebase.auth().signInWithPopup(provider);
    };

    const handleSignOut = async () => {
        await firebase.auth().signOut();
    };

    firebase.auth().onAuthStateChanged((user) => {
        setCurrentUser(user);
        setLoading(false);
    });

    return (
        <AuthContext.Provider value={{ currentUser, handleSignInWithGoogle, handleSignInWithMicrosoft, handleSignOut }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};