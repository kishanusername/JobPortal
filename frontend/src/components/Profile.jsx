import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './shared/Navbar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, MapPin, GraduationCap, Briefcase, ExternalLink, Download } from 'lucide-react'
import { Badge } from './ui/badge'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === "recruiter") {
            navigate("/recruiter/profile", { replace: true });
        }
    }, [navigate, user?.role]);

    useEffect(() => {
        if (window.location.hash === "#applied-jobs") {
            window.requestAnimationFrame(() => {
                document.getElementById("applied-jobs")?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
        }
    }, []);

    return (
        <div>
            <Navbar />
            <div className='min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#f7f5ff] to-white py-8'>
            <div className='max-w-5xl mx-auto overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-[0_18px_50px_rgba(106,56,194,0.10)]'>
                <div className='h-32 bg-gradient-to-r from-[#24124f] via-[#6A38C2] to-[#F83002]' />
                <div className='px-8 pb-8'>
                <div className='flex justify-between'>
                    <div className='flex items-end gap-5'>
                        <Avatar className="-mt-12 h-28 w-28 border-4 border-white shadow-xl">
                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                            <AvatarFallback className="bg-gradient-to-br from-[#6A38C2] to-[#F83002] text-2xl font-bold text-white">
                                {user?.fullname?.split(" ").filter(Boolean).slice(0, 2).map((name) => name[0]?.toUpperCase()).join("") || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className='pb-2'>
                            <h1 className='font-bold text-2xl text-gray-900'>{user?.fullname}</h1>
                            {user?.profile?.location && <p className='mt-1 flex items-center text-sm text-gray-500'><MapPin className='mr-1 h-4 w-4' />{user.profile.location}</p>}
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen /></Button>
                </div>
                {user?.profile?.bio && <p className='mt-4 max-w-3xl text-sm leading-6 text-gray-600'>{user.profile.bio}</p>}
                <div className='mt-5 grid gap-3 sm:grid-cols-2'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail className="h-4 w-4 text-[#6A38C2]" />
                        <span className="text-sm">{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact className="h-4 w-4 text-[#6A38C2]" />
                        <span className="text-sm">{user?.phoneNumber}</span>
                    </div>
                </div>
                <div className='mt-6 grid gap-4 md:grid-cols-3'>
                    <div className='rounded-xl border bg-gray-50 p-4'>
                        <p className='flex items-center text-xs font-bold uppercase text-gray-500'><GraduationCap className='mr-2 h-4 w-4' />Education</p>
                        <p className='mt-2 font-semibold'>{user?.profile?.course || "Course not added"}</p>
                        <p className='text-sm text-gray-600'>{user?.profile?.college || "College not added"}</p>
                        {user?.profile?.graduationYear && <p className='text-sm text-gray-500'>Graduated {user.profile.graduationYear}</p>}
                    </div>
                    <div className='rounded-xl border bg-gray-50 p-4'>
                        <p className='text-xs font-bold uppercase text-gray-500'>Academic Score</p>
                        <p className='mt-2 text-lg font-bold'>{user?.profile?.cgpa ? `${user.profile.cgpa} CGPA` : user?.profile?.percentage ? `${user.profile.percentage}%` : "Not added"}</p>
                    </div>
                    <div className='rounded-xl border bg-gray-50 p-4'>
                        <p className='flex items-center text-xs font-bold uppercase text-gray-500'><Briefcase className='mr-2 h-4 w-4' />Experience</p>
                        <p className='mt-2 font-semibold'>{user?.profile?.experience || "Fresher"}</p>
                    </div>
                </div>
                <div className='mt-6'>
                    <h2 className='font-bold'>Skills</h2>
                    <div className='mt-2 flex flex-wrap items-center gap-2'>
                        {
                            user?.profile?.skills?.length ? user.profile.skills.map((item, index) => <Badge key={index}>{item}</Badge>) : <span className="text-sm text-gray-500">No skills added</span>
                        }
                    </div>
                </div>
                <div className='mt-6 flex flex-wrap items-center gap-3'>
                    {user?.profile?.resume && (
                        <a href={user.profile.resume} target="_blank" rel="noreferrer" className='flex items-center gap-2 rounded-lg bg-[#6A38C2] px-4 py-2 text-sm font-semibold text-white shadow-md'>
                            <Download className='h-4 w-4' /> Download Resume
                        </a>
                    )}
                    {user?.profile?.linkedin && <a href={user.profile.linkedin} target="_blank" rel="noreferrer" className='flex items-center gap-2 text-sm font-semibold text-[#6A38C2]'><ExternalLink className='h-4 w-4' />LinkedIn</a>}
                    {user?.profile?.portfolio && <a href={user.profile.portfolio} target="_blank" rel="noreferrer" className='flex items-center gap-2 text-sm font-semibold text-[#6A38C2]'><ExternalLink className='h-4 w-4' />Portfolio</a>}
                </div>
            </div>
            </div>
            </div>
            <div id="applied-jobs" className='max-w-5xl mx-auto rounded-2xl bg-white py-2 scroll-mt-24'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                {/* Applied Job Table   */}
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile