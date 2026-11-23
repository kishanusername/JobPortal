import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { setSavedJobs, toggleSavedJob } from '@/redux/jobSlice'

const Job = ({job}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const { savedJobs = [] } = useSelector(store => store.job);
    const [savedInitialized, setSavedInitialized] = useState(false);
    const isSaved = Array.isArray(savedJobs) && savedJobs.includes(job?._id);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem("savedJobs") || "[]");
            if (Array.isArray(stored)) dispatch(setSavedJobs(stored));
        } catch {
            localStorage.removeItem("savedJobs");
        }
        setSavedInitialized(true);
    }, [dispatch]);

    useEffect(() => {
        if (savedInitialized && Array.isArray(savedJobs)) {
            localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
        }
    }, [savedInitialized, savedJobs]);

    const toggleSaveHandler = () => {
        if (!user) {
            toast.error("Please login to save jobs.");
            navigate("/login");
            return;
        }
        dispatch(toggleSavedJob(job._id));
        toast.success(isSaved ? "Removed from saved jobs." : "Job saved for later.");
    };

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }

    if (!job) return null;
    
    return (
        <div className='group min-h-[260px] p-5 rounded-2xl shadow-[0_10px_35px_rgba(15,23,42,0.06)] bg-white border border-slate-100 transition-all duration-300 ease-out hover:-translate-y-2 hover:border-purple-200 hover:shadow-[0_22px_45px_rgba(106,56,194,0.16)]'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
                <Button
                    onClick={toggleSaveHandler}
                    variant="outline"
                    className={`rounded-full ${isSaved ? "bg-[#7209b7] text-white" : ""}`}
                    size="icon"
                    aria-label={isSaved ? "Remove saved job" : "Save job"}
                >
                    <Bookmark fill={isSaved ? "currentColor" : "none"} />
                </Button>
            </div>

            <div className='flex items-center gap-3 my-4'>
                <Button className="h-14 w-14 rounded-2xl p-2" variant="outline" size="icon">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={job?.company?.logo} className="object-contain" />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>India</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}LPA</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button onClick={()=> navigate(`/description/${job?._id}`)} variant="outline">Details</Button>
                <Button onClick={toggleSaveHandler} className="bg-[#7209b7]">
                    {isSaved ? "Saved" : "Save For Later"}
                </Button>
            </div>
        </div>
    )
}

export default Job