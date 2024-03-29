import Head from 'next/head'
import Link from 'next/link'
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import {useAuth} from "../context/AuthContext"
import { useRouter } from "next/router"
import { useState, useEffect } from 'react';
import fire from '../config/firebase-config';
import ListingItem from "../components/ListingItem"


export default function MyAccount() {
  const {currentUser, logout} = useAuth();
  const [myHouses, setMyHouses] = useState([]);
  const [sentVerification, setSentVerification] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [editEmail, setEditEmail] = useState('');
  const [editDisplayName, setEditDisplayName] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const router = useRouter();

  function handleLogout(e){
    e.preventDefault()
    logout().then(() => {
      router.push('/')
      console.log("Logout Successful");
    }).catch((error) => {
      console.log(error);
    });
  }

  function initiateEmailVerification(e){
    e.preventDefault()
    currentUser.sendEmailVerification({
      url: "https://studenthousinghub.ca/my-account",
    }).then(() => {
      console.log("Email Sent Successful");
      setSentVerification(true)
    }).catch((error) => {
      setVerificationError(true)
      setSentVerification(true)
    });
  }

  async function handleEditProfile(){
    await currentUser.updateProfile({
      displayName: editDisplayName
    })
    setIsEditingProfile(false)
  }
    

  useEffect(async() => {
    if(!currentUser){
      console.log("IN NO CURRENTUSER")
      router.push('/login')
      return
    }
    let newArray = [];
    setEditEmail(currentUser.email)
    setEditDisplayName(currentUser.displayName)
    await fire.firestore()
      .collection('listing').where("author_uid", "==", currentUser.uid).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            newArray.push({id: doc.id, ...doc.data()})
        });
        setMyHouses(newArray)
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
  }, []);

  


  return (
    <div>
      <Head>
        <title>Student Housing Hub</title>
      </Head>
      
      <div className="myprofilepage">
        <Navbar/>
        {currentUser && 
        <div className="myprofilepageportion">

          <div className="myprofilediv">
            <div className="myaccounttitlediv">
              <div>
                <h1 className="myaccounttitle">{currentUser.displayName || currentUser.email}</h1>
                <h4 className="myaccountsubtitle">Landlord</h4>
              </div>   
              {isEditingProfile ? <button className="doneeditprofilebtn" onClick={() => handleEditProfile()}>Done Edits</button> : <button className="editprofilebtn" onClick={() => setIsEditingProfile(true)}>Edit Profile</button> }
            </div>
            

            <div className="myprofileline">
              <p className="myprofilelineheader">Account Email:</p>
              {isEditingProfile ? <input type="email" onChange={(e) => setEditEmail(e.target.value)} value={editEmail} disabled required/> : <p style={{display: isEditingProfile}}>{currentUser.email}</p>}
            </div>
            <div className="myprofileline">
              <p className="myprofilelineheader">Display Name:</p>
              {isEditingProfile ? <input type="text" onChange={(e) => setEditDisplayName(e.target.value)} value={editDisplayName} required/> : <p style={{display: isEditingProfile}}>{editDisplayName}</p>}
            </div>
            <div className="myprofileline">
              <p className="myprofilelineheader">Email Verified:</p>
              {currentUser.emailVerified ? <p>Verified</p> : verificationError ? <button className="sentverificationbtn" disabled>Previous Sent</button> : sentVerification ? <button className="sentverificationbtn" disabled>Sent</button> : <button className="sendverificationbtn" onClick={initiateEmailVerification}>Send Verification</button>}
            </div>
            <div className="myprofileline">
              <p className="myprofilelineheader">Phone:</p>
              {currentUser.phoneNumber ? <p>{currentUser.phoneNumber}</p> : <p>N/A</p>}
            </div>
             { isEditingProfile && <div className="myprofileline">
              <Link href="/forgot-password">
                  <button>Reset Password</button>
              </Link>
            </div> }
            {currentUser && !isEditingProfile && <button className="signoutbtn" onClick={handleLogout}>Sign Out</button>}
          </div>

          <div className="mypropertiesdiv">
            <div className="mypropertiestitlediv">
              <h1 className="mypropertiestitle">My Properties</h1>
              {currentUser.emailVerified && <a className="addlistingbtn" href="/new-listing">Add Listing</a>}
            </div>
            {!currentUser.emailVerified && sentVerification && <h3>Verification email has been sent ...</h3>}
            {!currentUser.emailVerified && verificationError && <h3>Email has already been sent. Error sending another verification email. Look in your inbox or try again later ...</h3>}
            {!currentUser.emailVerified && !sentVerification && <h3 onClick={initiateEmailVerification}>You must <span className="verifyemailspan">VERIFY YOUR EMAIL</span> before you can add listings</h3>}
            {currentUser.emailVerified && myHouses.length == 0 ? <p>Currently, You Have No Listings</p> : myHouses.map(listing => <div className="oneproperty" key={listing.id}>
              <ListingItem key={listing.id} id={listing.id} price={listing.price} address={listing.address} bedrooms={listing.bedroomCount} bathrooms={listing.bathroomCount} moveInDate={listing.moveInDate} available={listing.available} landlordDisplayName={listing.landlordDisplayName} authorid={listing.author_uid}/>
              </div>
            )}

          </div>
        </div> }
        
        <Footer/>
      </div>
      
    </div>
  )
}
