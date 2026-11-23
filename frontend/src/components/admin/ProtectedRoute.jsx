import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    const {user} = useSelector(store=>store.auth);

    const navigate = useNavigate();

    useEffect(()=>{
        if (user === null) {
            navigate("/", { replace: true });
        } else if (user.role !== 'recruiter') {
            navigate("/profile", { replace: true });
        }
    },[navigate, user]);

    if (!user || user.role !== 'recruiter') return null;

    return children;
};
export default ProtectedRoute;