import Link from 'next/link';
import styles from './Navbar.module.scss';
import React, {useState} from 'react';
import Script from 'next/script';
import {useAuth} from "../context/AuthContext"

function Navbar() {

    const {currentUser} = useAuth()
    const [navToggler, setNavToggler] = useState(styles.navhide)
    const [seeThroughToggle, setSeeThroughToggle] = useState(styles.hidetransparent)


    function showNav(){
        setNavToggler(styles.navdisplay);
        setSeeThroughToggle(styles.transparentexitclicker);
    }
    function hideNav(){
        setNavToggler(styles.navhide);
        setSeeThroughToggle(styles.hidetransparent);
    }

    return (
            <div className={styles.navbar}>
                <Script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"/>
                <Script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"/> 
                <div className={styles.container}>
                    <Link href='/'><a className={styles.title}>Student Housing Hub</a></Link>
                    <ion-icon onClick={showNav} name="menu-outline"/>
                    <div onClick={hideNav} className={seeThroughToggle}>

                    </div>
                    <nav className={navToggler}>
                        <ul className={styles.ulList}>
                            <Link href='/'><li>Home</li></Link>
                            <Link href='/listings'><li>Rentals</li></Link>
                            <Link href='/contact'><li>Contact</li></Link>
                            {currentUser ? 
                                <Link href='/my-account'><li className={styles.myprofilebtn}>My Profile</li></Link>
                            : <Link href="/login"><li className={styles.loginbtn}>Login</li></Link>}
                        </ul>
                        <ion-icon onClick={hideNav} name="close-outline"/>
                    </nav>
                </div>
            </div>
    );
}

export default Navbar;