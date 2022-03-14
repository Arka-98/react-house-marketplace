import { MdOutlineBed, MdOutlineBathtub, MdDelete, MdEdit } from "react-icons/md"
import { Link } from "react-router-dom"
import PropTypes from 'prop-types'

function ListingItem({listing, id, edit, onDelete}) {
    return (
        <div to={`/${id}`} className="flex relative mb-8 p-3 hover:bg-slate-300 active:bg-slate-400 rounded-3xl duration-100">
            <Link to={`/${id}`} className="flex relative justify-start gap-10 grow">
                <img src={listing.imgUrls[0]} alt={listing.name} className="rounded-3xl w-full object-cover h-40" />
                <div className="flex flex-col justify-around w-full">
                    <p className="font-light">{listing.location}</p>
                    <p className="text-xl font-semibold">{listing.name}</p>
                    <div className="whitespace-nowrap text-lg">
                        {listing.offer ? 
                            <span className="flex items-center gap-2">
                                <p className="text-sm line-through opacity-60">${listing.regularPrice} {listing.type === "rent" && "/ Month"}</p>
                                <p className="text-green-500">${listing.discountedPrice} {listing.type === "rent" && "/ Month"}</p>
                            </span> : 
                            <span>${listing.regularPrice} {listing.type === "rent" && "/ Month"}</span>
                        }
                    </div>
                    <div className="flex flex-row justify-start gap-16">
                        <div className="flex flex-row items-center gap-3">
                            <MdOutlineBed className="text-xl"/>
                            <p>{listing.bedrooms} Bedrooms</p>
                        </div>
                        <div className="flex flex-row items-center gap-3">
                            <MdOutlineBathtub className="text-xl"/>
                            <p>{listing.bathrooms} Bathrooms</p>
                        </div>
                    </div>
                </div>
            </Link>
            {onDelete && 
                <button onClick={onDelete} className="absolute w-fit p-1 rounded-full top-2 right-5 duration-100 text-red-500 text-xl hover:bg-slate-200 active:bg-slate-400">
                    <MdDelete />
                </button>
            }
            {edit && 
                <Link to={`/edit-listing/${id}`} className="absolute w-fit p-1 rounded-full top-10 right-5 duration-100 text-black text-xl hover:bg-slate-200 active:bg-slate-400">
                    <MdEdit />
                </Link>
            }
        </div>
    )
}
ListingItem.defaultProps = {
    onDelete: null,
    edit: null
}
ListingItem.propTypes = {
    listing: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    onDelete: PropTypes.func,
    edit: PropTypes.bool
}

export default ListingItem