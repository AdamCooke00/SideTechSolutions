import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link';
import Head from "next/head"
export default function HomePage(){
  return (
    <main className="entire-page">
      <Head>
        <title>Student Housing Hub</title>
      </Head>
      <Navbar/>
      <div className="page-portion">
        <section className='left-section'>
          <p className="title-subheading">By Students, For Students</p>
          <h1 className="title-heading">A Simpler Way<span>To Find Housing</span><span>For Students.</span></h1>
          <div className='button-wrapper'>
            <Link href='/listings'><button className='title-button'>Find A House</button></Link>
          </div>
        </section>
        <section id="final-section">
          <h2 className="title-heading">A Landlord<span>Looking To List A</span><span>Student House ?</span></h2>
          <div className='button-wrapper'>
            <Link href='/new-listing'><button className='title-button'>List A House</button></Link>
          </div>
        </section>
        <p className="mobile-application">Mobile Application Coming Soon!</p>
      </div>
      <Footer/>
    </main>
  ) 
}