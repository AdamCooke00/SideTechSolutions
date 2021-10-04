import {useRouter} from "next/router"
import Link from "next/link"
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Map from '../../components/Map'
import {db} from "../../config/firebase-config"
import {useAuth} from "../../context/AuthContext"
import {storage} from '../../config/firebase-config';
import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";


export async function getStaticProps({ params: {id} }) {
    // params contains the post `id`.
    // If the route is like /posts/1, then params.id is 1
    console.log("Static Props")
    const doc = await db.collection('listing').doc(id).get()
        //TODO: get who the landlord is from the author uid on the doc.data object and send their username instead of the authoruid
        if (!doc.exists){
            return {
                redirect: {
                    destination: '/listings',
                    permanent: false,
                },
            }
        }

        return {
            props: {
                data: doc.data(),
            },
            revalidate: 180,
        }
    }

export async function getStaticPaths() {
    console.log("Static Paths")
    return {
      // Only `/posts/1` and `/posts/2` are generated at build time
      paths: [],
      // Enable statically generating additional pages
      // For example: `/posts/3`
      fallback: 'blocking',
    }
  }

export default function Listing({data}) {
    const router = useRouter()
    const {currentUser} = useAuth();
    const { id } = router.query
    const [imgUrl, setImgUrl] = useState('');
    const [viewImages, setViewImages] = useState(false);
    const [additionaImages, setAdditionalImages] = useState([]);
    

    useEffect(async () => {
        console.log(data)
        let listRef = storage.ref("rentalPhotos/"+ data.author_uid + "/" + id);
        await listRef.listAll()
            .then((res) => {
                res.items.forEach(async (itemRef) => {
                    if(itemRef.name != "thumbnail"){
                        await itemRef.getDownloadURL()
                        .then( url => {
                            setAdditionalImages(additionaImages => [...additionaImages, url]);
                        }).catch((error) => {
                            console.log(error);
                        });
                    } else {
                        await itemRef.getDownloadURL()
                        .then( url => {
                            setImgUrl(url);
                        }).catch((error) => {
                            console.log(error);
                        });
                    }
                });
            }).catch((error) => {
                console.log(error);

            });
    }, []);

    return (
        <div>
            <Navbar/>
            <div className="singleListingMoreDetailPage">
                <Link href="/listings"><button className="gobackbtn">Back to Listings</button></Link>
                <div className="topOfAListingDiv">
                    <h1 className="addressheader">{data.address}</h1>
                    <div className="imgmapdiv">
                        <img className="frontimage" src={imgUrl}/>
                        {/* <Map/> */}
                    </div>
                    {viewImages && <Carousel>
                    {additionaImages.map(image =>
                        <div key={image}>
                            <img src={image} />
                        </div>
                    )}
                    </Carousel> }
                    {viewImages ? <button className="hideimagesbtn" onClick={() => setViewImages(false)}>Hide Images</button>  : <button className="viewimagesbtn" onClick={() => setViewImages(true)}>View Images</button> }
                    
                    {currentUser && currentUser.uid === data.author_uid && <Link href={`/listings/${id}/edit`}><button className="editbtn">Edit Rental</button></Link> }

                </div>
                <div className="generalinfodiv">
                    <h4 className="infoheadertitle">General Info</h4>
                    <div className="singleListingHouseInfo">
                        <p className="leftaligntext">Bedrooms:</p>
                        <p className="rightaligntext">{data.bedroomCount}</p>
                    </div>
                    <div className="singleListingHouseInfo">
                        <p className="leftaligntext">Bathrooms:</p>
                        <p className="rightaligntext">{data.bathroomCount}</p>
                    </div>
                    <div className="singleListingHouseInfo">
                        <p className="leftaligntext">Price:</p>
                        <p className="rightaligntext">${parseInt(data.price/data.bedroomCount)}/month per person or ${data.price}/month total</p>
                    </div>
                    <div className="singleListingHouseInfo">
                        <p className="leftaligntext">Landlord:</p>
                        <p className="rightaligntext">{data.author_uid}</p>
                    </div>
                    <div className="singleListingHouseInfo">
                        <p className="leftaligntext">Move In Date:</p>
                        <p className="rightaligntext">May 1st 2022</p>
                    </div>
                    <div className="singleListingHouseInfo">
                        <p className="leftaligntext">Parking Spaces:</p>
                        <p className="rightaligntext">None</p>
                    </div>
                    <div className="singleListingHouseInfo">
                        <p className="leftaligntext">AC Unit:</p>
                        <p className="rightaligntext">None</p>
                    </div>                  
                </div>
                <div>
                    <h4 className="infoheadertitle">Price of Utilities</h4>
                    <div className="generalinfodiv">
                        <div className="singleListingUtilitiesInfo">
                            <p className="leftaligntext">Hydro:</p>
                            <p className="rightaligntext">Included</p>
                        </div>
                        <div className="singleListingUtilitiesInfo">
                            <p className="leftaligntext">Sewage:</p>
                            <p className="rightaligntext">Included</p>
                        </div>
                        <div className="singleListingUtilitiesInfo">
                            <p className="leftaligntext">Heating:</p>
                            <p className="rightaligntext">Included</p>
                        </div>
                        <div className="singleListingUtilitiesInfo">
                            <p className="leftaligntext">Internet:</p>
                            <p className="rightaligntext">Included</p>
                        </div>
                    </div>
                    
                </div>
                <div className="generalinfodiv">
                    <h4 className="infoheadertitle">Contact Landlord</h4>
                    <div>
                        <div className="singleListingContactInfo">
                            <p className="leftaligntext">Email:</p>
                            <p className="rightaligntext">sample@gmail.com</p>
                            
                        </div>
                        <div className="singleListingContactInfo">
                            <p className="leftaligntext">Phone:</p>
                            <p className="rightaligntext">613-123-1233</p>
                        </div>
                    </div>
                    <button className="requestatourbtn">Request A Tour</button>
                </div>
            </div>
            <Footer/>
        </div>
    );
}
