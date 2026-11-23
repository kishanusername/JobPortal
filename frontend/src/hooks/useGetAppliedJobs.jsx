import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useGetAppliedJobs = () => {
    const dispatch = useDispatch();

    useEffect(()=>{
        const fetchAppliedJobs = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
                    withCredentials:true,
                    params: { timestamp: Date.now() }
                });
                if(res.data.success){
                    dispatch(setAllAppliedJobs(res.data.application));
                }
            } catch (error) {
                if (error.response?.status !== 401) {
                    console.error("Unable to load applied jobs:", error);
                }
                dispatch(setAllAppliedJobs([]));
            }
        }
        fetchAppliedJobs();
        const intervalId = window.setInterval(fetchAppliedJobs, 10000);
        window.addEventListener("focus", fetchAppliedJobs);

        return () => {
            window.clearInterval(intervalId);
            window.removeEventListener("focus", fetchAppliedJobs);
        };
    }, [dispatch])
};
export default useGetAppliedJobs;