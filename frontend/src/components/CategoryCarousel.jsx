import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Code2, Database, Palette, ServerCog, Smartphone, Wrench } from 'lucide-react';

const category = [
    { name: "Frontend Developer", icon: Smartphone, tone: "from-blue-50 to-indigo-50" },
    { name: "Backend Developer", icon: ServerCog, tone: "from-emerald-50 to-teal-50" },
    { name: "FullStack Developer", icon: Code2, tone: "from-purple-50 to-violet-50" },
    { name: "Data Scientist", icon: Database, tone: "from-orange-50 to-amber-50" },
    { name: "DevOps Engineer", icon: Wrench, tone: "from-cyan-50 to-sky-50" },
    { name: "UI/UX Designer", icon: Palette, tone: "from-pink-50 to-rose-50" }
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <section className="mx-auto max-w-7xl px-4 py-14">
            <div className="mb-7 text-center">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#F83002]">Explore careers</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-950">Popular job categories</h2>
            </div>
            <Carousel className="mx-auto w-full max-w-3xl">
                <CarouselContent>
                    {
                        category.map(({ name, icon: Icon, tone }) => (
                            <CarouselItem key={name} className="basis-full sm:basis-1/2 md:basis-1/3">
                                <Button onClick={()=>searchJobHandler(name)} variant="outline" className={`h-20 w-full rounded-2xl border-purple-100 bg-gradient-to-br ${tone} text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:text-[#6A38C2]`}>
                                    <Icon className="mr-3 h-5 w-5 text-[#6A38C2]" />
                                    {name}
                                </Button>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </section>
    )
}

export default CategoryCarousel