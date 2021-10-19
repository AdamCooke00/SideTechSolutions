import React, {useRef, useState} from 'react';
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import {useAuth} from "../context/AuthContext"
import Link from 'next/link'

export default function ForgotPassword() {
    const emailRef = useRef()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false) //so user doesnt spam password reset.
    const {resetPassword} = useAuth();

    async function handleReset(e){
        e.preventDefault()
        setError('')
        setLoading(true)
        await resetPassword(emailRef.current.value).then(() => {
            setError(`An email has been sent to ${emailRef.current.value}`)
          }).catch(error => {
            setError(error.message);
            if(error.code == "auth/user-not-found"){
                setError("There is no user corresponding to the identifier. Please Try Again. If you believe this is a mistake, please email: landlord@studenthousinghub.ca")
              }
            setLoading(false);
          });
    }


  return (
      <div className="loginpage">
        <Navbar/>
        <div className="loginportion">
            <div className="loginbox">
                <h2 className='formtitle'>Password Reset</h2>
                {error && <p>{error}</p>}
                <form onSubmit={handleReset}>
                    <div className="formline">
                        <label className="formlabel">Email</label>
                        <input className="forminput" type="email" ref={emailRef} required/>
                    </div>
                    <button className="signinbtn" disabled={loading} type="submit">Reset Password</button>
                </form>
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
