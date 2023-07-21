import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const RequirementField = ({name, label, register, errors, setValue, getValues}) => {
    const { editCourse, course } = useSelector((state) => state.course)
    const [requirement, setRequirement] = useState("");
    const [requirementList, setRequirementList] = useState([]);


    useEffect(()=> {
        if (editCourse) {
            setRequirementList(course?.instructions)
          }
          register(name, { required: true, validate: (value) => value.length > 0 })
          // eslint-disable-next-line react-hooks/exhaustive-deps
    },[name,register])

    useEffect(()=> {
        setValue(name, requirementList);
    },[name,setValue,requirementList])

    const handleAddRequirement = () => {
        if(requirement) {
            setRequirementList([...requirementList, requirement]);
            setRequirement("");
        }
    }

    const handleRemoveRequirement = (index) => {
        const updatedRequirementList = [...requirementList];
        updatedRequirementList.splice(index, 1);
        setRequirementList(updatedRequirementList);
    }

  return (
    <div className="flex flex-col space-y-2">

        <label htmlFor={name} className='text-richblack-5 text-sm'>{label}<sup>*</sup></label>
        <div>
            <input
                type='text'
                id={name}
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                className='w-full rounded h-8'
            />
            <button
            type='button'
            onClick={handleAddRequirement}
            className='font-semibold text-yellow-50 mt-2'>
                Add
            </button>
        </div>

        {
            requirementList.length > 0 && (
                <ul>
                    {
                        requirementList.map((requirement, index) => (
                            <li key={index} className='flex items-center text-richblack-5 gap-2'>
                                <span>{requirement}</span>
                                <button
                                type='button'
                                onClick={() => handleRemoveRequirement(index)}
                                className='text-xs text-pure-greys-300'>
                                    clear
                                </button>
                            </li>
                        ))
                    }
                </ul>
            )
        }
        {errors[name] && (
            <span>
                {label} is required
            </span>
        )}
      
    </div>
  )
}

export default RequirementField