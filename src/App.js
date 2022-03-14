import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Offers from "./pages/Offers";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from "./components/routes/PrivateRoute";
import Category from "./pages/Category";
import CreateListing from "./pages/CreateListing";
import Listing from "./pages/Listing";
import Contact from "./pages/Contact";
import EditListing from "./pages/EditListing";

function App() {
  return (
    <>
      <Router>
        <div className="bg-gray-100 font-bold overflow-y-scroll h-screen">
          <div className="px-6 pt-6 pb-32">
            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/profile" element={<PrivateRoute/>}>
                <Route path="/profile" element={<Profile/>}/>
              </Route>
              <Route path="/category/:categoryName" element={<Category/>} />
              <Route path="/:listingId" element={<Listing/>} />
              {/* <Route path="/offers/:listingId" element={<Listing/>} />
              <Route path="/profile/:listingId" element={<Listing/>} /> */}
              <Route path="/contact/:landlordId" element={<Contact/>} />
              <Route path="/sign-in" element={<SignIn/>} />
              <Route path="/offers" element={<Offers/>} />
              <Route path="/forgot-password" element={<ForgotPassword/>} />
              <Route path="/sign-up" element={<Register/>} />
              <Route path="/create-listing" element={<CreateListing/>} />
              <Route path="/edit-listing/:listingId" element={<EditListing/>} />
            </Routes>
          </div>
          <Navbar/>
        </div>
      </Router>
      <ToastContainer/>
    </>
  );
}

export default App;
