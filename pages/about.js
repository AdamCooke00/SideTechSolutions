import Head from "next/head"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function About() {

  return (
    <div className="entire-page">
      <Head>
        <title>Student Housing Hub About</title>
      </Head>
      <Navbar/>
      <div className="aboutpage">
        <h1 className="aboutpagetitle">About Student Housing Hub</h1>
        <div className="aboutpageparagraphs">
          <p>The goal of Student Housing Hub is to be an all-in-one platform through which landlords can list their rentals and students can filter through them and reach out
            to the landlord easier.</p>
          <p>I am currently a Queen's University student and have had first-hand experience in the difficulties of the student housing hunt.</p>
          <p>Currently, finding the right house as a student is difficult as there are not many ways to filter listings. Add on the time commitment school is with the time it takes
            to find the right place to live, one can become stressed very quickly. Student Housing Hub aims to decrease the amount of time and stress finding a house takes and causes.</p>
          <p>For this 2021-2022 school year, Student Housing Hub's goal is to produce an Alpha version of the platform. This version aims to allow landlords to post potential rentals,
            and allows students to filter through these rentals with the intention of reaching out to the landlord of the unit they wish to rent.</p>
          <p>In time, Student Housing Hub aims to add an ease of communication feature that allows communicating through the platform and an accompanying mobile application.</p>
          <p>The target for this Alpha Version will be Queen's University in Kingston, Ontario.</p>
        </div>
      </div>
      <Footer/>
    </div>
  )
}
