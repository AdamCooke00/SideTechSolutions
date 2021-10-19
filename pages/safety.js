import Head from "next/head"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Link from "next/link"

export default function Safety() {

  return (
    <div className="entire-page">
      <Head>
        <title>Student Housing Hub</title>
      </Head>
      <Navbar/>
      <div className="aboutpage">
        <h1 className="aboutpagetitle">Safety</h1>
        <div className="aboutpageparagraphs">
          <p>Safety is crucial when it comes to finding a place to live, especially as a student. Even though you may be new to ownership and renting, its imperative to understand that
            you are not allowed to be taken advantage of.</p>
          <p>Student Housing Hub has outlined below a list of things to consider <strong>BEFORE</strong> signing a rental unit.</p>
          <ul>
            <li>Is the property up to code? When touring make sure you ask the landlord about anything you see that seems unsafe or hazardous.</li>
            <li>If you are able to, get into contact with the previous tenants. Ask them if there is anything you should know before signing.</li>
            <li>Do your due diligence and search for reviews on your potential landlord. Landlords are not your friend and do not always have your best interests in mind.</li>
            <li><strong>READ THE LEASE AGGREMENT.</strong> It may be long and tedious, but you only need to do it once. It is common to find mistakes in the lease that need
            to be fixed before you sign. Also, you will now know what you can and cannot due per the aggrement.</li>
          </ul>
          <p>*Student Housing Hub is not responsible for any conflict that may arise between landlord and tenant.*</p>
          <p>This page will be updated through time as seen fit to equip students with more tools to assist them in safely finding a rental.</p>
          <p>Consult the <Link href="/contact"><strong>CONTACT PAGE</strong></Link> for an questions or inquires.</p>
        </div>
      </div>
      <Footer/>
    </div>
  )
}
