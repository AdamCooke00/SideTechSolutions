import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Script from 'next/script';
import Link from 'next/link';

function HomePage(){
  return (
    <div className="entire-page">
      <Navbar/>
      <div className="page-portion">
        <section className='left-section'>
          <p className="title-subheading">By Students, For Students</p>
          <h2 className="title-heading">A Simpler Way<span>To Find Housing</span><span>For Students.</span></h2>
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

    </div>
  ) 
}
export default HomePage