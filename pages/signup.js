import React, {useRef, useState} from 'react';
import {Form, Button, Card, Container, Alert} from "react-bootstrap"
import {useAuth} from "../context/AuthContext"
import Link from 'next/link'
import { useRouter } from "next/router"

export default function SignUp() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const confirmpasswordRef = useRef()
    const {signup} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false) //so user doesnt spam signup and make multiple accounts. shouldnt be needed cuz of email restriction anyway but nonetheless
    const router = useRouter()

    function handleSubmit(e){
        e.preventDefault()
        if(passwordRef.current.value !== confirmpasswordRef.current.value){
            return setError('Passwords do not match')
        }
        setError('')
        setLoading(true)
        signup(emailRef.current.value, passwordRef.current.value).then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            router.push('/')
            // ...
          }).catch((error) => {
            var errorCode = error.code;
            setError(error.message);
            // ..
          });
        setLoading(false)
    }

  return (
      <>
        <Link href="/">
            <a>Home</a>
        </Link>
        <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
            
        <Card className="w-100" style={{maxWidth: "400px"}}>
            <Card.Body>
                <h2 className="text-center mb-4">Sign Up</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required/>
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required/>
                    </Form.Group>
                    <Form.Group id="confirmpassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" ref={confirmpasswordRef} required/>
                    </Form.Group>
                    <Button disabled={loading} className="w-100" type="submit">Sign Up</Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            Already have an account?
            <Link href="/login">
                <a>Login</a>
            </Link>
        </div>
        </Container>
    </>
  )
}
