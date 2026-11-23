import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { updateApplicantStatus } from '@/redux/applicationSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Avatar, AvatarImage } from '../ui/avatar';

const shortlistingStatus = ["Shortlisted", "Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const dispatch = useDispatch();
    const [statusForm, setStatusForm] = useState({});
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    const statusHandler = async (status, id) => {
        try {
            if (status === "Shortlisted" && !statusForm[id]?.interviewDate) {
                toast.error("Select an interview date before shortlisting.");
                return;
            }
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, {
                status,
                interviewDate: statusForm[id]?.interviewDate || null,
                recruiterNote: statusForm[id]?.recruiterNote || ""
            });
            if (res.data.success) {
                dispatch(updateApplicantStatus({
                    applicationId: id,
                    status: status.toLowerCase(),
                    interviewDate: statusForm[id]?.interviewDate || null,
                    recruiterNote: statusForm[id]?.recruiterNote || ""
                }));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to update application status.");
        }
    }

    return (
        <div>
            <Dialog open={Boolean(selectedApplicant)} onOpenChange={(open) => { if (!open) setSelectedApplicant(null); }}>
                <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
                    {selectedApplicant && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Student Profile</DialogTitle>
                            </DialogHeader>
                            <div className='rounded-2xl border border-purple-100 bg-gradient-to-b from-purple-50 to-white p-5'>
                                <div className='flex items-center gap-4'>
                                    <Avatar className='h-20 w-20 border-2 border-white shadow-lg'>
                                        <AvatarImage src={selectedApplicant.profilePhoto || selectedApplicant.profile?.profilePhoto} />
                                    </Avatar>
                                    <div>
                                        <h2 className='text-xl font-bold'>{selectedApplicant.fullname}</h2>
                                        <p className='text-sm text-gray-600'>{selectedApplicant.email}</p>
                                        <p className='text-sm text-gray-600'>{selectedApplicant.phoneNumber}</p>
                                    </div>
                                </div>
                            </div>
                            {selectedApplicant.profile?.bio && <p className='text-sm leading-6 text-gray-600'>{selectedApplicant.profile.bio}</p>}
                            <div className='grid gap-3 sm:grid-cols-2'>
                                <div className='rounded-xl border p-4'>
                                    <p className='text-xs font-bold uppercase text-gray-500'>Education</p>
                                    <p className='mt-2 font-semibold'>{selectedApplicant.profile?.course || "Not added"}</p>
                                    <p className='text-sm text-gray-600'>{selectedApplicant.profile?.college || "College not added"}</p>
                                    {selectedApplicant.profile?.graduationYear && <p className='text-sm'>Graduation: {selectedApplicant.profile.graduationYear}</p>}
                                </div>
                                <div className='rounded-xl border p-4'>
                                    <p className='text-xs font-bold uppercase text-gray-500'>Academic Score</p>
                                    <p className='mt-2 font-bold'>{selectedApplicant.profile?.cgpa ? `${selectedApplicant.profile.cgpa} CGPA` : selectedApplicant.profile?.percentage ? `${selectedApplicant.profile.percentage}%` : "Not added"}</p>
                                </div>
                            </div>
                            <div className='grid gap-3 sm:grid-cols-2 text-sm'>
                                <p><b>Experience:</b> {selectedApplicant.profile?.experience || "Fresher"}</p>
                                <p><b>Location:</b> {selectedApplicant.profile?.location || "Not added"}</p>
                            </div>
                            {selectedApplicant.profile?.skills?.length > 0 && (
                                <div className='flex flex-wrap gap-2'>
                                    {selectedApplicant.profile.skills.map((skill, index) => <span key={index} className='rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700'>{skill}</span>)}
                                </div>
                            )}
                            <div className='flex flex-wrap gap-3'>
                                {(selectedApplicant.profile?.resume || selectedApplicant.applicationResume) && (
                                    <a href={selectedApplicant.applicationResume || selectedApplicant.profile.resume} target="_blank" rel="noreferrer" className='rounded-lg bg-[#6A38C2] px-4 py-2 text-sm font-semibold text-white'>Download Resume</a>
                                )}
                                {selectedApplicant.profile?.linkedin && <a href={selectedApplicant.profile.linkedin} target="_blank" rel="noreferrer" className='text-sm font-semibold text-blue-600'>LinkedIn</a>}
                                {selectedApplicant.profile?.portfolio && <a href={selectedApplicant.profile.portfolio} target="_blank" rel="noreferrer" className='text-sm font-semibold text-blue-600'>Portfolio</a>}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <TableRow key={item._id}>
                                <TableCell>
                                    <button
                                        type="button"
                                        className="font-semibold text-[#6A38C2] hover:underline"
                                        onClick={() => setSelectedApplicant({
                                            ...item.applicant,
                                            applicationResume: item.resume || item.applicant?.profile?.resume
                                        })}
                                    >
                                        {item?.applicant?.fullname}
                                    </button>
                                </TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell >
                                    {
                                        (item?.resume || item.applicant?.profile?.resume) ? (
                                            <a
                                                className="text-blue-600 cursor-pointer underline"
                                                href={item?.resume || item?.applicant?.profile?.resume}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Download Resume
                                            </a>
                                        ) : <span>NA</span>
                                    }
                                </TableCell>
                                <TableCell>{item?.applicant.createdAt.split("T")[0]}</TableCell>
                                <TableCell>
                                    <span className={`rounded-full px-2 py-1 text-xs font-bold text-white ${
                                        item?.status === "accepted"
                                            ? "bg-green-500"
                                            : item?.status === "rejected"
                                                ? "bg-red-500"
                                                : item?.status === "shortlisted"
                                                    ? "bg-blue-500"
                                                    : "bg-gray-400"
                                    }`}>
                                        {(item?.status || "pending").toUpperCase()}
                                    </span>
                                </TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-72 space-y-3">
                                            <div>
                                                <label className="text-xs font-medium">Interview date</label>
                                                <input
                                                    type="datetime-local"
                                                    className="mt-1 w-full rounded border px-2 py-1 text-sm"
                                                    value={statusForm[item?._id]?.interviewDate || ""}
                                                    onChange={(event) => setStatusForm((current) => ({
                                                        ...current,
                                                        [item._id]: {
                                                            ...current[item._id],
                                                            interviewDate: event.target.value
                                                        }
                                                    }))}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium">Recruiter note</label>
                                                <textarea
                                                    className="mt-1 w-full rounded border px-2 py-1 text-sm"
                                                    rows={2}
                                                    value={statusForm[item?._id]?.recruiterNote || ""}
                                                    onChange={(event) => setStatusForm((current) => ({
                                                        ...current,
                                                        [item._id]: {
                                                            ...current[item._id],
                                                            recruiterNote: event.target.value
                                                        }
                                                    }))}
                                                />
                                            </div>
                                            {
                                                shortlistingStatus.map((status, index) => {
                                                    return (
                                                        <div onClick={() => statusHandler(status, item?._id)} key={index} className='flex w-fit items-center my-2 cursor-pointer'>
                                                            <span>{status}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </PopoverContent>
                                    </Popover>

                                </TableCell>

                            </TableRow>
                        ))
                    }

                </TableBody>

            </Table>
        </div>
    )
}

export default ApplicantsTable