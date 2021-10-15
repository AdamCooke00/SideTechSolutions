import React, { useRef, useState, useEffect } from 'react';
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"
import firebase, { auth, storage } from '../config/firebase-config';
import geocodingClient from '../config/mapbox-config';
import { useRouter } from "next/router"
import MultiImageInput from 'react-multiple-image-input';
import { v4 as uuidv4 } from 'uuid';


export default function NewListing() {
    const [pageLoading, setPageLoading] = useState(true)
    const [addressText, setAddressText] = useState('')
    const [bedroomCountState, setBedroomCountState] = useState('')
    const [bathroomCountState, setBathroomCountState] = useState('')
    const [totalMonthRentState, setTotalMonthRentState] = useState('')
    const [parkingSpacesState, setParkingSpacesState] = useState('')
    const [utilitesState, setUtilitiesState] = useState('')
    const [internetState, setInternetState] = useState('')
    const router = useRouter()
    const [potentialAddresses, setPotentialAddresses] = useState([])
    const [isAddressDisabled, setIsAddressDisabled] = useState(false)
    const [fullAddress, setFullAddress] = useState('')
    const [images, setImages] = useState({});
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false) //so user doesnt spam create listings.
    const { currentUser } = useAuth();


    const handleGeocoder = async (event) => {
        event.preventDefault();
        setAddressText(event.target.value)
        if (addressText.length > 3) {
            await geocodingClient.forwardGeocode({
                query: event.target.value,
                limit: 4,
                mode: "mapbox.places",
                countries: ["ca"],
                proximity: [-76.49569214262658, 44.227861554260784],
                types: ['address'],
            }).send().then(response => {
                const match = response.body;
                console.log(match.features);
                setPotentialAddresses(match.features);
            }).catch(err => {
                console.log(err);
            });
        }
    }

    const handleSelectedAddress = (address) => {
        setIsAddressDisabled(true);
        setLoading(false);
        setError('')
        let addressSplit = address.place_name.split(",").slice(0, 2).join(",");
        console.log(addressSplit);
        setAddressText(addressSplit);
        setPotentialAddresses(['']);
        setFullAddress(address);
    }

    const handleNewListing = async (event) => {
        event.preventDefault();
        setLoading(true);
        if (isAddressDisabled) {
            await firebase.firestore()
                .collection('listing')
                .add({
                    address: addressText,
                    fullAddress: fullAddress,
                    bedroomCount: bedroomCountState,
                    bathroomCount: bathroomCountState,
                    price: totalMonthRentState,
                    parkingSpaces: parkingSpacesState,
                    utilities: utilitesState,
                    internet: internetState,
                    author_uid: currentUser.uid
                }).then(async (result) => {
                    await handleNewPhotos(event.target.thumbnail.files[0], result.id);
                    console.log("New Listing Created");
                    router.push('/my-account')
                }).catch((e) => {
                    console.log("Unable to create new listing");
                    console.error(e);
                })
            setTimeout(() => {
            }, 4000)
        } else {
            setError("Please Select An Autocompleted Address")
        }
    }

    const handleNewPhotos = async (file, houseId) => {
        let thumbnailRef = storage.ref(`rentalPhotos/${currentUser.uid}/${houseId}/thumbnail`);
        console.log(file)

        await thumbnailRef.put(file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        }).catch(e => {
            console.log(e);
        });

        for (var key in images) {
            let additionalPhotoRef = storage.ref(`rentalPhotos/${currentUser.uid}/${houseId}/${uuidv4()}`);
            await additionalPhotoRef.putString(images[key], 'data_url').then((snapshot) => {
                console.log('Uploaded Once');
            }).catch(e => {
                console.log('FAILED');
                console.log(e);
            });
        }

    }

    useEffect(async () => {
        currentUser && currentUser.emailVerified ? setPageLoading(false) : router.push("/login");
    }, []);

    if (pageLoading) {
        return <p>Loading Page...</p>
    }

    return (
        <div className="newlistingpage">
            <Navbar />
            <div className="newlistingpageportion">
                <div className="newlistingformdiv">
                    <h2 className="newlistingformtitle">Add New Listing</h2>
                    {error && <p style={{ backgroundColor: "red" }}>{error}</p>}
                    <form onSubmit={handleNewListing}>
                        <div className="newlistingformline">
                            <label className="newlistingformlabel">House Address</label>
                            <input type="text" value={addressText} onChange={handleGeocoder} disabled={isAddressDisabled} required />
                            {potentialAddresses.map(address => <p className="paragraphlikelink" onClick={() => handleSelectedAddress(address)} key={address.id}>{address.place_name}</p>)}
                            {isAddressDisabled && <button onClick={() => { setIsAddressDisabled(false); setLoading(false); }}>Change Address</button>}
                        </div>
                        <div className="newlistingformline">
                            <label className="newlistingformlabel">No. of Bedrooms</label>
                            <input type="number" value={bedroomCountState} onChange={(e) => setBedroomCountState(e.target.value)} required />
                        </div>
                        <div className="newlistingformline">
                            <label className="newlistingformlabel">No. of Bathrooms</label>
                            <input type="number" value={bathroomCountState} onChange={(e) => setBathroomCountState(e.target.value)} required />
                        </div>
                        <div className="newlistingformline">
                            <label className="newlistingformlabel">Total Month Rent</label>
                            <input type="number" value={totalMonthRentState} onChange={(e) => setTotalMonthRentState(e.target.value)} required />
                        </div>
                        <div className="newlistingformline">
                            <label className="newlistingformlabel">Month Rent / Person</label>
                            <input disabled type="number" value={totalMonthRentState / bedroomCountState} />
                        </div>
                        <div className="newlistingformline">
                            <label className="newlistingformlabel">Parking Spaces</label>
                            <input type="number" value={parkingSpacesState} onChange={(e) => setParkingSpacesState(e.target.value)} required />
                        </div>
                        <div className="newlistingformlineradio">
                            <label className="newlistingformlabel">Utilities</label>
                            <input
                                name="utilitiesState"
                                type="radio"
                                value="included"
                                id="yes"
                                checked={utilitesState === "included"}
                                onChange={() => setUtilitiesState("included")}
                                required
                            />
                            <label className="radiolabel" for="yes">Included</label>
                            <input
                                name="utilitiesState"
                                type="radio"
                                value="not included"
                                id="no"
                                checked={utilitesState === "not included"}
                                onChange={() => setUtilitiesState("not included")}
                            />
                            <label className="radiolabel" for="no">Not Included</label>
                        </div>
                        <div className="newlistingformlineradio">
                            <label className="newlistingformlabel">Internet</label>
                            <input
                                name="internetState"
                                type="radio"
                                value="included"
                                id="yesInternet"
                                checked={internetState === "included"}
                                onChange={() => setInternetState("included")}
                                required
                            />
                            <label className="radiolabel" for="yesInternet">Included</label>
                            <input
                                name="internetState"
                                type="radio"
                                value="not included"
                                id="noInternet"
                                checked={internetState === "not included"}
                                onChange={() => setInternetState("not included")}
                            />
                            <label className="radiolabel" for="noInternet">Not Included</label>
                        </div>
                        <div className="newlistingformline">
                            <p className="addthumbnailtitle">Add Thumbnail Photo</p>
                            <input type="file" id="thumbnail" required />
                        </div>
                        <div className="newlistingformline">
                            <p className="addthumbnailtitle">Add Additional Photos</p>
                            <p>6 Additional Max</p>

                            <MultiImageInput
                                images={images}
                                max={6}
                                setImages={setImages}
                                allowCrop={false}
                                theme={"light"}
                                handleError={(e) => console.log(e)}
                            />
                        </div>
                        <div className="newlistingformline notice">
                            <p>*Please note it can take up to 10 minutes for your new listing to appear on the rentals page*</p>
                        </div>
                        <button className="createlistingbtn" disabled={loading} type="submit">Create New Listing</button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    )
}

// export async function getServerSideProps(context) {

// }