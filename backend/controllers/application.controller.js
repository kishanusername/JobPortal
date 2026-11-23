import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({
                message: "Please login to apply for this job.",
                success: false
            });
        }
        if (user.role !== "student") {
            return res.status(403).json({
                message: "Only student accounts can apply for jobs.",
                success: false
            });
        }

        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            })
        };
        if (!req.file && (!user.profile?.resume)) {
            return res.status(400).json({
                message: "Please upload a resume before applying.",
                success: false
            });
        }
        let resume = user.profile?.resume || "";
        let resumeOriginalName = user.profile?.resumeOriginalName || "";
        if (req.file) {
            const fileUri = getDataUri(req.file);
            if (process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET) {
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    resource_type: "raw",
                    folder: "job-portal/resumes"
                });
                resume = cloudResponse.secure_url;
            } else {
                resume = fileUri.content;
            }
            resumeOriginalName = req.file.originalname;
        }
        // check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this jobs",
                success: false
            });
        }

        // check if the jobs exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            })
        }
        // create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId,
            resume,
            resumeOriginalName
        });

        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully.",
            success:true
        })
    } catch (error) {
        console.error("Failed to apply for job:", error);
        return res.status(500).json({
            message: "Unable to apply for this job.",
            success: false
        });
    }
};
export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId})
            .sort({createdAt:-1})
            .populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.error("Failed to fetch applied jobs:", error);
        return res.status(500).json({
            message: "Unable to load applied jobs.",
            success: false
        });
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            success:true
        });
    } catch (error) {
        console.error("Failed to update application status:", error);
        return res.status(500).json({
            message: "Unable to update application status.",
            success: false
        });
    }
}
export const updateStatus = async (req,res) => {
    try {
        const {status, interviewDate, recruiterNote} = req.body;
        const applicationId = req.params.id;
        if(!status || !["pending", "shortlisted", "accepted", "rejected"].includes(status.toLowerCase())){
            return res.status(400).json({
                message:'Status must be pending, shortlisted, accepted, or rejected.',
                success:false
            })
        };
        if (status.toLowerCase() === "shortlisted" && !interviewDate) {
            return res.status(400).json({
                message:"Interview date is required for shortlisted applications.",
                success:false
            });
        }

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        application.interviewDate = interviewDate ? new Date(interviewDate) : null;
        application.recruiterNote = recruiterNote?.trim() || "";
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.error("Failed to update application status:", error);
        return res.status(500).json({
            message:"Unable to update application status.",
            success:false
        });
    }
}