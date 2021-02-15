import React, {useRef, useState} from 'react';
import {Form, Button, Card, Container, Alert} from "react-bootstrap"
import {useAuth} from "../context/AuthContext"
import Link from 'next/link'
import firebase, {auth} from '../config/firebase-config';
import {useRouter} from "next/router"

export default function NewListing() {
    const addressRef = useRef()
    const bedroomCountRef = useRef()
    const totalPriceRef = useRef()
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false) //so user doesnt spam create listings.
    const {currentUser} = useAuth();

    const handleNewListing = async (event) => {
        event.preventDefault();
        setLoading(true);
        await firebase.firestore()
        .collection('listing')
        .add({
            address: addressRef.current.value,
            bedroomCount: bedroomCountRef.current.value,
            price: totalPriceRef.current.value,
            author_uid: currentUser.uid
        }).then(() => {
            console.log("New Listing Created");
            router.push('/')
        }).catch((e)=> {
            console.log("Unable to create new listing");
            console.error(e);
        })

    
    
        setTimeout(() => {
        }, 4000)
    }

  return (
      <>
        <Container className="d-flex align-items-center justify-content-center" style={{minHeight: "100vh"}}>
        <Card className="w-100" style={{maxWidth: "400px"}}>
            <Card.Body>
                <h2 className="text-center mb-4">Add a new Listing</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleNewListing}>
                    <Form.Group id="address">
                        <Form.Label>House Address</Form.Label>
                        <Form.Control type="text" ref={addressRef} required/>
                    </Form.Group>
                    <Form.Group id="bedroomCount">
                        <Form.Label>No. of Bedrooms</Form.Label>
                        <Form.Control type="number" ref={bedroomCountRef} required/>
                    </Form.Group>
                    <Form.Group id="totalPrice">
                        <Form.Label>Total Price</Form.Label>
                        <Form.Control type="number" ref={totalPriceRef} required/>
                    </Form.Group>
                    <Button disabled={loading} className="w-100" type="submit">Create New Listing</Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            <Link href="/">
                <a>Back to Home</a>
            </Link>
        </div>
        </Container>
    </>
  )
}

// export async function getServerSideProps(context) {
    
// }