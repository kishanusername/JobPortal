import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const safeAllJobs = Array.isArray(allJobs) ? allJobs : [];
    const safeQuery = typeof searchedQuery === "string" ? searchedQuery : "";
    const [filterJobs, setFilterJobs] = useState(safeAllJobs);

    useEffect(() => {
        if (safeQuery) {
            const filteredJobs = safeAllJobs.filter((job) => {
                if (!job) return false;
                const query = safeQuery.toLowerCase();
                const baseMatch = job.title?.toLowerCase().includes(query) ||
                    job.description?.toLowerCase().includes(query) ||
                    job.location?.toLowerCase().includes(query);

                if (query === "0-40k") {
                    return Number(job.salary) <= 40000;
                }
                if (query === "42-1lakh") {
                    return Number(job.salary) >= 42000 && Number(job.salary) <= 100000;
                }
                return baseMatch;
            })
            setFilterJobs(filteredJobs)
        } else {
            setFilterJobs(safeAllJobs)
        }
    }, [allJobs, safeQuery]);

    return (
        <div>
            <Navbar />
            <main className='min-h-[calc(100vh-4rem)] bg-slate-50 py-8'>
                <div className='mx-auto max-w-7xl px-4'>
                    <div className='mb-7 rounded-3xl border border-purple-100 bg-gradient-to-r from-white to-purple-50 p-6 shadow-sm'>
                        <p className='text-sm font-bold uppercase tracking-[0.18em] text-[#F83002]'>Explore jobs</p>
                        <h1 className='mt-1 text-3xl font-black text-slate-950'>Find your next opportunity</h1>
                    </div>
                    <div className='flex flex-col gap-5 lg:flex-row'>
                        <aside className='w-full lg:w-64 lg:shrink-0'>
                            <FilterCard />
                        </aside>
                        {filterJobs.length <= 0 ? (
                            <div className='flex min-h-72 flex-1 items-center justify-center rounded-3xl border border-dashed border-purple-200 bg-white text-slate-500'>
                                No matching jobs found.
                            </div>
                        ) : (
                            <div className='flex-1 pb-5'>
                                <div className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3'>
                                    {filterJobs.map((job) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: 100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ duration: 0.3 }}
                                            key={job?._id}
                                        >
                                            <Job job={job} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Jobs