import React from 'react'

import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { Autoplay,FreeMode,Navigation, Pagination}  from 'swiper'
import Coursecard from './Coursecard'


const CourseSlider = ({Courses}) => {
  return (
    <>
        {
            Courses?.length ? (
                <Swiper
                    slidesPerView={1}
                    loop={true}
                    spaceBetween={20}
                    pagination={true}
                    FreeMode={true}
                    modules={[Autoplay,Pagination,Navigation]}
                    className="mySwiper"
                    autoplay={{
                    delay: 1500,
                    disableOnInteraction: false,
                    }}
                    navigation={true}
                    breakpoints={{
                        1024:{slidesPerView:2,}
                    }}
                >
                    {
                        Courses?.map((course, index)=> (
                            <SwiperSlide key={index}>
                                <Coursecard course={course} Height={"h-[250px]"} />
                            </SwiperSlide>
                        ))
                    }   
                </Swiper>
            ) : (
                <p>No Course Found</p>
            )

        }
    </>
  )
}

export default CourseSlider
