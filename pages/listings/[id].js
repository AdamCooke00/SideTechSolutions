import { useRouter } from "next/router"
import Link from "next/link"
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Map from '../../components/Map'
import { db, storage } from "../../config/firebase-config"
import { useAuth } from "../../context/AuthContext"
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/navigation"
import SwiperCore, {
    Pagination, Navigation
} from 'swiper';
SwiperCore.use([Pagination, Navigation]);
global.XMLHttpRequest = require("xhr2");

export async function getStaticProps({ params: { id } }) {
    return await db.collection('listing').doc(id).get()
        .then(async docSnapshot => {
            if (docSnapshot.exists) {
                let listResult = await storage.ref("rentalPhotos/" + docSnapshot.data().author_uid + "/" + id).listAll()
                let photos = {}
                photos.extraPictures = []
                for (const reference of listResult.items) {
                    if (reference.name != "thumbnail") {
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
                    revalidate: 600,
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

export default function Listing({ data, photos }) {
    const router = useRouter()
    const { currentUser } = useAuth();
    const { id } = router.query
    const [imgUrl, setImgUrl] = useState('');
    const [moveInDateString, setMoveInDateString] = useState('');
    const [viewImages, setViewImages] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const [additionaImages, setAdditionalImages] = useState([]);


    useEffect(async () => {
        if (photos) {
            setImgUrl(photos.thumbnail);
            setAdditionalImages(photos.extraPictures);
        }
        setMoveInDateString("May 1st 2022")
        if(data.moveInDate != undefined){
            let theDate = new Date(data.moveInDate)
            theDate.setDate(theDate.getDate() + 1)
            setMoveInDateString(theDate.toDateString().split(" ").slice(1).join(" "))
        } 
    }, []);

    return (
        <div>
            <Navbar />
            <div className="singleListingMoreDetailPage">
                <Link href="/listings"><button className="gobackbtn">Back to Listings</button></Link>
                <div className="topOfAListingDiv">
                    <h1 className="addressheader">{data.address}</h1>
                    <div className="imgmapdiv">
                        <img className="frontimage" src={imgUrl} />
                        {/* <Map/> */}
                    </div>
                    {viewImages && <Swiper pagination={{ "type": "fraction" }} navigation={true} className="swiper">
                        {additionaImages.map(image =>
                            <SwiperSlide key={image}>
                                <img src={image} />
                            </SwiperSlide>
                        )}
                    </Swiper>

                    }
                    {additionaImages.length != 0 ? (viewImages ? <button className="hideimagesbtn" onClick={() => setViewImages(false)}>Hide Images</button> : <button className="viewimagesbtn" onClick={() => setViewImages(true)}>View Images</button>) : <p>No Additional Images</p>}

                    {currentUser && currentUser.uid === data.author_uid && <Link href={`/listings/${id}/edit`}><button className="editbtn">Edit Rental</button></Link>}

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
                        <p className="leftaligntext">Price Per Person:</p>
                        <p className="rightaligntext">${parseInt(data.price / data.bedroomCount)}/month</p>
                    </div>
                    <div className="singleListingHouseInfo">
                        <p className="leftaligntext">Total Price:</p>
                        <p className="rightaligntext">${data.price}/month</p>
                    </div>
                    <div className="singleListingHouseInfo">
                        <p className="leftaligntext">Move In Date:</p>
                        <p className="rightaligntext">{moveInDateString}</p>
                    </div>
                    <div className="singleListingHouseInfo">
                        <p className="leftaligntext">Parking Spaces:</p>
                        <p className="rightaligntext">{data.parkingSpaces}</p>
                    </div>
                    <div className="singleListingHouseInfo">
                        <p className="leftaligntext">Realtor:</p>
                        <p className="rightaligntext">{data.landlordDisplayName}</p>
                    </div>
                </div>
                <div>
                    <h4 className="infoheadertitle">Utilities Info</h4>
                    <div className="generalinfodiv">
                        <div className="singleListingUtilitiesInfo">
                            <p className="leftaligntext">General Utilities:</p>
                            <p className="rightaligntext">{data.utilities}</p>
                        </div>
                        <div className="singleListingUtilitiesInfo">
                            <p className="leftaligntext">Internet:</p>
                            <p className="rightaligntext">{data.internet}</p>
                        </div>
                    </div>

                </div>
                <div className="generalinfodiv">
                    <h4 className="infoheadertitle">Contact Landlord</h4>
                    <div>
                        <div className="singleListingContactInfo">
                            <p className="leftaligntext">Email:</p>
                            <p className="rightaligntext">{data.landlord}</p>

                        </div>
                        <div className="singleListingContactInfo">
                            <p className="leftaligntext">Phone:</p>
                            <p className="rightaligntext">{data.phone || "N/A"}</p>
                        </div>
                    </div>
                    <div className="alignbtncenter">
                        <button className="requestatourbtn" onClick={() => setShowContact(!showContact)}>{showContact ? "Close Request" : "Request A Tour / Request Information"}</button>
                    </div>
                    {showContact && <div className="requesttourinfo">
                        <h2>Request A Tour</h2>
                        <h4>To request a tour or more information please email<a href={"mailto:" + data.landlord}>{data.landlord}</a> using the following template.</h4>
                        <ul>
                            <li>Subject Line<br/><span>{data.address} - Tour Request from SHH</span></li>
                            <li>Information<br/><span>Hello, we are a group of [second/third/...] year students attending Queen's University looking for a rental for May 2022.</span></li>
                            <li>Request<br/><span>We are interested in this rental and are looking to schedule an in-person tour. We are available Wednesday the 3rd before noon or after 5pm.</span></li>
                            <li>Regards<br/><span>Thank you and we look forward to your response. Best, [you].</span></li>
                        </ul>
                    </div>}
                </div>
            </div>
            <Footer />
        </div>
    );
}
