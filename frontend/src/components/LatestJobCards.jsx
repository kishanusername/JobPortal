import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={()=> navigate(`/description/${job._id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") navigate(`/description/${job._id}`);
            }}
            className='group flex min-h-[230px] cursor-pointer flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-purple-200 hover:shadow-[0_20px_45px_rgba(106,56,194,0.14)] focus:outline-none focus:ring-2 focus:ring-purple-300'
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-orange-50 text-lg font-black text-[#6A38C2]">
                    {job?.company?.name?.charAt(0)?.toUpperCase() || "J"}
                </div>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">Actively hiring</span>
            </div>
            <div className="mt-5">
                <p className='text-sm font-semibold text-slate-500'>{job?.company?.name}</p>
                <h3 className='mt-1 text-xl font-bold text-slate-950 group-hover:text-[#6A38C2]'>{job?.title}</h3>
                <p className='mt-2 line-clamp-2 text-sm leading-6 text-slate-600'>{job?.description}</p>
            </div>
            <div className='mt-auto flex flex-wrap items-center gap-2 pt-5'>
                <Badge className={'rounded-full bg-blue-50 px-3 py-1 text-blue-700'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'rounded-full bg-orange-50 px-3 py-1 text-[#F83002]'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'rounded-full bg-purple-50 px-3 py-1 text-[#7209b7]'} variant="ghost">{job?.salary} LPA</Badge>
            </div>

        </div>
    )
}

export default LatestJobCards