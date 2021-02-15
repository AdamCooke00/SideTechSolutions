import Head from 'next/head'
import ListingItem from "../components/ListingItem"
import fire from '../config/firebase-config';
import { useState, useEffect } from 'react';
import Link from "next/link"
import {useAuth} from "../context/AuthContext"
import { Item, Image, Button, Container, Form, Radio, Message} from 'semantic-ui-react';
import {Alert} from "react-bootstrap"

export default function Home() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([])
  const {currentUser, logout} = useAuth()
  const [error, setError] = useState('')
  const [filters, setFilters] = useState([]);
  const [filterMessage, setFilterMessage] = useState();

  function handleLogout(e){
    e.preventDefault()
    setError('')
    logout().then(() => {
      setError("Logout Successful");
    }).catch((error) => {
      setError(error);
    });
  }

  const handleFilters = () => {
    if (filters.bedrooms){
      let filtList = listings.filter(list => list.bedroomCount == filters.bedrooms)
      setFilteredListings(filtList)
      setFilterMessage(`Bedroom filter: ${filters.bedrooms} has been applied`)
    }
  }


  const clearFilters = () => {
    setFilters({})
    setFilteredListings(listings)
    setFilterMessage("Filters have been cleared")
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
        setFilteredListings(allListings);
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
          <Button primary onClick={handleLogout}>Logout</Button>
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
      <Container>

      {filterMessage &&
        <Message
          success
          onDismiss={() => setFilterMessage()}
          header={filterMessage}
        />  
      }
      {//TODO: MAKE THIS FILTER RADIO BUTTONS OR AN INPUT OR SOMETHING
      }
      {/* <Button onClick={() => setFilters({bedrooms: 6})}>Add 6 Bedroom Filter</Button> */}
      <Form>
        <Form.Group inline>
          <label>Bedroom Filter</label>
          <Form.Field
            control={Radio}
            label='1'
            value='1'
            checked={filters.bedrooms === 1}
            onChange={() => setFilters({bedrooms: 1})}
          />
          <Form.Field
            control={Radio}
            label='2'
            value='2'
            checked={filters.bedrooms === 2}
            onChange={() => setFilters({bedrooms: 2})}
          />
          <Form.Field
            control={Radio}
            label='3'
            value='3'
            checked={filters.bedrooms === 3}
            onChange={() => setFilters({bedrooms: 3})}
          />
          <Form.Field
            control={Radio}
            label='4'
            value='4'
            checked={filters.bedrooms === 4}
            onChange={() => setFilters({bedrooms: 4})}
          />
          <Form.Field
            control={Radio}
            label='5'
            value='5'
            checked={filters.bedrooms === 5}
            onChange={() => setFilters({bedrooms: 5})}
          />
          <Form.Field
            control={Radio}
            label='6'
            value='6'
            checked={filters.bedrooms === 6}
            onChange={() => setFilters({bedrooms: 6})}
          />
        </Form.Group>
      </Form>
      <Button onClick={handleFilters}>Apply Filters</Button>
      <Button onClick={clearFilters}>Clear Filters</Button>

      <p>Current Filters: {filters && filters.bedrooms} </p>
      {/* {currentUser && <CreatePost/> } */}
        <Item.Group divided>

          {filteredListings.map(listing =>
            <ListingItem key={listing.id} id={listing.id} price={listing.price} address={listing.address} bedrooms={listing.bedroomCount}/>
          )}
        
        </Item.Group>
      </Container>
      
    </div>
  )
}
