import {useRouter} from "next/router"
import Link from "next/link"

export default function Listing(props) {
    const router = useRouter()
    const {id} = router.query;
    return (
        <div>
            <Link href="/">
                <a>Back to listings</a>
            </Link>
            <h1>A listing of {id}</h1>
        </div>
    );
}