import React, { useEffect } from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import { Link, matchPath } from 'react-router-dom'
import { NavbarLinks } from "../../data/navbar-links"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AiOutlineMenu,AiOutlineClose, AiOutlineShoppingCart } from "react-icons/ai"
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
import { useState } from 'react'
import { ACCOUNT_TYPE } from "../../utils/constants"
import { IoIosArrowDropdownCircle } from "react-icons/io"


function Navbar() {

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation();
  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
 

  const fetchSublinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      setSubLinks(result.data.data);
    }
    catch (error) {
      console.log("Could not fetch the category list", error);
    }
  }
  useEffect(() => {
    setLoading(true);
    fetchSublinks();
    setLoading(false);
  }, [])

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  }

  return (
    <div className={`shadow fixed top-0 left-0 z-50 w-full bg-richblack-900  border border-b-richblack-400 ${location.pathname !== "/" ? "bg-richblack-800" : ""
      } `}>

      <div className='md:flex w-11/12 max-w-maxContent item-center justify-between py-2 md:px-0 px-7 mx-auto '>

        {/* Image */}
        <Link to="/">
          <img src={logo} width={160} height={42} loading='lazy' alt='navbarLogo' />
        </Link>
        <button className="text-3xl absolute right-8 top-4 cursor-pointer md:hidden" onClick={() => setOpen(!open)} >
          {/* <   name={open ? 'close' : 'menu'} /> */}
          {open?<AiOutlineClose fontSize={24} fill="#AFB2BF"/>:<AiOutlineMenu fontSize={24} fill="#AFB2BF"/>}
        </button>
        <ul className={`md:flex gap-x-6 md:item-center md:pb-0 pb-12 absolute md:static bg-richblack-900 text-richblack-25 md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-12 transition-all duration-500 ease-in ${open ? 'top-12 opacity-100' : 'top-[-490px]'} md:opacity-100 opacity-0`}>
          {
            NavbarLinks.map((link, index) => (
              <li key={index} className='pt-2'> 
                {
                  link.title === "Catalog" ? (
                    <div className={`group relative flex cursor-pointer  items-center  justify-between ${matchRoute("/catalog/:catalogName")
                      ? "text-yellow-25"
                      : "text-richblack-25"
                      }`}>
                      <p>{link.title}</p>
                      <span className='nav-catalog-circle'><IoIosArrowDropdownCircle /></span>
                      <div className='invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px] catalog-item-box'>
                        <div className='absolute left-[50%] top-0
                                translate-x-[80%]
                                translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5'>
                        </div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.length ? (
                          <>
                            {subLinks
                              ?.map((subLink, i) => (
                               
                                <Link 
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-3 pl-4 hover:bg-richblack-50 "
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Link to={link?.path} >
                      <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25 "}`}>
                        {link.title}
                      </p>
                    </Link>
                  )
                }
              </li>
            ))
          }
          <div className='gap-x-4 items-center md:flex nav-btn'>
            {
              user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                <Link to="/dashboard/cart" className='relative text-white'>
                  <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                  {
                    totalItems > 0 && (
                      <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                        {totalItems}
                      </span>
                    )
                  }
                </Link>
              )
            }
            {
              token === null && (
                <Link to="/login">
                  <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                    Log in
                  </button>
                </Link>
              )
            }
            {
              token === null && (
                <Link to="/signup">
                  <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md nav-btn-gap'>
                    Sign Up
                  </button>
                </Link>
              )
            }
            {
              token !== null && <ProfileDropDown />
            }
          </div>
        </ul>



      </div>

    </div>
  )
}

export default Navbar