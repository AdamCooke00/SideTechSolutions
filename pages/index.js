import Head from 'next/head'
import ListingCard from "../components/ListingCard"
import fire from '../config/firebase-config';
import { useState, useEffect } from 'react';
import Link from "next/link"
import {useAuth} from "../context/AuthContext"
import { Button, Alert, CardGroup } from 'react-bootstrap';

export default function Home() {
  const [listings, setListings] = useState([]);
  const {currentUser, logout} = useAuth()
  const [error, setError] = useState('')

  function handleLogout(e){
    e.preventDefault()
    setError('')
    logout().then(() => {
      setError("Logout Successful");
    }).catch((error) => {
      setError(error);
    });
  }

  useEffect(() => {
    fire.firestore()
      .collection('listing')
      .onSnapshot(snap => {
        const allListings = snap.docs.map(listing => ({
          id: listing.id,
          ...listing.data()
        }));
        setListings(allListings);
      });
  }, []);

  return (
    <div>
      <Head>
        <title>Student Housing Hub</title>
      </Head>

      {currentUser && (
        <>
          <h5>{currentUser.email}</h5>
          <Link href="/new-listing">
            <a>Add a listing</a>
          </Link>
          <Button onClick={handleLogout}>Logout</Button>
        </>
      )}

      {!currentUser && (
        <>
          <Link href="/signup">
            <a>Sign Up</a>
          </Link>
          <Link href="/login">
            <a>Login</a>
          </Link>
        </>
      )}

      {error && <Alert variant="success">{error}</Alert>}

      <h1>Housing Hub</h1>
      <br/>
      
      {/* {currentUser && <CreatePost/> } */}
      <CardGroup>
        {listings.map(listing => 
          <ListingCard key={listing.id} id={listing.id} price={listing.price} address={listing.address} bedrooms={listing.bedroomCount}/>
        )}
      </CardGroup>
    </div>
  )
}
