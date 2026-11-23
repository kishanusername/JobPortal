import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Contact, Mail, MapPin, Pen, Building2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import UpdateProfileDialog from '../UpdateProfileDialog'

const RecruiterProfile = () => {
    const { user } = useSelector(store => store.auth);
    const [open, setOpen] = useState(false);
    const initials = user?.fullname
        ?.split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((name) => name[0]?.toUpperCase())
        .join("") || "R";

    return (
        <div>
            <Navbar />
            <main className='min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#f7f5ff] to-white py-10'>
                <div className='mx-auto max-w-5xl px-4'>
                    <section className='overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-[0_18px_50px_rgba(106,56,194,0.10)]'>
                        <div className='h-36 bg-gradient-to-r from-[#24124f] via-[#6A38C2] to-[#F83002]' />
                        <div className='px-8 pb-8'>
                            <div className='flex items-end justify-between'>
                                <div className='flex items-end gap-5'>
                                    <Avatar className="-mt-12 h-28 w-28 border-4 border-white shadow-xl">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} className="object-cover" />
                                        <AvatarFallback className="bg-gradient-to-br from-[#6A38C2] to-[#F83002] text-2xl font-bold text-white">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='pb-2'>
                                        <h1 className='text-2xl font-bold text-gray-900'>{user?.fullname}</h1>
                                        <Badge className="mt-2 bg-purple-100 text-purple-700">Recruiter / Admin</Badge>
                                    </div>
                                </div>
                                <Button onClick={() => setOpen(true)} variant="outline" className="shadow-sm">
                                    <Pen className="mr-2 h-4 w-4" /> Edit Profile
                                </Button>
                            </div>
                            {user?.profile?.bio && (
                                <p className='mt-5 max-w-3xl text-sm leading-6 text-gray-600'>{user.profile.bio}</p>
                            )}
                            <div className='mt-6 grid gap-4 sm:grid-cols-3'>
                                <div className='flex items-center gap-3 rounded-xl border bg-gray-50 p-4'>
                                    <Mail className='h-5 w-5 text-[#6A38C2]' />
                                    <div><p className='text-xs text-gray-400'>Email</p><p className='text-sm font-semibold'>{user?.email}</p></div>
                                </div>
                                <div className='flex items-center gap-3 rounded-xl border bg-gray-50 p-4'>
                                    <Contact className='h-5 w-5 text-[#6A38C2]' />
                                    <div><p className='text-xs text-gray-400'>Phone</p><p className='text-sm font-semibold'>{user?.phoneNumber}</p></div>
                                </div>
                                <div className='flex items-center gap-3 rounded-xl border bg-gray-50 p-4'>
                                    <MapPin className='h-5 w-5 text-[#6A38C2]' />
                                    <div><p className='text-xs text-gray-400'>Location</p><p className='text-sm font-semibold'>{user?.profile?.location || "Not added"}</p></div>
                                </div>
                            </div>
                            {user?.profile?.skills?.length > 0 && (
                                <div className='mt-6'>
                                    <h2 className='font-bold text-gray-900'>Recruitment Expertise</h2>
                                    <div className='mt-2 flex flex-wrap gap-2'>
                                        {user.profile.skills.map((skill, index) => (
                                            <Badge key={index} className="bg-purple-100 text-purple-700">{skill}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className='mt-6 rounded-xl border border-purple-100 bg-purple-50 p-5'>
                                <h2 className='flex items-center gap-2 font-bold text-gray-900'>
                                    <Building2 className='h-5 w-5 text-[#6A38C2]' /> Recruitment Account
                                </h2>
                                <p className='mt-2 text-sm text-gray-600'>
                                    Manage company profiles, publish jobs, review applicants, and update application statuses.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default RecruiterProfile
