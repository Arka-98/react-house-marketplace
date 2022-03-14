import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from "react"
import { ImSpinner8 } from "react-icons/im"
import { useNavigate, useParams } from "react-router-dom";
import { MdClose, MdInfo } from "react-icons/md"
import { toast } from "react-toastify";
import {v4 as uuidv4} from "uuid";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "../firebase.config"
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";

function EditListing() {
    const auth = getAuth();
    const params = useParams()
    const navigate = useNavigate();
    const [isDisabled, setIsDisabled] = useState(true)
    const [errors, setErrors] = useState({
        name: false, 
        location: false, 
        regularPrice: false, 
        discountedPrice: false,
        bedrooms: false,
        bathrooms: false,
        imgUrls: null
    })
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true)
    const [formData, setFormData] = useState(null)
    const isMounted = useRef(true);
    const inputRef = useRef();
    useEffect(()=>{
        if(formData && formData.userRef!==auth.currentUser.uid) {
            navigate("/profile")
            toast.warn("You cannot edit that listing")
        }
    })
    useEffect(()=>{
        const fetchListing = async () => {
            try {
                const docRef = doc(db, "listings", params.listingId)
                const docSnap = await getDoc(docRef)
                if(docSnap.exists()) {
                    setFormData(docSnap.data())
                } else {
                    throw new Error("Listing does not exist")
                }
            } catch(error) {
                toast.error("Could not fetch data - "+error)
            }
            setPageLoading(false)
        }
        fetchListing()
    }, [])
    useEffect(()=>{
        setIsDisabled(isError())
        if(isMounted.current) {
            onAuthStateChanged(auth, user => {
                if(!user) {
                    navigate("/sign-in")
                }
            })
        }
        return () => {
            isMounted.current = false;
        }
    }, [isMounted, errors])
    const isError = () => {
        for(let i in errors) {
            if(errors[i] || errors[i] === null) {
                return true
            }
        }
        return false
    }
    const removeImages = () => {
        inputRef.current.value = ""
        setErrors({ ...errors, imgUrls: true })
    }
    const handleChange = (e) => {
        const {name, type, id, value, files, nodeName} = e.target
        let boolean = null;
        if(value === "true") {
            boolean = true
        }
        if(value === "false") {
            boolean = false
        }
        if(name === "offer" && !boolean) {
            setFormData({ ...formData, discountedPrice: 0 })
            setErrors({ ...errors, discountedPrice: false })
        } else if(name === "offer" && boolean) {
            if(formData.discountedPrice === "") {
                setErrors({ ...errors, discountedPrice: true })
            }
        }
        if(nodeName === "INPUT" || nodeName === "TEXTAREA") {
            setErrors(prevData => ({
                ...prevData,
                [name]: (value && value !== "0") ? false : true
            }))
        }
        setFormData(prevData => ({
            ...prevData,
            [name]: boolean !== null ? boolean : files ? files : value
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.offer && (parseInt(formData.discountedPrice) >= parseInt(formData.regularPrice))) {
            toast.error("Discounted price should be lower than regular price")
            return
        }
        if(formData.imgUrls.length > 6) {
            toast.error("Maximum of 6 images can be uploaded")
            return
        }
        let geolocation = {}
        let location
        setLoading(true)
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${formData.location}&key=${process.env.REACT_APP_GEOCODING_API_KEY}`)
        const data = await response.json()
        if(data.status === "ZERO_RESULTS") {
            setLoading(false)
            toast.error("Please enter correct location")
            return
        }
        geolocation.lat = data.results[0].geometry.location.lat ?? 0
        geolocation.lng = data.results[0].geometry.location.lng ?? 0
        location = data.results[0].formatted_address
        const storeImage = async (image) => {
            return new Promise((resolve, reject) => {
                const storage = getStorage()
                const fileName = `${auth.currentUser.displayName}-${image.name}-${uuidv4()}`
                const storageRef = ref(storage, "images/"+fileName)
                const uploadTask = uploadBytesResumable(storageRef, image)
                uploadTask.on("state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        }
                    }, 
                    (error) => {
                        reject(error)
                    }, 
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                )
            })
        }
        const imgUrls = await Promise.all(
            [ ...formData.imgUrls ].map((image) => storeImage(image))
        ).catch((error) => {
            setLoading(false)
            toast.error("Failed to upload ERROR - "+error)
            return
        })
        const listingData = { 
            ...formData,
            geolocation,
            location,
            imgUrls,
            timestamp: serverTimestamp()
        }
        console.log(listingData)
        try {
            const docRef = doc(db, "listings", params.listingId)
            await updateDoc(docRef, listingData)
            navigate(`/${params.listingId}`)
            toast.success("Listing updated")
        } catch (error) {
            console.log(error)
            toast.error("Error updating listing - "+error)
            setLoading(false)
        }
    }
    return pageLoading ? <ImSpinner8 className="animate-spin text-2xl mx-auto" /> : (
        <div className="container">
            <div className="text-5xl mb-4">Edit your Listing</div>
            <div className="text-sm font-light underline mb-8">All fields are mandatory</div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <label>Sale / Rent</label>
                <div className="flex flex-row gap-2">
                    <button type="button" name="type" value="sale" onClick={handleChange} className={`w-fit h-fit px-8 py-2 rounded-xl bg-white duration-100 hover:bg-green-500 hover:text-white active:bg-green-600 ${formData.type === "sale" && "activeButton"}`}>Sale</button>
                    <button type="button" name="type" value="rent" onClick={handleChange} className={`w-fit h-fit px-8 py-2 rounded-xl bg-white duration-100 hover:bg-green-500 hover:text-white active:bg-green-600 ${formData.type === "rent" && "activeButton"}`}>Rent</button>
                </div>
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter a name" className="w-96 px-3 py-2 rounded-xl" />
                {errors.name && <span className="flex items-center text-red-500"><MdInfo className="mr-2" />Please enter a name</span>}
                <label>Location</label>
                <div className="text-xs font-light underline">Location cannot be changed</div>
                <textarea type="text" name="location" disabled={true} value={formData.location} onChange={handleChange} placeholder="Enter location" className="w-96 px-3 py-2 rounded-xl disabled:bg-slate-300" />
                {errors.location && <span className="flex items-center text-red-500"><MdInfo className="mr-2" />Please enter a location</span>}
                <div className="flex gap-10">
                    <div className="flex flex-col gap-2">
                        <label>Bedrooms</label>
                        <input type="number" name="bedrooms" value={formData.bedrooms} min="1" max="50" onChange={handleChange} className="w-11 py-1 pl-2 rounded-lg" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label>Bathrooms</label>
                        <input type="number" name="bathrooms" value={formData.bathrooms} min="1" max="50" onChange={handleChange} className="w-11 py-1 pl-2 rounded-lg" />
                    </div>
                </div>
                {(errors.bathrooms || errors.bedrooms) && <span className="flex items-center text-red-500"><MdInfo className="mr-2" />At least 1 bathroom and 1 bedroom is required</span>}
                <label>Furnished</label>
                <div className="flex flex-row gap-2">
                    <button type="button" name="furnished" value={true} onClick={handleChange} className={`w-fit h-fit px-8 py-2 rounded-xl bg-white duration-100 hover:bg-green-500 hover:text-white active:bg-green-600 ${formData.furnished && "activeButton"}`}>Yes</button>
                    <button type="button" name="furnished" value={false} onClick={handleChange} className={`w-fit h-fit px-8 py-2 rounded-xl bg-white duration-100 hover:bg-green-500 hover:text-white active:bg-green-600 ${!formData.furnished && "activeButton"}`}>No</button>
                </div>
                <label>Parking</label>
                <div className="flex flex-row gap-2">
                    <button type="button" name="parking" value={true} onClick={handleChange} className={`w-fit h-fit px-8 py-2 rounded-xl bg-white duration-100 hover:bg-green-500 hover:text-white active:bg-green-600 ${formData.parking && "activeButton"}`}>Yes</button>
                    <button type="button" name="parking" value={false} onClick={handleChange} className={`w-fit h-fit px-8 py-2 rounded-xl bg-white duration-100 hover:bg-green-500 hover:text-white active:bg-green-600 ${!formData.parking && "activeButton"}`}>No</button>
                </div>
                <label>Offer</label>
                <div className="flex flex-row gap-2">
                    <button type="button" name="offer" value={true} onClick={handleChange} className={`w-fit h-fit px-8 py-2 rounded-xl bg-white duration-100 hover:bg-green-500 hover:text-white active:bg-green-600 ${formData.offer && "activeButton"}`}>Yes</button>
                    <button type="button" name="offer" value={false} onClick={handleChange} className={`w-fit h-fit px-8 py-2 rounded-xl bg-white duration-100 hover:bg-green-500 hover:text-white active:bg-green-600 ${!formData.offer && "activeButton"}`}>No</button>
                </div>
                <div className="flex flex-col gap-3">
                    <label>Regular price</label>
                    <div className="flex gap-3 items-center">
                        <input type="number" name="regularPrice" value={formData.regularPrice} onChange={handleChange} placeholder="Enter regular amount" className="w-48 px-3 py-2 rounded-xl" />
                        {formData.type === "rent" && <label>$ / Month</label>}
                    </div>
                </div>
                {errors.regularPrice && <span className="flex items-center text-red-500"><MdInfo className="mr-2" />Please enter a price</span>}
                {formData.offer && (
                        <>
                            <div className="flex flex-col gap-3">
                                <label>Discounted price</label>
                                <div className="flex gap-3 items-center">
                                    <input type="number" name="discountedPrice" value={formData.discountedPrice} onChange={handleChange} placeholder="Enter discounted amount" className="w-48 px-3 py-2 rounded-xl" />
                                    {formData.type === "rent" && <label>$ / Month</label>}
                                </div>
                            </div>
                            {errors.discountedPrice && <span className="flex items-center text-red-500"><MdInfo className="mr-2" />Please enter a price</span>}
                        </>
                    )
                }
                <div className="flex flex-col gap-3">
                    <label>Images</label>
                    <ul className="text-xs font-light">
                        <li>1. The first image will be the cover (max 6)</li>
                        <li>2. Maximum upload size is 2MB (including all images)</li>
                    </ul>
                    <div className="relative w-fit h-fit">
                        <input type="file" name="imgUrls" ref={inputRef} onChange={handleChange} max="6" accept=".jpg,.png,.jpeg" multiple className="w-80 pl-3 py-3 pr-12 rounded-xl bg-white file:mr-4 file:bg-green-500 file:text-white file:px-2 file:border-0 file:rounded-full file:duration-100 active:file:bg-green-700 hover:file:bg-green-600" />
                        <MdClose className="text-2xl absolute right-3 bottom-3 text-red-500 hover:text-red-600 hover:cursor-pointer" onClick={removeImages} />
                    </div>
                </div>
                {errors.imgUrls && <span className="flex items-center text-red-500"><MdInfo className="mr-2" />At least 1 image is required</span>}
                <button type="submit" disabled={isDisabled} className="w-1/2 py-2 mx-auto bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl disabled:bg-green-300">
                    {loading ? <ImSpinner8 className="animate-spin text-2xl mx-auto" /> : <span>Create Listing</span>}
                </button>
            </form>
        </div>
    )
}

export default EditListing