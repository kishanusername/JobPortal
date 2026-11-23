import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        profilePhoto: null,
        resume: null
    });
    const {loading,user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeProfilePhotoHandler = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setInput({ ...input, profilePhoto: null });
            return;
        }
        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file.");
            e.target.value = "";
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Profile photo must be smaller than 5 MB.");
            e.target.value = "";
            return;
        }
        setInput({ ...input, profilePhoto: file });
    }
    const changeResumeHandler = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setInput({ ...input, resume: null });
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
        setInput({ ...input, resume: file });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.fullname || !input.email || !input.phoneNumber || !input.password || !input.role) {
            toast.error("Please fill in all required signup fields.");
            return;
        }
        const formData = new FormData();    //formdata object
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        if (input.resume && input.role === "student") {
            formData.append("resume", input.resume);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                withCredentials: true,
                timeout: 30000,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(
                error.code === "ECONNABORTED"
                    ? "Registration is taking too long. Please try again."
                    : error.response?.data?.message || error.message || "Unable to register. Please try again."
            );
        } finally{
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])
    return (
        <div>
            <Navbar />
            <div className='flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[radial-gradient(circle_at_top_right,_rgba(248,48,2,0.08),_transparent_32%),linear-gradient(135deg,#f8fafc,#f4efff)] px-4 py-10'>
                <form onSubmit={submitHandler} className='w-full max-w-2xl rounded-3xl border border-white bg-white/95 p-7 shadow-[0_24px_70px_rgba(70,45,120,0.18)] backdrop-blur'>
                    <div className='mb-6 text-center'>
                        <p className='text-xs font-bold uppercase tracking-[0.2em] text-[#F83002]'>Start your journey</p>
                        <h1 className='mt-2 text-3xl font-black text-slate-950'>Create an account</h1>
                    </div>
                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="patel"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="patel@gmail.com"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="8080808080"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="patel@gmail.com"
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r1">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                        <div className='flex items-center gap-2'>
                            <Label>Profile</Label>
                            <Input
                                name="profilePhoto"
                                accept="image/*"
                                type="file"
                                onChange={changeProfilePhotoHandler}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                    {input.role === "student" && (
                        <div className='my-3 flex items-center justify-between'>
                            <Label htmlFor="signup-resume">Resume</Label>
                            <Input
                                id="signup-resume"
                                name="resume"
                                accept=".pdf,.doc,.docx"
                                type="file"
                                onChange={changeResumeHandler}
                                className="max-w-sm cursor-pointer"
                            />
                        </div>
                    )}
                    {
                        <Button type="submit" className="w-full my-4" disabled={loading}>
                            {loading ? <><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</> : "Signup"}
                        </Button>
                    }
                    <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Signup