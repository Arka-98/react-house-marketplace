import React from 'react'
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg"
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg"
import { Link } from "react-router-dom"
import Slider from '../components/Slider'

function Home() {
  return (
    <div className="w-full">
      <div className='text-5xl mb-12'>Explore</div>
      <div className="flex flex-col gap-6">
        <div className="text-xl">Recommended</div>
        <Slider/>
        <div className="text-xl">Categories</div>
        <div className="flex justify-between gap-20">
          <Link to="/category/rent" className='flex-col grow'>
              <div className="overflow-hidden rounded-3xl">
                <img src={rentCategoryImage} alt="rent" className='w-full h-15vw object-cover duration-300 hover:scale-105 hover:blur-sm' />
              </div>
              <p>Places for rent</p>
          </Link>
          <Link to="/category/sale" className="flex-col grow">
              <div className="overflow-hidden rounded-3xl">
                <img src={sellCategoryImage} alt="sell" className='w-full h-15vw object-cover duration-300 hover:scale-105 hover:blur-sm' />
              </div>
              <p>Places for sale</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home;