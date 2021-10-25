import Head from "next/head"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function Contact() {
    return (
      <div className="entire-page">
        <Head>
          <title>Student Housing Hub Contact</title>
        </Head>
        <Navbar/>
        <div className="contactuspage">
          <h1 className="contactustitle">Contact Us!</h1>
          <div className="contactusnotice">
            <h4 className="contactusimportant">IMPORTANT</h4>
            <p>All messages must be regarding the Student Housing Hub Platform.</p>
            <p> Our single responsibility is creating a platform that helps students and landlords find
            student housing and student tenants, respectively.
            </p>
            <p>We are not liable or responsible for any conflict arising between Landlord and Tenant.</p>
            <p>Thank you.</p>
          </div>
          
          <div className="contactuslandlords">
            <h3 className="contactuslandlordtitle">For Landlords</h3>
            <p>Having an issue uploading your rental, updatings its information, changing its status to sold, or anything else?<br/>Email us!</p>
            <a className="contactusemailaddress" href="mailto:landlord@studenthousinghub.ca">landlord@studenthousinghub.ca</a>
            <p>Messages must be regarding an issue/request on the Student Housing Hub platform.</p>
          </div>

          <div className="contactusstudents">
            <h3 className="contactusstudenttitle">For Students</h3>
            <p>Having an issue with your account, or have any ideas you would like to see added to the platform?<br/>Email us!</p>
            <a className="contactusemailaddress" href="mailto:student@studenthousinghub.ca">student@studenthousinghub.ca</a>
            <p>Please leave a detailed message and we will get back to you as soon as possible.</p>
          </div>

          <div className="contactusreportabug">
            <h3 className="contactusbugtitle">Report A Bug!</h3>
            <p>Found a bug on our platform?<br/>Email us!</p>
            <a className="contactusemailaddress" href="mailto:bug@studenthousinghub.ca">bug@studenthousinghub.ca</a>
            <p>If possible, please leave a detailed explanation of the problem and how to recreate it.</p>
          </div>
        </div>
        <Footer/>
      </div>
    )
  }
  