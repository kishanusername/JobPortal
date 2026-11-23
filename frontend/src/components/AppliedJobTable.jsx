import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);
    const getStatusStyles = (status) => {
        const normalizedStatus = status?.toLowerCase();
        if (normalizedStatus === "shortlisted") return "bg-blue-500 text-white";
        if (normalizedStatus === "accepted") return "bg-green-500 text-white";
        if (normalizedStatus === "rejected") return "bg-red-500 text-white";
        return "bg-gray-400 text-white";
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Interview</TableHead>
                        <TableHead>Recruiter Note</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        allAppliedJobs.length <= 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                    You haven&apos;t applied any job yet.
                                </TableCell>
                            </TableRow>
                        ) : allAppliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob._id}>
                                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>{appliedJob?.job?.title || "-"}</TableCell>
                                <TableCell>{appliedJob?.job?.company?.name || "-"}</TableCell>
                                <TableCell>
                                    {appliedJob?.status?.toLowerCase() === "shortlisted" && appliedJob?.interviewDate
                                        ? new Date(appliedJob.interviewDate).toLocaleString()
                                        : "-"}
                                </TableCell>
                                <TableCell className="max-w-xs">
                                    {appliedJob?.recruiterNote || "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge className={getStatusStyles(appliedJob?.status)}>
                                        {(appliedJob?.status?.toLowerCase() || "pending").toUpperCase()}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable