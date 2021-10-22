import React, {useRef, useState, useEffect} from 'react';
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import {useAuth} from "../context/AuthContext"
import Link from 'next/link'
import { useRouter } from "next/router"

export default function SignUp() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const confirmpasswordRef = useRef()
    const {currentUser, signup, googleLogin} = useAuth()
    const [error, setError] = useState('')
    const [formDisplayName, setFormDisplayName] = useState('')
    const [usingForm, setUsingForm] = useState(true)
    const [pageLoading, setPageLoading] = useState(true)
    const [loading, setLoading] = useState(false) //so user doesnt spam signup and make multiple accounts. shouldnt be needed cuz of email restriction anyway but nonetheless
    const router = useRouter()

    function handleSubmit(e){
        e.preventDefault()
        if(passwordRef.current.value !== confirmpasswordRef.current.value){
            return setError('Passwords do not match')
        }
        setError('')
        setLoading(true)
        signup(emailRef.current.value, passwordRef.current.value).then(async (res) => {
            // Signed in 
            await res.user.updateProfile({
                displayName: formDisplayName,
            })
            await res.user.sendEmailVerification({
            url: "https://studenthousinghub.ca/my-account",
            })
            setUsingForm(false)
            // ...
          }).catch((error) => {
            setError(error.message);
          });
        setLoading(false)
    }

    function handleGoogleLogin(){
        googleLogin()
        .then((result) => {
          /** @type {firebase.auth.OAuthCredential} */
          var credential = result.credential;
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = credential.accessToken;
          // The signed-in user info.
          var user = result.user;
          router.push('/my-account')
          // ...
        }).catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
      }

    useEffect(async () => {
        currentUser ? router.push("/my-account") : setPageLoading(false);
      }, []);
    
      if(pageLoading){
        return <p>Loading Page...</p>
    }

  return (
      <div className="loginpage">
        <Navbar/>
        <div className="loginportion">
            <div className="loginbox">
                <p>Please <strong>only create an account if you are a Landlord</strong>. We will be adding student accounts in the future.</p>
                <h2 className="formtitle">Create Account</h2>
                {usingForm && <div className="justifyContentCenter">
                  <img onClick={handleGoogleLogin} alt="Sign In With Google" src="/googlebtn.png"/>
                </div>}
                {error && <p>{error}</p>}
                {!usingForm && <p className="confirmationSent">A confirmation email has been sent to<br/>{emailRef.current.value || "Your Email"}<br/>Please check your email to add a listing. It may take up to 3 minutes to receive the email.</p>}
                {usingForm && <form onSubmit={handleSubmit}>
                    <div className="formline">
                        <label className="formlabel">Email</label>
                        <input className="forminput" type="email" ref={emailRef} required/>
                    </div>

                    <div className="formline">
                        <label className="formlabel">Display Name</label>
                        <input className="forminput" type="text" onChange={(e) => setFormDisplayName(e.target.value)} value={formDisplayName} placeholder="Company / Realtor" required/>
                    </div>
                    
                    <div className="formline">
                        <label className="formlabel">Password</label>
                        <input className="forminput" type="password" ref={passwordRef} required/>
                    </div>
                    
                    <div className="formline">
                        <label className="formlabel">Confirm Password</label>
                        <input className="forminput" type="password" ref={confirmpasswordRef} required/>
                    </div>

                    <div className="landlordconfirm">
                        <input className="checkbox" type="checkbox" required/>
                        <label className="landordconfirmlabel">I confirm I am a Landlord</label>
                    </div>
                    <button className="signinbtn" disabled={loading} type="submit">Sign Up</button>
                </form>}
                {usingForm && <p>Already have an account?</p>}
                {usingForm && <div className="bottomsololink"> 
                    <Link href="/login">
                        <a>Login</a>
                    </Link>
                </div> }
            </div>
        </div>
        <Footer/>
    </div>
  )
}
