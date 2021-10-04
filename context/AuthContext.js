import React, {useContext, useEffect, useState} from 'react';
import firebase from "../config/firebase-config"

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true); //due to the user being null on load until useEffect is run

    function signup(email, password){
        return firebase.auth().createUserWithEmailAndPassword(email, password)
    }

    function login(email, password){
        return firebase.auth().signInWithEmailAndPassword(email, password)
    }

    function logout() {
        return firebase.auth().signOut()
    }

    function resetPassword(email) {
        return firebase.auth().sendPasswordResetEmail(email)
    }

    useEffect(() => {
        console.log("in useEffect within auth provider")
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            console.log("in AuthStateChanged")
            console.log(user)
            setCurrentUser(user)
            setLoading(false)
            console.log("No longer loading")
        });
        return unsubscribe
    }, [])
    

    const value = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

