import React from 'react'
import HighlightText from "../components/core/HomePage/HighlightText"
import BannerImage1 from "../assets/Images/aboutus1.webp"
import BannerImage2 from "../assets/Images/aboutus2.webp"
import BannerImage3 from "../assets/Images/aboutus3.webp"
import Quote from '../components/core/AboutPage/Quote'
import FoundingStory from "../assets/Images/FoundingStory.png"
import StatsComponent from '../components/core/AboutPage/Stats'
import LearningGrid from '../components/core/AboutPage/LearningGrid'
import ContactFormSection from '../components/core/AboutPage/ContactFormSection'
import Footer from '../components/common/Footer'
import ReviewSlider from '../components/common/ReviewSlider'

const About = () => {
  return (
    <div className='mx-auto text-white '>
      <div className='bg-richblack-800'>
      <p className='text-center text-richblack-100 pt-20'>About Us</p>
      {/* section 1 */}
      <section className='flex flex-col items-center mt-16 '>
        <div className='relative'>
            <header className='mb-[13%]'>
            <h1 className='text-4xl lg:w-[40%] text-center ml-[29%]'>Driving Innovation in Online Education for a 
                <HighlightText text={"Brighter Future"}/></h1>
                <p className='text-richblack-100 w-[47%] mt-7 text-[16px] ml-[27%] text-center font-medium'>Studynotion is at the forefront of driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.</p>
            </header>
            <div className='flex lg:flex-row gap-7 ml-48 absolute -translate-y-44'>
                <img src={BannerImage1} alt='img1' />
                <img src={BannerImage2} alt='img2' />
                <img src={BannerImage3} alt='img3' />
            </div>
        </div>
      </section>
      </div>

      {/* section 2 */}

      <section>
        <div className='mt-56'>
            <Quote/>
            <hr className='text-richblack-100 mt-16'/>
        </div>
      </section>


      {/* section 3 */}

      <section>
        <div className='flex flex-col w-11/12 gap-36 mt-36'>
            {/* foudning story wala div */}
            <div className='flex ml-[13%] gap-28'>
                {/* founding story left box */}
                <div className='w-[50%]'>
                    <h1 className='bg-gradient-to-b from-[#833AB4] via-red to-[#F09819] text-transparent bg-clip-text font-bold text-[36px]'>Our Founding Story</h1>
                    <p className='text-[16px] text-richblack-300'>Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.</p>
                    <br />
                    <p className='text-[16px] text-richblack-300'>As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.</p>
                </div>
                {/* foudning story right box */}
                <div className='w-[50%]'>
                    <img  src={FoundingStory} alt='img4' />
                </div>
            </div>

            {/* vision and mission wala parent div */}
            <div className='flex ml-[13%] gap-28'>
                {/* left box */}
                <div className='w-[50%]'>
                    <h1 className='bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold text-[36px]'>Our Vision</h1>
                    <p className='text-[16px] text-richblack-300'>With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.</p>
                </div>

                {/* right box */}
                <div className='w-[50%]'>
                    <h1 className='font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400  to-sky-500 text-[36px]'>
                        Our Mission
                    </h1>
                    <p className='text-[16px] text-richblack-300'>Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.</p>
                </div>
            </div>
        </div>
      </section>  

      {/* section 4 */}
      <StatsComponent/>  
      
      {/* section 5 */}
      <section className='mx-auto flex flex-col items-center justify-between gap-5 mb-[140px] mt-36'>
        <LearningGrid />
        <div className='mt-16'><ContactFormSection/></div>
      </section>

      <section>
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>
      </section>

      <Footer/>

    </div>
  )
}

export default About
