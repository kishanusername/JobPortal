import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
    Briefcase, Building2, CalendarDays, MapPin, Users,
    ExternalLink, Clock3, IndianRupee, Upload, CheckCircle2
} from 'lucide-react';

const JobDescription = () => {
    const {singleJob} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const getApplicationStatus = (job) => {
        if (!user?._id) return null;
        const application = job?.applications?.find((item) => {
            const applicantId = typeof item?.applicant === "object"
                ? item.applicant?._id
                : item?.applicant;
            return String(applicantId) === String(user._id);
        });
        return application?.status?.toLowerCase() || null;
    };

    const isIntiallyApplied = singleJob?.applications?.some(application => {
        const applicantId = typeof application?.applicant === "object"
            ? application.applicant?._id
            : application?.applicant;
        return String(applicantId) === String(user?._id);
    }) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const [applicationStatus, setApplicationStatus] = useState(() => getApplicationStatus(singleJob));
    const [resumeFile, setResumeFile] = useState(null);
    const [interviewDate, setInterviewDate] = useState(null);
    const [recruiterNote, setRecruiterNote] = useState("");

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const resumeChangeHandler = (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            setResumeFile(null);
            return;
        }
        const allowed = file.type === "application/pdf"
            || file.type === "application/msword"
            || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            || file.type === "application/octet-stream"
            || /\.(pdf|doc|docx)$/i.test(file.name);
        if (!allowed) {
            toast.error("Please upload a PDF or Word resume.");
            event.target.value = "";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Resume must be smaller than 5 MB.");
            event.target.value = "";
            return;
        }
        setResumeFile(file);
    };

    const applyJobHandler = async () => {
        if (!user) {
            toast.error("Please login to apply for this job.");
            navigate("/login");
            return;
        }
        if (user.role !== "student") {
            toast.error("Only student accounts can apply for jobs.");
            return;
        }
        try {
            if (!resumeFile && !user.profile?.resume) {
                toast.error("Please upload or add a resume before applying.");
                return;
            }
            const formData = new FormData();
            if (resumeFile) formData.append("file", resumeFile);
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`,
                formData,
                { withCredentials: true, timeout: 30000, headers: { "Content-Type": "multipart/form-data" } }
            );
            
            if(res.data.success){
                setIsApplied(true); // Update the local state
                setApplicationStatus("pending");
                const updatedSingleJob = {...singleJob, applications:[...(singleJob?.applications || []),{applicant:user?._id,status:"pending"}]}
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                toast.success(res.data.message);

            }
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error("Please login to apply for this job.");
                navigate("/login");
                return;
            }
            toast.error(error.response?.data?.message || error.message || "Unable to apply for this job.");
        }
    }

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`);
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    const matchedApplication = res.data.job.applications?.find(application => {
                        const applicantId = typeof application?.applicant === "object"
                            ? application.applicant?._id
                            : application?.applicant;
                        return String(applicantId) === String(user?._id);
                    });
                    setIsApplied(Boolean(matchedApplication));
                    setApplicationStatus(matchedApplication?.status?.toLowerCase() || null);
                    setInterviewDate(matchedApplication?.interviewDate || null);
                    setRecruiterNote(matchedApplication?.recruiterNote || "");
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Unable to load job details.");
            }
        }
        fetchSingleJob();
        const statusInterval = window.setInterval(fetchSingleJob, 10000);
        return () => window.clearInterval(statusInterval);
    },[jobId,dispatch, user?._id]);

    return (
        <div>
            <Navbar />
            <main className='min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#f7f5ff] via-white to-slate-50 pb-16'>
                <section className='relative overflow-hidden bg-gradient-to-r from-[#1d1238] via-[#4d2a96] to-[#6A38C2] text-white'>
                    <div className='absolute inset-0 opacity-20' style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
                    <div className='relative mx-auto max-w-7xl px-6 py-12'>
                        <div className='flex flex-col items-start justify-between gap-8 md:flex-row md:items-center'>
                            <div className='flex items-center gap-5'>
                                <Avatar className='h-24 w-24 border-4 border-white/90 bg-white shadow-2xl'>
                                    <AvatarImage src={singleJob?.company?.logo} alt={singleJob?.company?.name} className='object-contain p-2' />
                                    <AvatarFallback className='bg-white text-[#6A38C2]'><Building2 className='h-10 w-10' /></AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className='mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-purple-200'>Now Hiring</p>
                                    <h1 className='font-serif text-4xl font-bold tracking-tight md:text-5xl'>{singleJob?.title || 'Job Details'}</h1>
                                    <div className='mt-3 flex flex-wrap items-center gap-4 text-sm text-purple-100'>
                                        <span className='flex items-center gap-1.5 font-semibold text-white'><Building2 className='h-4 w-4' />{singleJob?.company?.name || 'Company'}</span>
                                        <span className='flex items-center gap-1.5'><MapPin className='h-4 w-4' />{singleJob?.location || 'Location not specified'}</span>
                                    </div>
                                </div>
                            </div>
                            {singleJob?.company?.website && (
                                <a
                                    href={/^https?:\/\//i.test(singleJob.company.website) ? singleJob.company.website : `https://${singleJob.company.website}`}
                                    target='_blank'
                                    rel='noreferrer'
                                    className='flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:text-[#4d2a96]'
                                >
                                    Visit Company <ExternalLink className='h-4 w-4' />
                                </a>
                            )}
                        </div>
                    </div>
                </section>

                <div className='mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_360px]'>
                    <div className='space-y-6'>
                        <section className='rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.08)]'>
                            <h2 className='border-b border-gray-100 pb-4 font-serif text-2xl font-bold text-gray-900'>About the Role</h2>
                            <p className='mt-5 leading-7 text-gray-600'>{singleJob?.description}</p>

                            {singleJob?.requirements?.length > 0 && (
                                <div className='mt-8'>
                                    <h3 className='mb-4 text-lg font-bold text-gray-900'>Requirements</h3>
                                    <div className='grid gap-3 sm:grid-cols-2'>
                                        {singleJob.requirements.map((requirement, index) => (
                                            <div key={`${requirement}-${index}`} className='flex items-start gap-3 rounded-xl border border-purple-100 bg-purple-50/60 p-3'>
                                                <CheckCircle2 className='mt-0.5 h-5 w-5 shrink-0 text-[#6A38C2]' />
                                                <span className='text-sm text-gray-700'>{requirement}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        {singleJob?.company?.description && (
                            <section className='rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_18px_45px_rgba(15,23,42,0.06)]'>
                                <h2 className='font-serif text-2xl font-bold text-gray-900'>About {singleJob.company.name}</h2>
                                <p className='mt-4 leading-7 text-gray-600'>{singleJob.company.description}</p>
                            </section>
                        )}
                    </div>

                    <aside className='space-y-5'>
                        <div className='sticky top-24 space-y-5'>
                            <section className='rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.10)]'>
                                <h3 className='mb-5 text-lg font-bold text-gray-900'>Job Overview</h3>
                                <div className='space-y-4'>
                                    <div className='flex items-center gap-3'><IndianRupee className='h-5 w-5 text-[#6A38C2]' /><div><p className='text-xs text-gray-400'>Salary</p><p className='font-semibold'>{singleJob?.salary} LPA</p></div></div>
                                    <div className='flex items-center gap-3'><Briefcase className='h-5 w-5 text-[#6A38C2]' /><div><p className='text-xs text-gray-400'>Experience</p><p className='font-semibold'>{singleJob?.experienceLevel} years</p></div></div>
                                    <div className='flex items-center gap-3'><Clock3 className='h-5 w-5 text-[#6A38C2]' /><div><p className='text-xs text-gray-400'>Job Type</p><p className='font-semibold'>{singleJob?.jobType}</p></div></div>
                                    <div className='flex items-center gap-3'><Users className='h-5 w-5 text-[#6A38C2]' /><div><p className='text-xs text-gray-400'>Open Positions</p><p className='font-semibold'>{singleJob?.position}</p></div></div>
                                    <div className='flex items-center gap-3'><CalendarDays className='h-5 w-5 text-[#6A38C2]' /><div><p className='text-xs text-gray-400'>Posted On</p><p className='font-semibold'>{singleJob?.createdAt?.split('T')[0] || '-'}</p></div></div>
                                </div>
                            </section>

                            <section className='rounded-3xl border border-purple-100 bg-white p-6 shadow-[0_18px_45px_rgba(106,56,194,0.12)]'>
                                <h3 className='text-lg font-bold text-gray-900'>Application</h3>
                                {!isApplied && user?.role === "student" && (
                                    user.profile?.resume ? (
                                        <div className='mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3'>
                                            <p className='flex items-center gap-2 text-sm font-semibold text-green-800'>
                                                <CheckCircle2 className='h-4 w-4' /> Resume from your profile
                                            </p>
                                            <a
                                                href={user.profile.resume}
                                                target='_blank'
                                                rel='noreferrer'
                                                className='mt-1 block text-xs font-semibold text-[#6A38C2] underline'
                                            >
                                                View Resume
                                            </a>
                                            <label className='mt-3 cursor-pointer text-xs font-semibold text-gray-600 underline'>
                                                Replace for this application
                                                <input type='file' accept='.pdf,.doc,.docx' className='hidden' onChange={resumeChangeHandler} />
                                            </label>
                                        </div>
                                    ) : (
                                        <label className='mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-purple-300 bg-purple-50 px-4 py-3 text-sm text-gray-700 transition hover:bg-purple-100'>
                                            <span className='flex items-center gap-2'><Upload className='h-4 w-4 text-[#6A38C2]' />{resumeFile?.name || "Upload resume"}</span>
                                            <span className='text-xs font-semibold text-[#6A38C2]'>PDF/DOC</span>
                                            <input type='file' accept='.pdf,.doc,.docx' className='hidden' onChange={resumeChangeHandler} />
                                        </label>
                                    )
                                )}

                                {isApplied && applicationStatus && (
                                    <div className={`mt-4 rounded-xl border p-4 ${
                                        applicationStatus === "accepted"
                                            ? "border-green-200 bg-green-50"
                                            : applicationStatus === "rejected"
                                                ? "border-red-200 bg-red-50"
                                                : applicationStatus === "shortlisted"
                                                    ? "border-blue-200 bg-blue-50"
                                                    : "border-gray-200 bg-gray-50"
                                    }`}>
                                        <Badge className={
                                            applicationStatus === "accepted"
                                                ? "bg-green-500 text-white"
                                                : applicationStatus === "rejected"
                                                    ? "bg-red-500 text-white"
                                                    : applicationStatus === "shortlisted"
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-gray-500 text-white"
                                        }>
                                            {applicationStatus.toUpperCase()}
                                        </Badge>
                                        {applicationStatus === "shortlisted" && interviewDate && (
                                            <div className='mt-3'>
                                                <p className='text-xs font-bold text-blue-700'>Interview Scheduled</p>
                                                <p className='mt-1 text-sm'>{new Date(interviewDate).toLocaleString()}</p>
                                            </div>
                                        )}
                                        {recruiterNote && (
                                            <div className='mt-3 border-t border-black/10 pt-3'>
                                                <p className='text-xs font-bold text-gray-700'>Recruiter Note</p>
                                                <p className='mt-1 text-sm text-gray-700'>{recruiterNote}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <Button
                                    onClick={isApplied ? null : applyJobHandler}
                                    disabled={isApplied}
                                    className={`mt-4 w-full rounded-xl py-6 text-base ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#6A38C2] hover:bg-[#54299b] shadow-lg shadow-purple-200'}`}>
                                    {isApplied ? 'Already Applied' : !user ? 'Login to Apply' : user.role !== 'student' ? 'Students Only' : 'Apply Now'}
                                </Button>
                            </section>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}

export default JobDescription