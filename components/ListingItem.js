import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styles from './ListingItem.module.scss';
import {useAuth} from "../context/AuthContext"
import { storage } from '../config/firebase-config';
function ListingItem({address, id, price, bedrooms, bathrooms, moveInDate, available, landlordDisplayName, authorid}) {
    const {currentUser} = useAuth();
    const [imgUrl, setImgUrl] = useState('');
    const [loading, setLoading] = useState(false)
    const [dateString, setDateString] = useState('')

    useEffect(async () => {
        setDateString("May 1st 2022")
        if(moveInDate != undefined){
            let theDate = new Date(moveInDate)
            theDate.setDate(theDate.getDate() + 1)
            setDateString(theDate.toDateString().split(" ").slice(1).join(" "))
        }      
        let storageRef = storage.ref("rentalPhotos/"+ authorid +"/"+id+"/thumbnail");
        await storageRef.getDownloadURL()
            .then((url) => {
                setImgUrl(url);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    return (
            <div className={styles.listitem}>
                <img alt={address} className={styles.picture} src={imgUrl}/>
                <div className={styles.infoside}>
                    <p className={styles.address}>{address}</p>
                    <p className={styles.landlord}>{landlordDisplayName}</p>
                    <div className={styles.houseinfo}>
                        <p>Move in: {dateString}</p>
                        <div className={styles.bedbath}>
                            <p>Beds: {bedrooms}</p>
                            <p>Baths: {bathrooms}</p>
                        </div>
                        <div className={styles.pricediv}>
                            <p><span className={styles.price}>${parseInt(price/bedrooms)}</span><span className={styles.permonth}>/month per person</span></p>
                            <p className={styles.totalprice}><span className={styles.price}>${price}</span><span className={styles.permonth}>/month total</span></p>
                        </div>
                        {loading && <div className="loader"></div>}
                    </div>
                    
                    <div>
                        <Link href={`/listings/${id}`}>
                            <button onClick={()=> setLoading(true)} className={styles.moreinfobtn}>More Info</button>
                        </Link>
                        {currentUser && currentUser.uid == authorid && 
                        <Link href={`/listings/${id}/edit`}>
                            <button onClick={()=> setLoading(true)} className={styles.editbtn}>Edit</button>
                        </Link>
                        }
                        <br/>
                        {currentUser && currentUser.uid == authorid && available &&
                        <Link href={`/listings/${id}/edit`}>
                            <button onClick={()=> setLoading(true)} className={styles.availablebtn}>Status: Available</button>
                        </Link>
                        }
                        {currentUser && currentUser.uid == authorid && !available &&
                        <Link href={`/listings/${id}/edit`}>
                            <button onClick={()=> setLoading(true)} className={styles.editbtn}>Status: Not Available</button>
                        </Link>
                        }
                        
                        {/* <p>Sponsored</p> */}
                    </div>
                </div>
            </div>
    );
}

export default ListingItem;