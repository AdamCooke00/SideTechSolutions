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
    const {currentUser, signup} = useAuth()
    const [error, setError] = useState('')
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
        signup(emailRef.current.value, passwordRef.current.value).then((res) => {
            // Signed in 
            res.user.sendEmailVerification({
            url: "https://studenthousinghub.ca/my-account",
            })
            router.push('/my-account')
            // ...
          }).catch((error) => {
            setError(error.message);
          });
        setLoading(false)
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
                {error && <p>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="formline">
                        <label className="formlabel">Email</label>
                        <input className="forminput" type="email" ref={emailRef} required/>
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
                </form>
                <p>Already have an account?</p>
                <div className="bottomsololink"> 
                    <Link href="/login">
                        <a>Login</a>
                    </Link>
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}
