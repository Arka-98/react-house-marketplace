import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { db } from '../firebase.config'
import { ImSpinner8 } from "react-icons/im"

function Contact() {
    const params = useParams()
    const [loading, setLoading] = useState(true)
    const [landlord, setLandlord] = useState(null)
    const [message, setMessage] = useState("")
    const [searchParams, setSearchParams] = useSearchParams()
    useEffect(()=>{
        const fetchUser = async () => {
            try {
                const docRef = doc(db, "users", params.landlordId)
                const user = await getDoc(docRef)
                if(user.exists()) {
                    setLandlord(user.data())
                } else {
                    throw new Error("Landlord not found")
                }
            } catch (error) {
                toast.error("Something went wrong - "+error)
            }
            setLoading(false)
        }
        fetchUser()
    }, [params.landlordId])
    return loading ? <ImSpinner8 className="animate-spin text-lg" /> : (
        <div className='flex flex-col gap-10'>
            <div className="text-5xl">Contact Landlord</div>
            <div className="text-2xl font-medium">Contact {landlord.username}</div>
            <textarea name="message" value={message} onChange={e=>setMessage(e.target.value)} placeholder={`Send a message to ${landlord.username}`}
            className="p-3 rounded-lg h-28" />
            <a href={`mailto:${landlord.email}?Subject=${searchParams.get("listingName")}&body=${message}`} className="w-fit px-10 py-2 mx-auto font-normal bg-green-500 hover:bg-green-600 active:bg-green-700 duration-200 text-white rounded-xl">
                Send message
            </a>
        </div>
    )
}

export default Contact