import Link from 'next/link';
import styles from './Footer.module.scss';
import React from 'react';
function Footer() {
    return (
            <div className={styles.footer}>
                <div className={styles.links}>
                    <Link href='/about'><a>About</a></Link>
                    <Link href='/safety'><a>Safety</a></Link>
                </div>
                <p className={styles.contactParagraph}><Link href='/contact'><a>Require Assistance? Contact Us.</a></Link></p>
                <p className={styles.slogan}>Made By Students, For Students.</p>
                <p className={styles.trademark}>Student Housing Hub 2021.</p>
            </div>
    );
}

export default Footer;