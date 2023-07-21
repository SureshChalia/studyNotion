import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import Coursecard from '../components/core/Catalog/Coursecard';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { useSelector } from "react-redux"
import Error from "./Error"

const Catalog = () => {

    const { loading } = useSelector((state) => state.profile)
    const {catalogName} = useParams();
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    //Fetch all categories
    useEffect(()=> {
        const getCategories = async() => {
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            const category_id = 
            res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            setCategoryId(category_id);
            // console.log("category id",category_id);
        }
        getCategories();
    },[catalogName]);

    useEffect(() => {
        const getCategoryDetails = async() => {
            try{
                const res = await getCatalogaPageData(categoryId);
                // console.log("Printing res: ", res);
                setCatalogPageData(res);
            }
            catch(error) {
                console.log(error)
            }
        }
        if(categoryId) {
            getCategoryDetails();
        }
        
    },[categoryId]);

    
    if (loading || !catalogPageData) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }
      if (!loading && !catalogPageData.success) {
        return <Error />
      }
    

  return (
    <div className='text-white flex flex-col gap-y-5'>

       <div className=' bg-richblack-800 w-full pl-[10.4%] pr-[10.4%]'>
         <div className='flex flex-col gap-2 pt-4 pb-4 mt-8  11/12 mx-auto'>
            <p className='text-richblack-400 space-x-1'>{`Home / Catalog /`}
            <span className='text-yellow-50 ml-1'>
                {catalogPageData?.data?.selectedCategory?.name}
            </span></p>
            <p className='text-richblack-5 text-3xl'> {catalogPageData?.data?.selectedCategory?.name} </p>
            <p className='text-richblack-400'> {catalogPageData?.data?.selectedCategory?.description}</p>
        </div>
       </div>

        <div className='w-full pl-[10.4%] pr-[10.4%]'>
            {/* section1 */}
            <div className='pt-4 pb-4 mt-8  11/12 mx-auto'>
            <div className='text-richblack-5 text-3xl mb-4'>Courses to get you started</div>
                {/* <div className=' flex gap-x-3'>
                    <p>Most Popular</p>
                    <p>New</p>
                </div> */}
                {/* <hr  className='mb-2'/> */}
                <div>
                    <CourseSlider Courses={catalogPageData?.data?.selectedCategory?.courses} />
                </div>
            </div>  

            {/* section2 */}
            <div>
            <div className='text-richblack-5 text-3xl mb-4 mt-4'>Top Courses in {catalogPageData?.data?.selectedCategory?.name}</div>
                <div>
                    <CourseSlider Courses={catalogPageData?.data?.differentCategory?.courses}/>
                </div>
            </div>

            {/* section3 */}
            <div>
                <div className='text-richblack-5 text-3xl  mt-4'>Frequently Bought Courses</div>
                <div className='py-8'>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>

                        {
                            catalogPageData?.data?.mostSellingCourses?.slice(0,4)
                            .map((course, index) => (
                                <Coursecard course={course} key={index} Height={"h-[400px]"}/>
                            ))
                        }

                    </div>

                </div>
            </div>

        </div>
    <Footer />
    </div>
  )
}

export default Catalog
