import Head from 'next/head'
import Script from 'next/script';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Map from '../components/Map'
import ListingItem from "../components/ListingItem"
import fire from '../config/firebase-config';
import { useState, useEffect } from 'react';
import Link from "next/link"
import {useAuth} from "../context/AuthContext"

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

  const handleFilters = (e) => {
    e.preventDefault()
    if (filters.bedrooms){
      let filtList = listings.filter(list => list.bedroomCount == filters.bedrooms)
      setFilteredListings(filtList)
      setFilterMessage(`Bedroom filter: ${filters.bedrooms} has been applied`)
    }
  }


  const clearFilters = (e) => {
    e.preventDefault()
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
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.css' rel='stylesheet' />
      </Head>
      <Navbar/>
      <div className="filterbarforsmallscreen">
        <p className="filterbarforsmallscreentitle">Filter Results</p>
        <form> 
            <div className="filterbybedroom">
              <h4 className="filterbedroomsubtitle">By Bedrooms</h4>
              <div className="inputsdiv">
                <input
                  type="radio"
                  id="filterCheckBoxNo1"
                  value='1'
                  name="bedFilterSearch"
                  checked={filters.bedrooms === 1}
                  onChange={() => setFilters({bedrooms: 1})}
                />
                <label for="filterCheckBoxNo1">1</label>
                <input
                  type="radio"
                  id="filterCheckBoxNo2"
                  value='2'
                  name="bedFilterSearch"
                  checked={filters.bedrooms === 2}
                  onChange={() => setFilters({bedrooms: 2})}
                />
                <label for="filterCheckBoxNo2">2</label>
                <input
                  type="radio"
                  id="filterCheckBoxNo3"
                  value='3'
                  name="bedFilterSearch"
                  checked={filters.bedrooms === 3}
                  onChange={() => setFilters({bedrooms: 3})}
                />
                <label for="filterCheckBoxNo3">3</label>
                <input
                  type="radio"
                  id="filterCheckBoxNo4"
                  value='4'
                  name="bedFilterSearch"
                  checked={filters.bedrooms === 4}
                  onChange={() => setFilters({bedrooms: 4})}
                />
                <label for="filterCheckBoxNo4">4</label>
                <input
                  type="radio"
                  id="filterCheckBoxNo5"
                  value='5'
                  name="bedFilterSearch"
                  checked={filters.bedrooms === 5}
                  onChange={() => setFilters({bedrooms: 5})}
                />
                <label for="filterCheckBoxNo5">5</label>
                <input
                  type="radio"
                  id="filterCheckBoxNo6"
                  value='6'
                  name="bedFilterSearch"
                  checked={filters.bedrooms === 6}
                  onChange={() => setFilters({bedrooms: 6})}
                />
                <label for="filterCheckBoxNo6">6</label>
              </div>
            </div>
            <div className="filterbtndiv">
              <button className="filterbtn" onClick={handleFilters}>Apply Filters</button>
              <button className="filterbtn" onClick={clearFilters}>Clear Filters</button>
            </div>
        </form>
      </div>
      {error && <p>{error}</p>}

      {filterMessage &&
        <p>{filterMessage}</p>
      }  

      
      {/* {currentUser && <CreatePost/> } */}
        <div className="listingspage">
          <Script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"/>
          <Script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"/> 
          <div className="listingsside">
            <p className="numberofrentals">{filteredListings.length} Rentals</p>
            {filteredListings.map(listing =>
              <div key={listing.id} className="asinglelisting">
                <ListingItem id={listing.id} price={listing.price} address={listing.address} bedrooms={listing.bedroomCount} bathrooms={listing.bathroomCount} authorid={listing.author_uid}/>
              </div>
            )}
          </div>
          <div className="filtersside">
            <div className="filters">
              <h3 className="filtertitle">Filters</h3>
              <p>Current Filters: {filters && filters.bedrooms} </p>
              <form> 
                  <div className="filterbybedroom">
                    <h4 className="filterbedroomsubtitle">By Bedroom</h4>
                    <input
                      type="radio"
                      id="filterCheckBoxDesktopNo1"
                      value='1'
                      name="bedFilterSearch"
                      checked={filters.bedrooms === 1}
                      onChange={() => setFilters({bedrooms: 1})}
                    />
                    <label for="filterCheckBoxDesktopNo1">1</label>
                    <input
                      type="radio"
                      id="filterCheckBoxDesktopNo2"
                      value='2'
                      name="bedFilterSearch"
                      checked={filters.bedrooms === 2}
                      onChange={() => setFilters({bedrooms: 2})}
                    />
                    <label for="filterCheckBoxDesktopNo2">2</label>
                    <input
                      type="radio"
                      id="filterCheckBoxDesktopNo3"
                      value='3'
                      name="bedFilterSearch"
                      checked={filters.bedrooms === 3}
                      onChange={() => setFilters({bedrooms: 3})}
                    />
                    <label for="filterCheckBoxDesktopNo3">3</label>
                    <input
                      type="radio"
                      id="filterCheckBoxDesktopNo4"
                      value='4'
                      name="bedFilterSearch"
                      checked={filters.bedrooms === 4}
                      onChange={() => setFilters({bedrooms: 4})}
                    />
                    <label for="filterCheckBoxDesktopNo4">4</label>
                    <input
                      type="radio"
                      id="filterCheckBoxDesktopNo5"
                      value='5'
                      name="bedFilterSearch"
                      checked={filters.bedrooms === 5}
                      onChange={() => setFilters({bedrooms: 5})}
                    />
                    <label for="filterCheckBoxDesktopNo5">5</label>
                    <input
                      type="radio"
                      id="filterCheckBoxDesktopNo6"
                      value='6'
                      name="bedFilterSearch"
                      checked={filters.bedrooms === 6}
                      onChange={() => setFilters({bedrooms: 6})}
                    />
                    <label for="filterCheckBoxDesktopNo6">6</label>
                  </div>
                  <div className="filterbtndiv">
                    <button className="filterbtn" onClick={handleFilters}>Apply Filters</button>
                    <button className="filterbtn" onClick={clearFilters}>Clear Filters</button>
                  </div>
              </form>
            </div>
            {/* <Map/> */}
          </div>
        </div>
        
      <Footer/>
    </div>
  )
}
