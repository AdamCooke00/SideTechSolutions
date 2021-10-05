import React, {useRef, useState, useEffect} from 'react';
import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"
import {useAuth} from "../../../context/AuthContext"
import firebase, {auth, storage, db} from '../../../config/firebase-config';
import {useRouter} from "next/router"
import MultiImageInput from 'react-multiple-image-input';
import { v4 as uuidv4 } from 'uuid';

export default function EditListing() {
    const [address, setAddress] = useState('')
    const [bedroomCount, setBedroomCount] = useState('')
    const [bathroomCount, setBathroomCount] = useState('')
    const [totalPrice, setTotalPrice] = useState('')
    const [imgUrl, setImgUrl] = useState('');
    const [additionalImages, setAdditionalImages] = useState([]);
    const [images, setImages] = useState({});
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false) //so user doesnt spam create listings.
    const [pageLoading, setPageLoading] = useState(true) //so user doesnt spam create listings.
    const {currentUser} = useAuth();

    useEffect(async () => {
        if(currentUser){
            let { id } = router.query
            let listing = await db.collection('listing').doc(id).get()
            setAddress(listing.data().address)
            setBedroomCount(listing.data().bedroomCount)
            setBathroomCount(listing.data().bathroomCount)
            setTotalPrice(listing.data().price)
            let listRef = storage.ref("rentalPhotos/"+ currentUser.uid + "/" + id);
            await listRef.listAll()
                .then((res) => {
                    res.items.forEach(async (itemRef) => {
                        if(itemRef.name != "thumbnail"){
                            await itemRef.getDownloadURL()
                            .then( url => {
                                setAdditionalImages(additionalImages => [...additionalImages, url]);
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
            setPageLoading(false)
        } else{
            router.push("/login")
        } 
      }, []);


    
    const handleEditListing = async (event) => {
        event.preventDefault();
        setLoading(true);
        let { id } = router.query
        // console.log(event.target.thumbnailPhoto.files.length);
        await db.collection('listing').doc(id).update({
            bedroomCount: bedroomCount,
            bathroomCount: bathroomCount,
            price: totalPrice,
        }).then( async () => {
            console.log("Edited Listing");
            if(event.target.thumbnailPhoto.files.length == 1){
                await handleNewThumbnailPhoto(event.target.thumbnailPhoto.files[0]);
            }
            await handleNewPhotos();
            router.push('/my-account')
        }).catch((e)=> {
            console.log("Unable to editlisting");
            console.error(e);
        })
        setLoading(false);
        setTimeout(() => {
        }, 4000)
    }

    const handleDeleteListing = async (event) => {
        event.preventDefault();
        additionalImages.forEach(async (img) => {
            await handleDeleteImage(img);
        })
        await handleDeleteImage(imgUrl);
        await db.collection("listing").doc(router.query.id).delete().then(() => {
            console.log("Document successfully deleted!");
            router.push("/my-account")
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
    }

    const handleDeleteImage = async (url) => {
        var fileRef = storage.refFromURL(url);
        await fileRef.delete().then(() => {
            console.log("Deleted Success")
        }).catch((error) => {
            console.log("Failed Delete")
        });
        setAdditionalImages(additionalImages.filter(img => img !== url));
    }

    const handleNewThumbnailPhoto = async (file) => {
        let imageRef = storage.ref().child(`rentalPhotos/${currentUser.uid}/${router.query.id}/thumbnail`);
        await imageRef.put(file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            }).catch(e => {
            console.log(e);
            });   
    }

    const handleNewPhotos = async () => { 
        for(var key in images){
            let additionalPhotoRef = storage.ref(`rentalPhotos/${currentUser.uid}/${router.query.id}/${uuidv4()}`);
            await additionalPhotoRef.putString(images[key], 'data_url').then((snapshot) => {
                console.log('Uploaded Once');
                }).catch(e => {
                console.log('FAILED');
                console.log(e);
                }); 
        }     
    }

    if(pageLoading){
        return <p>Loading Page...</p>
    }

  return (
    <div className="editlistingpage">
        <Navbar/>
        <div className="editlistingpageportion">
            <div className="editlistingformdiv">
                <h2 className="editlistingformtitle">Edit Your Listing</h2>
                    {error && <p variant="danger">{error}</p>}
                    <form onSubmit={handleEditListing}>
                        <div className="editlistingformline">
                            <label className="editlistingformlabel">House Address</label>
                            <input type="text" value={address} disabled required/>
                            <p>Sorry, address editing is unavailable. Please email <strong>landlord@studenthousinghub.ca</strong> for assistance or, delete this listing and create a new one.</p>
                        </div>
                        <div  className="editlistingformline">
                            <label className="editlistingformlabel">No. of Bedrooms</label>
                            <input type="number" onChange={(e) => setBedroomCount(e.target.value)} value={bedroomCount} required/>
                        </div>
                        <div  className="editlistingformline">
                            <label className="editlistingformlabel">No. of Bathrooms</label>
                            <input type="number" onChange={(e) => setBathroomCount(e.target.value)} value={bathroomCount} required/>
                        </div>
                        <div  className="editlistingformline">
                            <label className="editlistingformlabel">Total Price</label>
                            <input type="number" onChange={(e) => setTotalPrice(e.target.value)} value={totalPrice} required/>
                        </div>
                        <div className="editlistingformline">
                            <p className="editthumbnailtitle">Current Thumbnail Picture</p>
                            <img src={imgUrl}/>
                        </div>
                        <div className="editlistingformline">
                            <p className="editthumbnailtitle">Change Thumbnail Picture</p>
                            <input type="file" id="thumbnailPhoto"/>
                        </div>
                        <div className="editlistingformline">
                            <p className="editthumbnailtitle">Current Additional Photos</p>
                            {additionalImages.length == 0 ? <p>None</p> : additionalImages.map(image => 
                                <div className="additionalimagediv" key={image}>
                                    <img src={image}/>
                                    <a className="deleteimagelink" onClick={() => handleDeleteImage(image)}>Delete Image</a>
                                    <br/>
                                </div>
                            )}
                        </div>
                        <div className="editlistingformline">
                            <p className="editthumbnailtitle">Add Additional Photos</p>
                            <p>6 Additional Max ({6-additionalImages.length} remaining)</p>

                            <MultiImageInput
                            images={images}
                            max={6-additionalImages.length}
                            setImages={setImages}
                            allowCrop={false}
                            theme={"light"}
                            handleError={(e) => console.log(e)}
                            />
                        </div>
                        <button disabled={loading} className="editlistingbtn" type="submit">Confirm Edits</button>
                    </form>

                <button onClick={handleDeleteListing} className="deletelistingbtn" type="submit">Delete Listing</button>
            </div>
        </div>
     <Footer/>
    </div>
  )
}

// export async function getServerSideProps(context) {
    
// }