import {useRouter} from "next/router"
import Link from "next/link"
import {db} from "../../config/firebase-config"

export default function Listing({data}) {
    return (
        //TODO: Make this look good
        <div>
            <Link href="/">
                <a>Back to listings</a>
            </Link>
            <h1>A listing of {data.address}</h1>
            <p># of Bedrooms: {data.bedroomCount}</p>
            <p>Monthy Rent: ${data.price} or ${parseInt(data.price/data.bedroomCount)} per person</p>
            <p>Landlord: {data.author_uid}</p>

        </div>
    );
}

export async function getServerSideProps({params: {id}}) {
    const doc = await db.collection('listing').doc(id).get()
    //TODO: get who the landlord is from the author uid on the doc.data object and send their username instead of the authoruid
    if (doc.exists) {
        return {
            props: {
                data: doc.data()
            }
        }
    }
    return {
      props: {}, // will be passed to the page component as props
    }
}