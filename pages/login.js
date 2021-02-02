import React, {useRef, useState} from 'react';
import {Form, Button, Card, Container, Alert} from "react-bootstrap"
import {useAuth} from "../context/AuthContext"
import Link from 'next/link'
import { useRouter } from "next/router"

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const {login} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false) //so user doesnt spam login shouldnt be needed but nonetheless
    const router = useRouter()

    function handleSubmit(e){
        e.preventDefault()
        setError('')
        setLoading(true)
        login(emailRef.current.value, passwordRef.current.value).then((userCredential) => {
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
                <h2 className="text-center mb-4">Login</h2>
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
                    <Button disabled={loading} className="w-100" type="submit">Login</Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            Don't have an account?
            <Link href="/signup">
                <a>Sign up</a>
            </Link>
            <Link href="/forgot-password">
                <a>Forgot Password?</a>
            </Link>
        </div>
        </Container>
    </>
  )
}
