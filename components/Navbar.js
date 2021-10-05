import Link from 'next/link';
import styles from './Navbar.module.scss';
import React, {useState} from 'react';
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
                <div className={styles.container}>
                    <Link href='/'><a className={styles.title}>Student Housing Hub</a></Link>
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={showNav} viewBox="0 0 512 512"><title>Menu</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 160h352M80 256h352M80 352h352"/></svg>
                    <div onClick={hideNav} className={seeThroughToggle}>
                    </div>
                    <nav className={navToggler}>
                        <svg xmlns="http://www.w3.org/2000/svg" onClick={hideNav} viewBox="0 0 512 512"><title>Close</title><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/></svg>                        <ul className={styles.ulList}>
                            <Link href='/'><li>Home</li></Link>
                            <Link href='/listings'><li>Rentals</li></Link>
                            <Link href='/contact'><li>Contact</li></Link>
                            {currentUser ? 
                                <Link href='/my-account'><li className={styles.myprofilebtn}>My Profile</li></Link>
                            : <Link href="/login"><li className={styles.loginbtn}>Login</li></Link>}
                        </ul>
                    </nav>
                </div>
            </div>
    );
}

export default Navbar;