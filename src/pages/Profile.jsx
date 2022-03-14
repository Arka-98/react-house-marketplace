import React, { useEffect, useRef, useState } from 'react'
import { getAuth } from 'firebase/auth';
import Button from '../components/layout/Button';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfile, updateEmail } from 'firebase/auth';
import { updateDoc, doc, getDoc, query, collection, where, orderBy, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import { ImSpinner8 } from 'react-icons/im';
import { MdHome, MdKeyboardArrowRight, MdOutlineMode } from "react-icons/md"
import ListingItem from '../components/ListingItem';

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
    loading: false
  });
  const isMounted = useRef(true)
  useEffect(()=>{
    if(isMounted.current) {
      fetchListings()
    }
    return ()=> {
      isMounted.current = false
    }
  }, [isMounted])
  const fetchListings = async () => {
    try{
      let listingsData = []
      const q = query(collection(db, "listings"), where("userRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc"))
      const querySnap = await getDocs(q)
      querySnap.forEach((doc) => {
        listingsData.push({id: doc.id, data: doc.data()})
      })
      setListings(listingsData)
    } catch(error) {
      toast.error("Could not load listings")
    }
    setLoading(false)
  }
  const handleInput = (e) => {
    const {name, value} = e.target;
    setFormData(prevInput => ({
      ...prevInput,
      [name]: value
    }))
  }
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "listings", id))
      setLoading(true)
      fetchListings()
      toast.error("Deleted listing")
    } catch (error) {
      toast.error("Could not delete listing")
    }
  }
  const handleLogout = () => {
    auth.signOut();
    navigate("/");
    console.log("end of logout");
  }
  const handleSubmit = async (e) => {
    if(formData.name === "" || formData.email === "") {
      toast.error("Please enter all the fields!");
      return;
    }
    try {
      if(auth.currentUser.displayName!==formData.name || auth.currentUser.email!==formData.email) {
        setFormData(prevData => ({ ...prevData, loading: true }))
        await updateProfile(auth.currentUser, {displayName: formData.name})
        await updateEmail(auth.currentUser, formData.email)
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, { username: formData.name, email: formData.email })
        setFormData({
          name: auth.currentUser.displayName,
          email: auth.currentUser.email,
          loading: false
        });
        toast.success("Details updated successfully!")
      }
    } catch(error) {
      console.log(error);
      toast.error("Could not update details!")
    }
    setEdit(prevState=>!prevState);
  }
  return (
    <div className="container">
      <div className="flex items-center justify-between mb-12">
        <div className="text-5xl">My Profile</div>
        <Button customClickEvent={handleLogout}>Logout</Button>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="text-xl">Personal Details</div>
          {formData.loading ? <ImSpinner8 className="animate-spin text-lg text-green-500" /> : edit ? <button className='text-lg text-green-500' onClick={handleSubmit}>done</button> :
          <button className='text-lg text-green-500 flex items-center' onClick={()=>setEdit(prevState=>!prevState)}><MdOutlineMode/>change</button>}
        </div>
        <div className="flex flex-col gap-2 rounded-xl p-5 bg-white font-medium">
            {edit ? 
              <>
                <input type="text" name='name' value={formData.name} onChange={handleInput} placeholder="Enter new username" className='text-black bg-gray-100' />
                <input type="text" name='email' value={formData.email} onChange={handleInput} placeholder="Enter new email" className='text-black bg-gray-100' />
              </> :
              <>
                <div>{formData.name}</div>
                <div>{formData.email}</div>
              </>
            }
        </div>
        <Link to="/create-listing" className='w-full bg-white rounded-xl flex justify-between items-center p-2.5 my-4 font-semibold duration-200 hover:bg-green-500 hover:text-white'>
          <MdHome className='text-lg' />
          <p>Sell \ Rent your house</p>
          <MdKeyboardArrowRight className='text-lg' />
        </Link>
        <div className="text-xl">My Listings</div>
        {loading ? <ImSpinner8 className="animate-spin text-lg" /> : (!listings || listings.length === 0) ? <div>No listings found!</div> :
          listings.map((listing) => <ListingItem key={listing.id} listing={listing.data} id={listing.id} onDelete={()=>handleDelete(listing.id)} edit={true} />)
        }
      </div>
    </div>
  )
}

export default Profile;