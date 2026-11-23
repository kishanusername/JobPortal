import React, { useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { Button } from './ui/button'

const fitlerData = [
    {
        fitlerType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        fitlerType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        fitlerType: "Salary",
        array: ["0-40k", "42-1lakh"]
    },
]

const FilterCard = () => {
    const { searchedQuery } = useSelector(store => store.job);
    const [selectedValue, setSelectedValue] = useState(typeof searchedQuery === "string" ? searchedQuery : '');
    const dispatch = useDispatch();
    const changeHandler = (value) => {
        setSelectedValue(value);
        dispatch(setSearchedQuery(value));
    }
    const clearHandler = () => {
        setSelectedValue('');
        dispatch(setSearchedQuery(''));
    };
    return (
        <div className='w-full bg-white p-4 rounded-lg border border-gray-100 shadow-md'>
            <div className="flex items-center justify-between">
                <h1 className='font-bold text-lg'>Filter Jobs</h1>
                {selectedValue && (
                    <Button type="button" variant="link" className="h-auto p-0" onClick={clearHandler}>
                        Clear
                    </Button>
                )}
            </div>
            <hr className='mt-3' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {
                    fitlerData.map((data, index) => (
                        <div key={data.fitlerType} className="py-2">
                            <h1 className='font-bold text-base mb-2'>{data.fitlerType}</h1>
                            <div className="max-h-28 overflow-y-auto pr-2 rounded-md">
                                {
                                    data.array.map((item, idx) => {
                                        const itemId = `id${index}-${idx}`
                                        return (
                                            <div key={itemId} className='flex items-center space-x-2 my-2'>
                                                <RadioGroupItem value={item} id={itemId} />
                                                <Label htmlFor={itemId}>{item}</Label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    ))
                }
            </RadioGroup>
        </div>
    )
}

export default FilterCard