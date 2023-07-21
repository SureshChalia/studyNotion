import React from 'react'

const HighlightText = ({text}) => {
  return (
    <span className='font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400  to-sky-500'>
     {" "}
     {text} 
    </span>
  )
}

export default HighlightText