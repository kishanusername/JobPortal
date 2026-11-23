import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "",
        percentage: user?.profile?.percentage || "",
        cgpa: user?.profile?.cgpa || "",
        course: user?.profile?.course || "",
        college: user?.profile?.college || "",
        graduationYear: user?.profile?.graduationYear || "",
        experience: user?.profile?.experience || "",
        location: user?.profile?.location || "",
        linkedin: user?.profile?.linkedin || "",
        portfolio: user?.profile?.portfolio || "",
        profilePhoto: null,
        file: user?.profile?.resume || ""
    });
    const dispatch = useDispatch();
    const isRecruiter = user?.role === "recruiter";

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setInput({ ...input, file: null });
            return;
        }
        const allowed = file.type === "application/pdf"
            || file.type === "application/msword"
            || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            || file.type === "application/octet-stream"
            || /\.(pdf|doc|docx)$/i.test(file.name);
        if (!allowed) {
            toast.error("Please upload a PDF or Word document.");
            e.target.value = "";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Resume must be smaller than 5 MB.");
            e.target.value = "";
            return;
        }
        setInput({ ...input, file });
    }
    const profilePhotoChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file && !file.type.startsWith("image/")) {
            toast.error("Please choose an image file.");
            e.target.value = "";
            return;
        }
        if (file && file.size > 5 * 1024 * 1024) {
            toast.error("Profile photo must be smaller than 5 MB.");
            e.target.value = "";
            return;
        }
        setInput({ ...input, profilePhoto: file || null });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("location", input.location);
        formData.append("linkedin", input.linkedin);
        if (!isRecruiter) {
            formData.append("skills", input.skills);
            formData.append("percentage", input.percentage);
            formData.append("cgpa", input.cgpa);
            formData.append("course", input.course);
            formData.append("college", input.college);
            formData.append("graduationYear", input.graduationYear);
            formData.append("experience", input.experience);
            formData.append("portfolio", input.portfolio);
        }
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        if (input.file instanceof File) {
            formData.append("resume", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                timeout: 30000,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Unable to update profile.");
        } finally{
            setLoading(false);
        }
        setOpen(false);
    }



    return (
        <div>
            <Dialog open={open}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[640px]" onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>{user?.role === "recruiter" ? "Update Recruiter Profile" : "Update Student Profile"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="profilePhoto" className="text-right">Profile Photo</Label>
                                <Input
                                    id="profilePhoto"
                                    name="profilePhoto"
                                    type="file"
                                    accept="image/*"
                                    onChange={profilePhotoChangeHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="name"
                                    name="fullname"
                                    type="text"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="number" className="text-right">Number</Label>
                                <Input
                                    id="number"
                                    name="phoneNumber"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="bio" className="text-right">Bio</Label>
                                <Input
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            {!isRecruiter && (
                                <>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="skills" className="text-right">Skills</Label>
                                        <Input id="skills" name="skills" value={input.skills} onChange={changeEventHandler} className="col-span-3" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="percentage" className="text-right">Percentage</Label>
                                        <Input id="percentage" name="percentage" type="number" value={input.percentage} onChange={changeEventHandler} className="col-span-3" placeholder="Example: 85" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="cgpa" className="text-right">CGPA</Label>
                                        <Input id="cgpa" name="cgpa" type="number" step="0.01" value={input.cgpa} onChange={changeEventHandler} className="col-span-3" placeholder="Example: 8.5" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="course" className="text-right">Course</Label>
                                        <Input id="course" name="course" value={input.course} onChange={changeEventHandler} className="col-span-3" placeholder="B.Tech, BCA, MBA..." />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="college" className="text-right">College</Label>
                                        <Input id="college" name="college" value={input.college} onChange={changeEventHandler} className="col-span-3" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="graduationYear" className="text-right">Graduation Year</Label>
                                        <Input id="graduationYear" name="graduationYear" type="number" value={input.graduationYear} onChange={changeEventHandler} className="col-span-3" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="experience" className="text-right">Experience</Label>
                                        <Input id="experience" name="experience" value={input.experience} onChange={changeEventHandler} className="col-span-3" placeholder="Fresher or years" />
                                    </div>
                                </>
                            )}
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="location" className="text-right">Location</Label>
                                <Input id="location" name="location" value={input.location} onChange={changeEventHandler} className="col-span-3" />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="linkedin" className="text-right">LinkedIn</Label>
                                <Input id="linkedin" name="linkedin" value={input.linkedin} onChange={changeEventHandler} className="col-span-3" />
                            </div>
                            {!isRecruiter && (
                                <>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="portfolio" className="text-right">Portfolio</Label>
                                        <Input id="portfolio" name="portfolio" value={input.portfolio} onChange={changeEventHandler} className="col-span-3" />
                                    </div>
                                    <div className='grid grid-cols-4 items-center gap-4'>
                                        <Label htmlFor="file" className="text-right">Resume</Label>
                                        <Input id="file" name="file" type="file" accept=".pdf,.doc,.docx" onChange={fileChangeHandler} className="col-span-3" />
                                    </div>
                                </>
                            )}
                        </div>
                        <DialogFooter>
                            {
                                loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog