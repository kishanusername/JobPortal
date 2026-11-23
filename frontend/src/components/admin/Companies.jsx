import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'
import { Building2, Plus, Search } from 'lucide-react'

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(setSearchCompanyByText(input));
    },[input]);
    return (
        <div>
            <Navbar />
            <div className='min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#f8f7ff] to-white'>
                <div className='max-w-6xl mx-auto py-10 px-4'>
                    <div className='mb-6 flex items-center gap-3 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm'>
                        <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-[#6A38C2] text-white'>
                            <Building2 className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className='text-2xl font-bold text-gray-900'>Company Management</h1>
                            <p className='text-sm text-gray-500'>Create and manage the companies you recruit for.</p>
                        </div>
                    </div>
                    <div className='mb-5 flex items-center justify-between gap-4'>
                        <div className='relative w-full max-w-sm'>
                            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
                            <Input
                                className="pl-9 shadow-sm"
                                placeholder="Search company"
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => navigate("/admin/companies/create")} className="bg-[#6A38C2] shadow-md hover:bg-[#5b30a6]">
                            <Plus className="mr-2 h-4 w-4" />
                            New Company
                        </Button>
                    </div>
                    <CompaniesTable/>
                </div>
            </div>
        </div>
    )
}

export default Companies