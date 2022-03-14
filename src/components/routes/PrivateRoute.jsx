import React from 'react'
import { Outlet, Navigate } from "react-router-dom"
import { useAuthStatus } from '../hooks/useAuthStatus';
import { ImSpinner8 } from "react-icons/im"

function PrivateRoute() {
    const { loggedIn, checkingStatus } = useAuthStatus();
    if(checkingStatus) {
        return (<ImSpinner8 className='animate-spin text-3xl mx-auto'/>)
    }
    return loggedIn ? <Outlet/> : <Navigate to="/sign-in"/>
}

export default PrivateRoute;