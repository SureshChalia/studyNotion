import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import IconBtn from '../../common/IconBtn'
import { RiEditBoxLine } from "react-icons/ri"

const MyProfile = () => {

    const { user } = useSelector((state) => state.profile)
    const navigate = useNavigate();
    return (
        <div className='text-white bg-richblack-900   max-w-maxContent '>

            <h1 className='mb-14 text-3xl font-medium text-richblack-5'>
                My Profile
            </h1>

            {/* section 1 */}
            <div className='flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12'>
                <div className="flex items-center gap-x-4">
                    <img
                        src={user?.image}
                        alt={`profile-${user?.firstName}`}
                        className='aspect-square w-[78px] rounded-full object-cover' />
                    <div className='space-y-1'>
                        <p className="text-lg font-semibold text-richblack-5"> {user?.firstName + " " + user?.lastName} </p>
                        <p className="text-sm text-richblack-300"> {user?.email}</p>
                    </div>
                </div>
                    <IconBtn
                        text="Edit"
                        onclick={() => {
                            navigate("/dashboard/settings")
                        }}

                    >
                        <RiEditBoxLine />
                    </IconBtn>
                    
            </div>

            {/* section 2 */}
            <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                <div className="flex w-full items-center justify-between">
                    <p className="text-lg font-semibold text-richblack-5">About</p>
                        <IconBtn
                            text="Edit"
                            onclick={() => {
                                navigate("/dashboard/settings")
                            }}

                        >
                               <RiEditBoxLine />
                        </IconBtn>
                </div>
                <p> {user?.additionalDetails?.about ?? "Write Something about Yourself"}</p>
            </div>

            {/* section 3 */}
            <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
                <div className="flex w-full items-center justify-between">
                    <p className="text-lg font-semibold text-richblack-5">Additional Details</p>
                        <IconBtn
                            text="Edit"
                            onclick={() => {
                                navigate("/dashboard/settings")
                            }}

                        >
                            <RiEditBoxLine />
                        </IconBtn>
                </div>
                <div className='flex gap-16'>
                    <div>
                        <div className='mb-3'>
                            <p className='text-richblack-300'>First Name</p>
                            <p>{user?.firstName}</p>
                        </div>
                        <div className='mb-3'>
                            <p className='text-richblack-300'>Email</p>
                            <p>{user?.email}</p>
                        </div>
                        <div className='mb-3'>
                            <p className='text-richblack-300'>Gender</p>
                            <p>{user?.additionalDetails?.gender ?? "Add Gender"}</p>
                        </div>
                    </div>
                    <div>
                        <div className='mb-3'>
                            <p className='text-richblack-300'>Last Name</p>
                            <p>{user?.lastName}</p>
                        </div>
                        <div className='mb-3'>
                            <p className='text-richblack-300'>Phone Number</p>
                            <p>{user?.additionalDetails?.contactNumber ?? "Add Contact Number"}</p>
                        </div>
                        <div className='mb-3'>
                            <p className='text-richblack-300'>Date of Birth</p>
                            <p>{user?.additionalDetails?.dateOfBirth ?? "Add Date of Birth"}</p>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default MyProfile
