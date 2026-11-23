import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux'; 

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
    const {allJobs} = useSelector(store=>store.job);
    const safeAllJobs = Array.isArray(allJobs) ? allJobs : [];
   
    return (
        <section className='mx-auto max-w-7xl px-4 py-16'>
            <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F83002]">Fresh opportunities</p>
                    <h2 className='mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl'>
                        <span className='text-[#6A38C2]'>Latest & Top</span> Job Openings
                    </h2>
                </div>
            </div>
            <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
                {
                    safeAllJobs.length <= 0 ? <div className="col-span-full rounded-2xl border border-dashed border-purple-200 bg-white py-16 text-center text-slate-500">No jobs available right now.</div> : safeAllJobs.slice(0,6).filter(Boolean).map((job) => <LatestJobCards key={job._id} job={job}/>)
                }
            </div>
        </section>
    )
}

export default LatestJobs