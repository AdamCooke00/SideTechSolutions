import React, {useRef, useState} from 'react';
import {Form, Button, Card, Container, Alert} from "react-bootstrap"
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
            var errorCode = error.code;
            setError(error.message);
            setLoading(false);
          });
    }

  return (
      <>
        <Link href="/">
            <a>Home</a>
        </Link>
        <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
        <Card className="w-100" style={{maxWidth: "400px"}}>
            <Card.Body>
                <h2 className="text-center mb-4">Password Reset</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleReset}>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required/>
                    </Form.Group>
                    <Button disabled={loading} className="w-100" type="submit">Reset Password</Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            <Link href="/login">
                <a>Login</a>
            </Link>
        </div>
        </Container>
    </>
  )
}
