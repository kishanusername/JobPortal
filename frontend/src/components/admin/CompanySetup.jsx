import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Building2, ExternalLink, Loader2, MapPin } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const {singleCompany} = useSelector(store=>store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [logoPreview, setLogoPreview] = useState("");

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
        if (file) setLogoPreview(URL.createObjectURL(file));
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error("Please login again before updating the company.");
                navigate("/login");
                return;
            }
            toast.error(error.response?.data?.message || "Unable to update company.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setInput({
            name: singleCompany?.name || "",
            description: singleCompany?.description || "",
            website: singleCompany?.website || "",
            location: singleCompany?.location || "",
            file: null
        })
        setLogoPreview(singleCompany?.logo || "");
    },[singleCompany]);

    const websiteUrl = input.website
        ? (/^https?:\/\//i.test(input.website) ? input.website : `https://${input.website}`)
        : "";

    return (
        <div>
            <Navbar />
            <div className='min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#f7f5ff] to-white'>
                <div className='max-w-5xl mx-auto py-8 px-4'>
                    <Button type="button" onClick={() => navigate("/admin/companies")} variant="ghost" className="mb-5 text-gray-600">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Companies
                    </Button>

                    <div className='overflow-hidden rounded-3xl border border-purple-100 bg-white shadow-[0_18px_50px_rgba(106,56,194,0.12)]'>
                        <div className='relative h-44 bg-gradient-to-r from-[#24124f] via-[#6A38C2] to-[#F83002]'>
                            <div className='absolute inset-0 opacity-20' style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                        </div>
                        <div className='px-8 pb-7'>
                            <div className='-mt-14 flex items-end justify-between gap-4'>
                                <div className='flex items-end gap-4'>
                                    <div className='flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl'>
                                        {logoPreview ? (
                                            <img src={logoPreview} alt={`${input.name || "Company"} logo`} className="h-full w-full object-contain p-2" />
                                        ) : (
                                            <Building2 className="h-12 w-12 text-[#6A38C2]" />
                                        )}
                                    </div>
                                    <div className='pb-2'>
                                        <h1 className='text-2xl font-bold text-gray-900'>{input.name || "Company Name"}</h1>
                                        {input.location && (
                                            <p className='mt-1 flex items-center text-sm text-gray-500'>
                                                <MapPin className='mr-1 h-4 w-4' /> {input.location}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {websiteUrl && (
                                    <a href={websiteUrl} target="_blank" rel="noreferrer" className='mb-2 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold text-[#6A38C2] shadow-sm hover:bg-purple-50'>
                                        Visit Website <ExternalLink className='h-4 w-4' />
                                    </a>
                                )}
                            </div>
                            {input.description && <p className='mt-5 max-w-3xl text-sm leading-6 text-gray-600'>{input.description}</p>}
                        </div>
                    </div>

                    <form onSubmit={submitHandler} className='mt-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_12px_40px_rgba(15,23,42,0.08)]'>
                        <div className='mb-6'>
                            <h2 className='text-lg font-bold'>Company Details</h2>
                            <p className='text-sm text-gray-500'>Keep your company profile clear and professional.</p>
                        </div>
                    <div className='grid gap-5 md:grid-cols-2'>
                        <div>
                            <Label className="mb-2 block">Company Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block">Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block">Website</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block">Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block">Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                            />
                        </div>
                    </div>
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>
                    }
                </form>
            </div>
        </div>
        </div>
    )
}

export default CompanySetup