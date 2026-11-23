import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.error("Failed to register company:", error);
        return res.status(500).json({
            message: "Unable to register company.",
            success: false
        });
    }
}
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.error("Failed to fetch companies:", error);
        return res.status(500).json({
            message: "Unable to load companies.",
            success: false
        });
    }
}
// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.error("Failed to fetch company:", error);
        return res.status(500).json({
            message: "Unable to load company.",
            success: false
        });
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
 
        const file = req.file;
        let logo;
        if (file) {
            const fileUri = getDataUri(file);
            if (process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET) {
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    resource_type: "image",
                    folder: "job-portal/company-logos"
                });
                logo = cloudResponse.secure_url;
            } else {
                logo = fileUri.content;
            }
        }

        const updateData = { name, description, website, location };
        if (logo) updateData.logo = logo;

        const company = await Company.findOneAndUpdate(
            { _id: req.params.id, userId: req.id },
            updateData,
            { new: true }
        );

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message:"Company information updated.",
            success:true
        })

    } catch (error) {
        console.error("Failed to update company:", error);
        return res.status(500).json({
            message: "Unable to update company.",
            success: false
        });
    }
}