import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore'
import {useState, useEffect} from 'react'
import { Carousel } from "react-responsive-carousel"
import styles from 'react-responsive-carousel/lib/styles/carousel.css'
import { toast } from 'react-toastify'
import { db } from '../firebase.config'
import { ImSpinner8 } from "react-icons/im"
import { Link } from 'react-router-dom'

function Slider() {
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)
    useEffect(() => {
        const fetchListings = async () => {
            try {
                let listingData = [] 
                const q = query(collection(db, "listings"), orderBy("timestamp", "desc"), limit(5))
                const querySnap = await getDocs(q)
                querySnap.forEach((doc) => {
                    listingData.push({ id: doc.id, data: doc.data() })
                })
                setListings(listingData)
            } catch(error) {
                toast.error("Could not load slider")
            }
            setLoading(false)
        }
        fetchListings()
    }, [])
    return loading ? <ImSpinner8 className="animate-spin text-lg" /> : (
        <>
            <Carousel showArrows={true} showStatus={false} showThumbs={false} emulateTouch={true} infiniteLoop={true} autoPlay={true}>
                {listings.map((listing) => (
                    <Link to={`/${listing.id}`} className="overflow-hidden" key={listing.id}>
                        <img src={listing.data.imgUrls[0]} className="w-full h-72 object-cover duration-300 hover:scale-105" />
                        <div className='legend flex justify-center'>
                            {listing.data.location}
                        </div>
                        <div className={`absolute text-white top-5 left-5 text-sm font-light rounded-md px-2 ${listing.data.type === "rent" ? "bg-yellow-500" : "bg-green-500"}`}>
                            {listing.data.type.charAt(0).toUpperCase()+listing.data.type.slice(1)}
                        </div>
                    </Link>
                ))}
            </Carousel>
        </>
    )
}

export default Slider