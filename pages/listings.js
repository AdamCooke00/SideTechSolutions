import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Map from '../components/Map'
import ListingItem from "../components/ListingItem"
import { db } from "../config/firebase-config"
import { useState, useEffect } from 'react';

export async function getStaticProps() {
  console.log("Static Props")
  let listingData = []
  await db.collection('listing').get()
    .then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        listingData.push({
          id: doc.id,
          ...doc.data()
        });
      })
    })
  return {
    props: { queriedListings: listingData },
    revalidate: 600,
    notFound: false,
  }
}


export default function Home({ queriedListings }) {
  const [listings, setListings] = useState(queriedListings);
  const [filteredListings, setFilteredListings] = useState(queriedListings);
  const [filters, setFilters] = useState([]);
  const [filterMessage, setFilterMessage] = useState();

  const handleFilters = (e) => {
    e.preventDefault()
    if (filters.bedrooms) {
      let filtList = listings.filter(list => list.bedroomCount == filters.bedrooms)
      setFilteredListings(filtList)
      setFilterMessage(`Filter: ${filters.bedrooms} has been applied`)
    }
  }
  const clearFilters = (e) => {
    e.preventDefault()
    setFilters({})
    setFilteredListings(listings)
    setFilterMessage("Filters have been cleared")
  }

  useEffect(() => {
  }, []);

  return (
    <main className="entire-page">
      <Head>
        <title>Student Housing Hub Listings</title>
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.css' rel='stylesheet' />
      </Head>
      <Navbar />
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
                onChange={() => setFilters({ bedrooms: 1 })}
              />
              <label for="filterCheckBoxNo1">1</label>
              <input
                type="radio"
                id="filterCheckBoxNo2"
                value='2'
                name="bedFilterSearch"
                checked={filters.bedrooms === 2}
                onChange={() => setFilters({ bedrooms: 2 })}
              />
              <label for="filterCheckBoxNo2">2</label>
              <input
                type="radio"
                id="filterCheckBoxNo3"
                value='3'
                name="bedFilterSearch"
                checked={filters.bedrooms === 3}
                onChange={() => setFilters({ bedrooms: 3 })}
              />
              <label for="filterCheckBoxNo3">3</label>
              <input
                type="radio"
                id="filterCheckBoxNo4"
                value='4'
                name="bedFilterSearch"
                checked={filters.bedrooms === 4}
                onChange={() => setFilters({ bedrooms: 4 })}
              />
              <label for="filterCheckBoxNo4">4</label>
              <input
                type="radio"
                id="filterCheckBoxNo5"
                value='5'
                name="bedFilterSearch"
                checked={filters.bedrooms === 5}
                onChange={() => setFilters({ bedrooms: 5 })}
              />
              <label for="filterCheckBoxNo5">5</label>
              <input
                type="radio"
                id="filterCheckBoxNo6"
                value='6'
                name="bedFilterSearch"
                checked={filters.bedrooms === 6}
                onChange={() => setFilters({ bedrooms: 6 })}
              />
              <label for="filterCheckBoxNo6">6</label>
              <br />
              <input
                type="radio"
                id="filterCheckBoxNo7"
                value='7'
                name="bedFilterSearch"
                checked={filters.bedrooms === 7}
                onChange={() => setFilters({ bedrooms: 7 })}
              />
              <label for="filterCheckBoxNo7">7</label>
              <input
                type="radio"
                id="filterCheckBoxNo8"
                value='8'
                name="bedFilterSearch"
                checked={filters.bedrooms === 8}
                onChange={() => setFilters({ bedrooms: 8 })}
              />
              <label for="filterCheckBoxNo8">8</label>
            </div>
          </div>
          <div className="filterbtndiv">
            <button className="filterbtn" onClick={handleFilters}>Apply Filters</button>
            <button className="filterbtn" onClick={clearFilters}>Clear Filters</button>
          </div>
          {filterMessage && <p className="filtermessage">{filterMessage}</p>}
        </form>
      </div>



      <div className="listingspage">
        <div className="listingsside">

          <p className="numberofrentals">{filteredListings.length} Rentals</p>
          {filteredListings.map(listing =>
            <div key={listing.id} className="asinglelisting">
              <ListingItem id={listing.id} price={listing.price} address={listing.address} bedrooms={listing.bedroomCount} bathrooms={listing.bathroomCount} authorid={listing.author_uid} />
            </div>
          )}
        </div>
        <div className="filtersside">
          <div className="filters">
            <h3 className="filtertitle">Filters</h3>
            <form>
              <div className="filterbybedroom">
                <h4 className="filterbedroomsubtitle">By Bedroom</h4>
                <input
                  type="radio"
                  id="filterCheckBoxDesktopNo1"
                  value='1'
                  name="bedFilterSearch"
                  checked={filters.bedrooms === 1}
                  onChange={() => setFilters({ bedrooms: 1 })}
                />
                <label for="filterCheckBoxDesktopNo1">1</label>
                <input
                  type="radio"
                  id="filterCheckBoxDesktopNo2"
                  value='2'
                  name="bedFilterSearch"
                  checked={filters.bedrooms === 2}
                  onChange={() => setFilters({ bedrooms: 2 })}
                />
                <label for="filterCheckBoxDesktopNo2">2</label>
                <input
                  type="radio"
                  id="filterCheckBoxDesktopNo3"
                  value='3'
                  name="bedFilterSearch"
                  checked={filters.bedrooms === 3}
                  onChange={() => setFilters({ bedrooms: 3 })}
                />
                <label for="filterCheckBoxDesktopNo3">3</label>
                <input
                  type="radio"
                  id="filterCheckBoxDesktopNo4"
                  value='4'
                  name="bedFilterSearch"
                  checked={filters.bedrooms === 4}
                  onChange={() => setFilters({ bedrooms: 4 })}
                />
                <label for="filterCheckBoxDesktopNo4">4</label>
                <input
                  type="radio"
                  id="filterCheckBoxDesktopNo5"
                  value='5'
                  name="bedFilterSearch"
                  checked={filters.bedrooms === 5}
                  onChange={() => setFilters({ bedrooms: 5 })}
                />
                <label for="filterCheckBoxDesktopNo5">5</label>
                <input
                  type="radio"
                  id="filterCheckBoxDesktopNo6"
                  value='6'
                  name="bedFilterSearch"
                  checked={filters.bedrooms === 6}
                  onChange={() => setFilters({ bedrooms: 6 })}
                />
                <label for="filterCheckBoxDesktopNo6">6</label>
                <input
                  type="radio"
                  id="filterCheckBoxDesktopNo7"
                  value='7'
                  name="bedFilterSearch"
                  checked={filters.bedrooms === 7}
                  onChange={() => setFilters({ bedrooms: 7 })}
                />
                <label for="filterCheckBoxDesktopNo7">7</label>
                <input
                  type="radio"
                  id="filterCheckBoxDesktopNo8"
                  value='8'
                  name="bedFilterSearch"
                  checked={filters.bedrooms === 8}
                  onChange={() => setFilters({ bedrooms: 8 })}
                />
                <label for="filterCheckBoxDesktopNo8">8</label>
              </div>
              <div className="filterbtndiv">
                <button className="filterbtn" onClick={handleFilters}>Apply Filters</button>
                <button className="filterbtn" onClick={clearFilters}>Clear Filters</button>
              </div>
              {filterMessage && <p className="filtermessage">{filterMessage}</p>}
            </form>
          </div>
          {/* <Map/> */}
        </div>
      </div>

      <Footer />
    </main>
  )
}
