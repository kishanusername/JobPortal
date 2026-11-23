import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "FullStack Developer",
    "Data Scientist",
    "DevOps Engineer",
    "UI/UX Designer"
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
                        category.map((cat, index) => (
                            <CarouselItem key={cat} className="basis-full sm:basis-1/2 md:basis-1/3">
                                <Button onClick={()=>searchJobHandler(cat)} variant="outline" className="h-12 w-full rounded-xl border-purple-100 bg-white text-slate-700 shadow-sm transition hover:border-purple-300 hover:bg-purple-50 hover:text-[#6A38C2]">{cat}</Button>
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