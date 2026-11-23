import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("Failed to create job:", error);
        return res.status(500).json({
            message: "Failed to create job.",
            success: false
        });
    }
}
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.error("Failed to fetch jobs:", error);
        return res.status(500).json({
            message: "Unable to load jobs.",
            success: false
        });
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate({
                path:"applications",
                select:"applicant status resume resumeOriginalName interviewDate recruiterNote"
            })
            .populate({
                path:"company",
                select:"name logo website location description"
            });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error("Failed to fetch job:", error);
        return res.status(500).json({
            message: "Unable to load job details.",
            success: false
        });
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.error("Failed to fetch admin jobs:", error);
        return res.status(500).json({
            message: "Unable to load admin jobs.",
            success: false
        });
    }
}

export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;
        const job = await Job.findOne({ _id: jobId, created_by: userId });
        if (!job) {
            return res.status(404).json({
                message: "Job not found or you do not have permission to edit it.",
                success: false
            });
        }

        const allowedFields = [
            "title", "description", "salary", "location", "jobType",
            "experienceLevel", "position", "company"
        ];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined && req.body[field] !== "") {
                job[field] = field === "salary" ? Number(req.body[field]) : req.body[field];
            }
        });
        if (req.body.companyId) {
            job.company = req.body.companyId;
        }
        if (req.body.requirements !== undefined) {
            job.requirements = Array.isArray(req.body.requirements)
                ? req.body.requirements
                : req.body.requirements.split(",").map((item) => item.trim()).filter(Boolean);
        }
        if (req.body.experience !== undefined) {
            job.experienceLevel = req.body.experience;
        }
        await job.save();

        return res.status(200).json({
            message: "Job updated successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("Failed to update job:", error);
        return res.status(500).json({
            message: "Unable to update job.",
            success: false
        });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;
        const job = await Job.findOneAndDelete({ _id: jobId, created_by: userId });
        if (!job) {
            return res.status(404).json({
                message: "Job not found or you do not have permission to delete it.",
                success: false
            });
        }

        await Application.deleteMany({ job: jobId });
        return res.status(200).json({
            message: "Job deleted successfully.",
            success: true
        });
    } catch (error) {
        console.error("Failed to delete job:", error);
        return res.status(500).json({
            message: "Unable to delete job.",
            success: false
        });
    }
};
