import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase.config"
import { getAuth } from "firebase/auth"
import { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { ImSpinner8 } from "react-icons/im"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Carousel } from "react-responsive-carousel"
import styles from 'react-responsive-carousel/lib/styles/carousel.css'

function Listing() {
    const auth = getAuth() 
    const params = useParams()
    const imgTest = "https://firebasestorage.googleapis.com/v0/b/house-marketplace-app-a197f.appspot.com/o/images%2FJohn%20Doe-exterior_4.jpeg-699d281c-48ae-45f5-97f8-7628cdb5c6ba?alt=media&token=90de2054-c882-4e45-bbdd-c0207888ade7"
    const isMounted = useRef(true)
    const [loading, setLoading] = useState(true)
    const [listing, setListing] = useState({
        name: "",
        type: "",
        furnished: null,
        parking: null,
        imgUrls: null,
        bedrooms: "",
        bathrooms: "",
        location: "",
        offer: null,
        regularPrice: "",
        discountedPrice: "",
        geolocation: null,
        userRef: null
    })
    const {
        name,
        type,
        furnished,
        parking,
        imgUrls,
        bedrooms,
        bathrooms,
        location,
        offer,
        regularPrice,
        discountedPrice,
        geolocation,
        userRef
    } = listing
    useEffect(() => {
        if(isMounted.current) {
            const fetchListing = async () => {
                try {
                    const docRef = doc(db, "listings", params.listingId)
                    const docSnap = await getDoc(docRef)
                    if(docSnap.exists()) {
                        setListing(docSnap.data())
                    } else {
                        throw new Error("Listing does not exist")
                    }
                } catch(error) {
                    toast.error("Could not fetch data - "+error)
                }
                setLoading(false)
            }
            fetchListing()
        }
        return () => {
            isMounted.current = false
        }
    }, [isMounted, params.listingId])
    return loading ? <ImSpinner8 className="animate-spin text-lg" /> : (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <Carousel showArrows={true} showStatus={false} showThumbs={false} emulateTouch={true} infiniteLoop={true} autoPlay={true}>
                    {imgUrls.map((url, index) => (
                        <div className="overflow-hidden" key={index}>
                            <img src={url} className="w-full h-72 object-cover duration-300 hover:scale-105" />
                        </div>
                    ))}
                </Carousel>
                <div className="text-5xl">{name} - ${offer ? discountedPrice : regularPrice}</div>
                <div className="text-lg">{location}</div>
                <div className="flex flex-row gap-2">
                    <p className="bg-yellow-500 w-fit h-fit text-white text-sm font-light rounded-md px-2">For {type}</p>
                    {offer &&
                        <p className="bg-green-500 w-fit h-fit text-white text-sm font-light rounded-md px-2">${regularPrice - discountedPrice} discount</p>
                    }
                </div>
                <div className="text-sm font-normal">{bedrooms} {bedrooms !== 1 ? "Bedrooms" : "Bedroom"}</div>
                <div className="text-sm font-normal">{bathrooms} {bathrooms !== 1 ? "Bathrooms" : "Bathroom"}</div>
                {parking && <div className="text-sm font-normal">Parking spot</div>}
                {furnished && <div className="text-sm font-normal">Furnished</div>}
            </div>
            <div className="text-2xl font-semibold">Location</div>
            <div className="w-full h-52 overflow-hidden rounded-xl z-0">
                <MapContainer className="w-full h-full" center={[geolocation.lat, geolocation.lng]} zoom={13}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[geolocation.lat, geolocation.lng]}>
                        <Popup>
                            {location}
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
            {auth.currentUser?.uid !== userRef &&
                <Link to={`/contact/${userRef}?listingName=${name}`} className="w-fit px-10 py-2 mx-auto bg-green-500 hover:bg-green-600 active:bg-green-700 duration-200 text-white rounded-xl">
                    Contact landlord
                </Link>
            }
        </div>
    )
}

export default Listing