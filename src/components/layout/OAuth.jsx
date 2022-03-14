import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "../../firebase.config";
import { useLocation, useNavigate } from "react-router-dom";
import googleIcon from "../../assets/svg/googleIcon.svg"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

function OAuth() {
    const location = useLocation();
    const navigate = useNavigate();
    const handleClick = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const docSnap = await getDoc(doc(db, "users", user.uid))
            if(!docSnap.exists()) {
                await setDoc(doc(db, "users", user.uid), {
                    username: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            navigate("/profile");
        } catch(error) {
            toast.error("Could not authenticate with Google!")
        }
    }
    return (
        <div className="flex flex-col justify-between items-center my-5 h-36 font-light">
            <p className="mx-auto">Or</p>
            <p className="mx-auto">Sign {location.pathname === "/sign-in" ? "in" : "up"} with</p>
            <div onClick={handleClick} className="rounded-full shadow-black shadow-2xl p-3 mx-auto hover:bg-slate-200 hover:cursor-pointer duration-100">
                <img src={googleIcon} alt="Google" className="w-6 h-6" />
            </div>
        </div>
    )
}

export default OAuth;