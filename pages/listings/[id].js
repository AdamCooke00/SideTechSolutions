import {useRouter} from "next/router"
import Link from "next/link"
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Map from '../../components/Map'
import {db, storage} from "../../config/firebase-config"
import {useAuth} from "../../context/AuthContext"
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/navigation"
import "swiper/css/navigation"
import SwiperCore, {
    Pagination,Navigation
  } from 'swiper';
SwiperCore.use([Pagination,Navigation]);
global.XMLHttpRequest = require("xhr2");

export async function getStaticProps({ params: {id} }) {    
    return await db.collection('listing').doc(id).get()
    .then(async docSnapshot => {
        if(docSnapshot.exists){
            let listResult = await storage.ref("rentalPhotos/"+ docSnapshot.data().author_uid + "/" + id).listAll()
            let photos = {}
            photos.extraPictures = []
            for(const reference of listResult.items){
                if(reference.name != "thumbnail"){
                    let url = await reference.getDownloadURL();
                    photos.extraPictures.push(url)
                } else {
                    photos.thumbnail = await reference.getDownloadURL()
                } 
            } 
            return {
                props: {
                    data: docSnapshot.data(),
                    photos,
                },
                revalidate: 1800,
            }
        } else {
            return {
                redirect: {
                    destination: '/listings',
                    permanent: false,
                },
            }
        }
    })
}

export async function getStaticPaths() {
    console.log("Static Paths")
    return {
      paths: [],
      fallback: "blocking",
    }
  }

export default function Listing({data, photos}) {
    const router = useRouter()
    const {currentUser} = useAuth();
    const { id } = router.query
    const [imgUrl, setImgUrl] = useState('');
    const [viewImages, setViewImages] = useState(false);
    const [additionaImages, setAdditionalImages] = useState([]);


    useEffect(async () => {
        if(photos){
            setImgUrl(photos.thumbnail);
            setAdditionalImages(photos.extraPictures);
        }
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
                    {viewImages && <Swiper pagination={{"type": "fraction"}} navigation={true} className="swiper"> 
                                    {additionaImages.map(image =>
                                        <SwiperSlide key={image}>
                                            <img src={image} />
                                        </SwiperSlide>
                                        )} 
                                    </Swiper>
                                     
                     }
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
