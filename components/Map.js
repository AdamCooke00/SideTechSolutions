import React, { useEffect } from 'react';
import styles from './Map.module.scss';
import mapboxgl from 'mapbox-gl'
function Map() {

    useEffect(()=>{
        const map = new mapboxgl.Map({
            accessToken: process.env.NEXT_PUBLIC_MAPBOX_API_KEY,
            container: 'my-map', // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [-76.49969214262658,44.232862554261798], // starting position [lng, lat]
            zoom: 13 // starting zoom
        })
        map.on('load', function () {
            map.resize();
        });
    }, [])
    
    return (
        <div id='my-map' className={styles.map}/>
    );
}

export default Map;