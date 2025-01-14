import React from 'react'
import HighlightText from '../HomePage/HighlightText'
import {ImQuotesLeft,ImQuotesRight} from "react-icons/im";

const Quote = () => {
  return (
    <div className='text-xl md:text-4xl font-semibold mx-auto py-5 pb-20 text-center text-white w-[76%] '>
      <ImQuotesLeft className='text-richblack-600 translate-y-4'/>
      We are passionate about revolutionizing the way we learn. Our innovative platform
      <HighlightText text={"combines technology,"}/>
      <span className='bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold'>
        {" "}
        expertise
      </span>
      , and community to create an 
      <span  className='bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold relative'>
      {" "}
        unparalleled educational experience.
       <ImQuotesRight className='text-richblack-600 absolute -right-7 top-10'/>
      </span>
    </div>
  )
}

export default Quote
