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
            <div className='max-w-7xl mx-auto mt-5'>
                <div className='flex gap-5'>
                    <div className='w-20%'>
                        <FilterCard />
                    </div>
                    {
                        filterJobs.length <= 0 ? <span>Job not found</span> : (
                            <div className='flex-1 h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: 100 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -100 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}>
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>


        </div>
    )
}

export default Jobs