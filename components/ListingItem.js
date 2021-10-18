import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styles from './ListingItem.module.scss';
import {useAuth} from "../context/AuthContext"
import { storage } from '../config/firebase-config';
function ListingItem({address, id, price, bedrooms, bathrooms, available, authorid}) {
    const {currentUser} = useAuth();
    const [imgUrl, setImgUrl] = useState('');
    const [loading, setLoading] = useState(false)

    useEffect(async () => {
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
                    <p className={styles.landlord}>Property Company</p>
                    <div className={styles.houseinfo}>
                        <div className={styles.bedbath}>
                            <p>Beds: {bedrooms}</p>
                            <p>Baths: {bathrooms}</p>
                        </div>
                        <div className={styles.pricediv}>
                            <p><span className={styles.price}>${parseInt(price/bedrooms)}</span><span className={styles.permonth}>/month per person</span></p>
                            <p className={styles.totalprice}><span className={styles.price}>${price}</span><span className={styles.permonth}>/month total</span></p>
                        </div>
                        {loading && <div class="loader"></div>}
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