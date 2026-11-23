import React, { useState } from 'react'
import { Button } from './ui/button'
import { ArrowRight, BriefcaseBusiness, Search, Sparkles } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        if (!query.trim()) return;
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <section className="relative isolate overflow-hidden border-b border-purple-100/70 bg-gradient-to-br from-white via-purple-50/50 to-orange-50/40">
            <div className="hero-grid absolute inset-0 -z-10" />
            <div className="hero-orb absolute left-[8%] top-16 -z-10 h-40 w-40 rounded-full bg-purple-300/20 blur-3xl" />
            <div className="hero-orb absolute bottom-10 right-[8%] -z-10 h-48 w-48 rounded-full bg-orange-300/20 blur-3xl" />
            <div className="mx-auto flex min-h-[520px] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-4 py-2 text-sm font-semibold text-[#6A38C2] shadow-sm backdrop-blur">
                    <Sparkles className="h-4 w-4 text-[#F83002]" />
                    Find work that feels like you
                </div>
                <h1 className="max-w-4xl text-5xl font-black leading-[1.08] tracking-tight text-slate-950 md:text-7xl">
                    Search, apply & find your{" "}
                    <span className="bg-gradient-to-r from-[#6A38C2] via-[#8b5cf6] to-[#F83002] bg-clip-text text-transparent">
                        dream job
                    </span>
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                    Explore thousands of opportunities from ambitious companies and take the next step in your career.
                </p>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        searchJobHandler();
                    }}
                    className="mt-9 flex w-full max-w-2xl items-center rounded-2xl border border-purple-100 bg-white p-2 shadow-[0_18px_50px_rgba(106,56,194,0.16)]"
                >
                    <Search className="ml-3 h-5 w-5 shrink-0 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Job title, skill, or company"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="h-12 min-w-0 flex-1 px-3 text-slate-800 outline-none placeholder:text-slate-400"
                    />
                    <Button type="submit" className="h-12 rounded-xl bg-[#6A38C2] px-5 text-white shadow-lg shadow-purple-200 hover:bg-[#5b30a6]">
                        <span className="hidden sm:inline">Search jobs</span>
                        <ArrowRight className="h-5 w-5 sm:ml-2" />
                    </Button>
                </form>
                <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                    <BriefcaseBusiness className="h-4 w-4 text-[#6A38C2]" />
                    New opportunities added every day
                </div>
            </div>
        </section>
    )
}

export default HeroSection