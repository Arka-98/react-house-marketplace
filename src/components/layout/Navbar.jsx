import { BsPerson } from "react-icons/bs"
import { MdOutlineLocalOffer, MdOutlineExplore, MdOutlinePersonOutline } from "react-icons/md"
import { Link, useLocation } from "react-router-dom";

function Navbar() {
    const location = useLocation();
    const routeMatch = (route) => {
        if(route === location.pathname){
            return true;
        }
        return false;
    }
    return (
        <nav className="flex items-center py-4 px-20 z-50 justify-between fixed bottom-0 w-full h-min bg-white">
            <Link to="/">
                <div className={`flex flex-col ${!routeMatch("/") && "text-gray-400"} hover:text-green-500`}>
                    <MdOutlineExplore className="text-3xl mx-auto"/>
                    <p>Explore</p>
                </div>
            </Link>
            <Link to="offers">
                <div className={`flex flex-col ${!routeMatch("/offers") && "text-gray-400"} hover:text-green-500`}>
                    <MdOutlineLocalOffer className="text-3xl mx-auto"/>
                    <p>Offers</p>
                </div>
            </Link>
            <Link to="profile">
                <div className={`flex flex-col ${!routeMatch("/profile") && "text-gray-400"} hover:text-green-500`}>
                    <MdOutlinePersonOutline className="text-3xl mx-auto"/>
                    <p>Profile</p>
                </div>
            </Link>
        </nav>
    )
}

export default Navbar;