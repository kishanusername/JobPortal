import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';

// const randomJobs = [1, 2,45];

const Browse = () => {
    useGetAllJobs();
    const {allJobs} = useSelector(store=>store.job);
    const safeAllJobs = Array.isArray(allJobs) ? allJobs : [];
    const dispatch = useDispatch();
    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    },[])
    return (
        <div>
            <Navbar />
            <div className='min-h-[calc(100vh-4rem)] bg-slate-50 pb-16'>
                <div className='border-b border-purple-100 bg-gradient-to-r from-[#24124f] to-[#6A38C2] py-12 text-white'>
                    <div className='mx-auto max-w-7xl px-4'>
                        <p className='text-sm font-bold uppercase tracking-[0.2em] text-purple-200'>Discover opportunities</p>
                        <h1 className='mt-2 text-3xl font-black md:text-4xl'>Search Results <span className='text-purple-200'>({safeAllJobs.length})</span></h1>
                    </div>
                </div>
                <div className='mx-auto -mt-6 max-w-7xl px-4'>
                <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
                    {
                        safeAllJobs.map((job) => {
                            return (
                                <Job key={job._id} job={job}/>
                            )
                        })
                    }
                </div>
                </div>
            </div>
        </div>
    )
}

export default Browse