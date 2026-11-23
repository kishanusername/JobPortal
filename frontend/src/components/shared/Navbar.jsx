import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { BookOpen, LogOut, Moon, Sun, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("jobportal-theme");
        return savedTheme === "dark" || savedTheme === "reading" ? savedTheme : "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("jobportal-theme", theme);
    }, [theme]);

    const themeOptions = [
        { value: "light", label: "Bright mode", icon: Sun },
        { value: "dark", label: "Dark mode", icon: Moon },
        { value: "reading", label: "Reading mode", icon: BookOpen }
    ];
    const profileInitials = user?.fullname
        ?.split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((name) => name[0]?.toUpperCase())
        .join("") || "U";

    const logoutHandler = async () => {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (!confirmed) return;

        try {
            setLoggingOut(true);
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message || "Unable to log out. Please try again.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Unable to log out. Please try again.");
        } finally {
            setLoggingOut(false);
        }
    }

    const brandMouseMoveHandler = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        event.currentTarget.style.setProperty('--brand-rotate-x', `${-y * 10}deg`);
        event.currentTarget.style.setProperty('--brand-rotate-y', `${x * 12}deg`);
        event.currentTarget.style.setProperty('--brand-glow-x', `${(x + 0.5) * 100}%`);
        event.currentTarget.style.setProperty('--brand-glow-y', `${(y + 0.5) * 100}%`);
    };

    const brandMouseLeaveHandler = (event) => {
        event.currentTarget.style.setProperty('--brand-rotate-x', '0deg');
        event.currentTarget.style.setProperty('--brand-rotate-y', '0deg');
        event.currentTarget.style.setProperty('--brand-glow-x', '50%');
        event.currentTarget.style.setProperty('--brand-glow-y', '50%');
    };

    return (
        <nav className='theme-nav fixed inset-x-0 top-0 z-50 bg-white/95 shadow-[0_4px_18px_rgba(15,23,42,0.10)] backdrop-blur-md'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                <Link
                    to="/"
                    className="brand-link"
                    aria-label="JobPortal home"
                    onMouseMove={brandMouseMoveHandler}
                    onMouseLeave={brandMouseLeaveHandler}
                >
                    <h1 className="brand-title">Job<span className="brand-accent">Portal</span></h1>
                </Link>
                <div className='flex items-center gap-5 md:gap-10'>
                    <ul className='hidden md:flex font-medium items-center gap-6'>
                        <div className='theme-switcher flex items-center rounded-full border border-slate-200 bg-slate-50 p-1' role="group" aria-label="Display mode">
                            {themeOptions.map(({ value, label, icon: Icon }) => (
                                <button
                                    key={value}
                                    type="button"
                                    title={label}
                                    aria-label={label}
                                    aria-pressed={theme === value}
                                    onClick={() => setTheme(value)}
                                    className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                                        theme === value
                                            ? "bg-[#6A38C2] text-white shadow-md"
                                            : "text-slate-500 hover:bg-white hover:text-[#6A38C2]"
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                </button>
                            ))}
                        </div>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li><Link className="nav-link" to="/admin/companies">Companies</Link></li>
                                    <li><Link className="nav-link" to="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link className="nav-link" to="/">Home</Link></li>
                                    <li><Link className="nav-link" to="/jobs">Jobs</Link></li>
                                    <li><Link className="nav-link" to="/browse">Browse</Link></li>
                                    {user && <li><Link className="nav-link" to="/profile#applied-jobs">Applied Jobs</Link></li>}
                                </>
                            )
                        }


                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login"><Button variant="outline" className="shadow-sm hover:shadow-md transition-shadow">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6] shadow-md hover:shadow-lg transition-shadow">Signup</Button></Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                            <button type="button" className="relative rounded-full ring-2 ring-white ring-offset-2 ring-offset-purple-100 shadow-md transition hover:scale-105" aria-label="Open account menu">
                                                <Avatar className="h-11 w-11 cursor-pointer border border-purple-100 bg-purple-50">
                                                    <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} className="object-cover" />
                                                    <AvatarFallback className="bg-gradient-to-br from-[#6A38C2] to-[#F83002] text-sm font-bold text-white">
                                                        {profileInitials}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" title="Logged in" />
                                            </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 shadow-2xl border-gray-200">
                                            <div>
                                                <div className='flex gap-2 space-y-2'>
                                                    <Avatar className="h-12 w-12 cursor-pointer border border-purple-100 bg-purple-50">
                                                        <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} className="object-cover" />
                                                        <AvatarFallback className="bg-gradient-to-br from-[#6A38C2] to-[#F83002] text-sm font-bold text-white">
                                                            {profileInitials}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className='font-medium'>{user?.fullname}</h4>
                                                        <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                                                    </div>
                                            </div>
                                                {user?.role === 'student' && (
                                                    <div className='flex w-fit items-center gap-2 cursor-pointer my-2'>
                                                        <User2 />
                                                        <Button variant="link" asChild><Link to="/profile">View Profile</Link></Button>
                                                    </div>
                                                )}
                                                {user?.role === 'recruiter' && (
                                                    <div className='flex w-fit items-center gap-2 cursor-pointer my-2'>
                                                        <User2 />
                                                        <Button variant="link" asChild><Link to="/recruiter/profile">Recruiter Profile</Link></Button>
                                                    </div>
                                                )}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <Button onClick={logoutHandler} variant="outline" disabled={loggingOut} className="shadow-sm hover:shadow-md transition-shadow">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    {loggingOut ? "Logging out..." : "Logout"}
                                </Button>
                            </div>
                        )
                    }

                </div>
            </div>
        </nav>
    )
}

export default Navbar