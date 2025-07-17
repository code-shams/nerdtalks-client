import React from "react";
import { AuthContext } from "./AuthContext";
import { useState } from "react";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase/firebase.config";
import { useEffect } from "react";

const AuthProvider = ({ children }) => {
    //? user state to be used across the project
    const [user, setUser] = useState(null);

    //? create a loading state to handle user = null;
    const [loading, setLoading] = useState(true);

    //? register function from firebase
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    //? sign in using google function from firebase
    const provider = new GoogleAuthProvider();
    const googleSignIn = () => {
        return signInWithPopup(auth, provider);
    };

    //? login function from firebase
    const loginUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    //?signOut function from firebase
    const logoutUser = () => {
        setLoading(true);
        return signOut(auth);
    };

    //? update user name and pic
    const updateUser = (name, pic) => {
        setLoading(true);
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: pic,
        });
    };

    //? update user name and pic
    const forgetPassword = (email) => {
        setLoading(true);
        return sendPasswordResetEmail(auth, email);
    };

    //? observe the auth from firebase and update user state accordingly
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => {
            unSubscribe();
        };
    }, []);

    //? context value
    const value = {
        user,
        createUser,
        loginUser,
        logoutUser,
        updateUser,
        loading,
        setLoading,
        googleSignIn,
        forgetPassword,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
