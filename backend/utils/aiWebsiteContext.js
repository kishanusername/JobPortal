import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";

const stopWords = new Set([
    "a", "an", "and", "are", "about", "can", "do", "for", "from", "how",
    "i", "in", "is", "it", "me", "of", "on", "or", "please", "tell", "the",
    "this", "to", "what", "which", "who", "with", "you", "your", "career",
    "careers", "company", "companies", "developer", "developers", "engineer",
    "engineers", "required", "requirement", "requirements", "role", "roles",
    "skill", "skills", "stack"
]);

const broadQueryWords = new Set([
    "available", "job", "jobs", "list", "listing", "listings", "opening",
    "openings", "opportunities", "opportunity", "position", "positions",
    "show", "vacancies", "vacancy"
]);

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getSearchTerms = (message) => [
    ...new Set(
        (message.toLowerCase().match(/[a-z0-9+#.-]{2,}/g) || [])
            .filter((term) => !stopWords.has(term))
    )
].slice(0, 8);

export const getAiWebsiteContext = async (message) => {
    const terms = getSearchTerms(message);
    const broadQuery = terms.length === 0 || terms.every((term) => broadQueryWords.has(term));

    const matchingCompanies = await Company.find(
        broadQuery
            ? {}
            : {
                $or: terms.flatMap((term) => {
                    const regex = new RegExp(escapeRegex(term), "i");
                    return ["name", "description", "location"].map((field) => ({
                        [field]: regex
                    }));
                })
            }
    )
        .select("name description website location")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean();

    const jobConditions = broadQuery
        ? {}
        : {
            $or: [
                ...terms.flatMap((term) => {
                    const regex = new RegExp(escapeRegex(term), "i");
                    return ["title", "description", "requirements", "location", "jobType"].map((field) => ({
                        [field]: regex
                    }));
                }),
                ...(matchingCompanies.length
                    ? [{ company: { $in: matchingCompanies.map((company) => company._id) } }]
                    : [])
            ]
        };

    const jobs = await Job.find(jobConditions)
        .select("title description requirements salary experienceLevel location jobType position company")
        .populate("company", "name description website location")
        .sort({ createdAt: -1 })
        .limit(8)
        .lean();

    const companiesById = new Map();
    for (const company of matchingCompanies) {
        companiesById.set(String(company._id), company);
    }
    for (const job of jobs) {
        if (job.company?._id) {
            companiesById.set(String(job.company._id), job.company);
        }
    }

    return {
        jobs: jobs.map((job) => ({
            _id: String(job._id),
            title: job.title,
            description: job.description,
            requirements: Array.isArray(job.requirements) ? job.requirements.slice(0, 12) : [],
            salary: job.salary,
            experienceLevel: job.experienceLevel,
            location: job.location,
            jobType: job.jobType,
            openings: job.position,
            company: job.company?.name || null
        })),
        companies: [...companiesById.values()].map((company) => ({
            name: company.name,
            description: company.description,
            website: company.website,
            location: company.location
        }))
    };
};
