import { collection, getDocs, limit, orderBy, query, startAfter, where } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { db } from '../firebase.config';
import { ImSpinner8 } from "react-icons/im"
import ListingItem from '../components/ListingItem';
import Button from '../components/layout/Button';

function Category() {
    const params = useParams();
    const [data, setData] = useState({listings: null, loading: true})
    const [lastFetchedListing, setLastFetchedListing] = useState(null)
    useEffect(()=>{
        const fetchListings = async () => {
            try {
                const colRef = collection(db, "listings")
                const q = query(colRef, where("type", "==", params.categoryName), orderBy("timestamp", "desc"), limit(5))
                const querySnap = await getDocs(q)
                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastFetchedListing(lastVisible)
                const listings = []
                querySnap.forEach(doc => {
                    listings.push({id: doc.id, data: doc.data()})
                })
                setData({ listings: listings, loading: false })
            } catch(error) {
                toast.error("Could not fetch listings!")
            }
        }
        fetchListings();
    }, [params.categoryName])
    const fetchMoreListings = async () => {
        try {
            const colRef = collection(db, "listings")
            const q = query(colRef, where("type", "==", params.categoryName), orderBy("timestamp", "desc"), startAfter(lastFetchedListing), limit(5))
            const querySnap = await getDocs(q)
            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedListing(lastVisible)
            const listings = []
            querySnap.forEach(doc => {
                listings.push({id: doc.id, data: doc.data()})
            })
            setData(prevState => ({ listings: [ ...prevState.listings, ...listings ], loading: false }))
        } catch(error) {
            toast.info("No more listings")
        }
    }
    return (
        <div className='container flex flex-col'>
            <div className="text-5xl mb-12">Places for {params.categoryName}</div>
            {data.loading ? <ImSpinner8 className="animate-spin text-lg" /> : (
                <>
                    <div className="w-full">
                        {(!data.listings || data.listings.length === 0) ? <p>No listings for {params.categoryName}!</p> : 
                        data.listings.map(listing => <ListingItem key={listing.id} listing={listing.data} id={listing.id} />)}    
                    </div>
                    <button onClick={fetchMoreListings} className='w-fit h-fit mx-auto px-3 py-1 bg-slate-700 rounded-xl text-white font-light hover:bg-slate-600 active:bg-slate-700 duration-100'>
                        Load more
                    </button>
                </>
            )}
        </div>
    )
}

export default Category