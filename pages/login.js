import React, {useRef, useState, useEffect} from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {useAuth} from "../context/AuthContext"
import Link from 'next/link'
import { useRouter } from "next/router"

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const {currentUser, login, googleLogin} = useAuth()
  const [error, setError] = useState('')
  const [pageLoading, setPageLoading] = useState(true)
  const [signInWithEmailToggle, setSignInWithEmailToggle] = useState(false)
  const [loading, setLoading] = useState(false) //so user doesnt spam login shouldnt be needed but nonetheless
  const router = useRouter()

  function handleSubmit(e){
      e.preventDefault()
      setError('')
      setLoading(true)
      login(emailRef.current.value, passwordRef.current.value).then((userCredential) => {
          // Signed in 
          var user = userCredential.user;
          router.push('/my-account')
          // ...
        }).catch((error) => {
          console.log(error)
          if(error.code == "auth/user-not-found"){
            setError("Unable to Login. There is no user corresponding to the identifier. Please Try Again. If you believe this is a mistake, please email: landlord@studenthousinghub.ca")
          }
          else if(error.code == "auth/wrong-password"){
            setError("Password Invalid. Please Try Again. If you believe this is a mistake, please email: landlord@studenthousinghub.ca")
          }
          else if(error.code == "auth/too-many-requests"){
            setError("Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.")
          }
          else {
            setError("Unable to process request. Please try again later.")
          }
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
      console.log(result)
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
                <h2 className="formtitle">Sign In</h2>
                {error && <p>{error}</p>}

                <div className="justifyContentCenter">
                  <img onClick={handleGoogleLogin} alt="Sign In With Google" src="/googlebtn.png"/>
                  {!signInWithEmailToggle && <button className="signInWithEmailBtn" onClick={() => setSignInWithEmailToggle(true)}>Sign in with Email</button>}
                </div>

                {signInWithEmailToggle && <form onSubmit={handleSubmit}>
                    <div className="formline">
                        <label className="formlabel">Email</label>
                        <input className="forminput" type="email" ref={emailRef} required/>
                    </div>
                    <div className="formline">
                        <label className="formlabel">Password</label>
                        <input className="forminput" type="password" ref={passwordRef} required/>
                    </div>
                    <button disabled={loading} className="signinbtn" type="submit">Login</button>
                </form>}
                <div className="bottomlinks">
                    <Link href="/signup">
                        <a>Sign up</a>
                    </Link>
                    <Link href="/forgot-password">
                        <a>Forgot Password?</a>
                    </Link>
                </div>
            </div>
      </div>
        
        <Footer/>
    </div>
  )
}
