import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

function PageLayout() {
  return (
    <div className="bg-gray-100 font-bold overflow-y-scroll h-screen">
        <div className="px-6 pt-6 pb-32">
            <Outlet/>
        </div>
        <Navbar/>
    </div>
  )
}

export default PageLayout