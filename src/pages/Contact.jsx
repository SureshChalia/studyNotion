import React from 'react'
import ContactDetail from '../components/ContactPage/ContactDetail'
import ContactUsForm from '../components/ContactPage/ContactUsForm'
import ReviewSlider from '../components/common/ReviewSlider'



const Contact = () => {
  return (
    <div className=''>
      <div className="mx-auto mt-20 flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-white lg:flex-row">
        <div className="lg:w-[40%]">
          <ContactDetail />
        </div>
        <div className="lg:w-[60%] border border-richblack-500 rounded-xl p-16">
          <h1 className="text-left text-4xl font-semibold">
            Got a Idea? We’ve got the skills. Let’s team up
          </h1>
          <p className="text-left text-richblack-300 mt-3">
            Tall us more about yourself and what you’re got in mind.
          </p>
          <div className='mt-10'>
            <ContactUsForm />
          </div>
        </div>
      </div>
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>
    </div>
  )
}

export default Contact