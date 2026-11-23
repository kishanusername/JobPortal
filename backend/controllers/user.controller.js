import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }

        let profilePhoto = "";
        let resume = "";
        let resumeOriginalName = "";
        const profilePhotoFile = req.files?.profilePhoto?.[0];
        const resumeFile = req.files?.resume?.[0];
        if (profilePhotoFile) {
            const fileUri = getDataUri(profilePhotoFile);
            if (process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET) {
                try {
                    const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                        resource_type: "image",
                        folder: "job-portal/profile-photos"
                    });
                    profilePhoto = cloudResponse.secure_url;
                } catch (uploadError) {
                    console.error("Cloudinary profile-photo upload failed:", uploadError.message);
                    profilePhoto = fileUri.content;
                }
            } else {
                profilePhoto = fileUri.content;
            }
        }
        if (resumeFile && role === "student") {
            const fileUri = getDataUri(resumeFile);
            if (process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET) {
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    resource_type: "raw",
                    folder: "job-portal/resumes"
                });
                resume = cloudResponse.secure_url;
            } else {
                resume = fileUri.content;
            }
            resumeOriginalName = resumeFile.originalname;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto,
                resume,
                resumeOriginalName,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.error("Registration failed:", error);
        return res.status(500).json({
            message: "Unable to register account. Please try again.",
            success: false
        });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'lax'
        }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: "lax"
        }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.id);
        if (!user) {
            return res.status(401).json({
                message: "User not found.",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile
            }
        });
    } catch (error) {
        console.error("Failed to get current user:", error);
        return res.status(500).json({
            message: "Unable to verify the current session.",
            success: false
        });
    }
}
export const updateProfile = async (req, res) => {
    try {
        const {
            fullname, email, phoneNumber, bio, skills, percentage, cgpa,
            course, college, graduationYear, experience, location, linkedin, portfolio
        } = req.body;
        const profilePhotoFile = req.files?.profilePhoto?.[0];
        const resumeFile = req.files?.resume?.[0];
        const file = req.file;
        let profilePhotoResponse = null;
        let resumeResponse = null;
        const uploadFile = async (upload, folder, resourceType) => {
            const fileUri = getDataUri(upload);
            if (process.env.CLOUD_NAME && process.env.API_KEY && process.env.API_SECRET) {
                return await cloudinary.uploader.upload(fileUri.content, {
                    resource_type: resourceType,
                    folder
                });
            }
            return { secure_url: fileUri.content };
        };
        if (profilePhotoFile) {
            profilePhotoResponse = await uploadFile(profilePhotoFile, "job-portal/profile-photos", "image");
        } else if (file?.mimetype?.startsWith("image/")) {
            profilePhotoResponse = await uploadFile(file, "job-portal/profile-photos", "image");
        }
        if (resumeFile) {
            resumeResponse = await uploadFile(resumeFile, "job-portal/resumes", "raw");
        } else if (file && !file.mimetype?.startsWith("image/")) {
            resumeResponse = await uploadFile(file, "job-portal/resumes", "raw");
        }



        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if(fullname) user.fullname = fullname
        if(email) user.email = email
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if (user.role === "student") {
            if(skills) user.profile.skills = skillsArray
            if (percentage !== undefined && percentage !== "") user.profile.percentage = Number(percentage);
            if (cgpa !== undefined && cgpa !== "") user.profile.cgpa = Number(cgpa);
            if (course !== undefined) user.profile.course = course;
            if (college !== undefined) user.profile.college = college;
            if (graduationYear !== undefined && graduationYear !== "") user.profile.graduationYear = Number(graduationYear);
            if (experience !== undefined) user.profile.experience = experience;
            if (portfolio !== undefined) user.profile.portfolio = portfolio;
        }
        if (location !== undefined) user.profile.location = location;
        if (linkedin !== undefined) user.profile.linkedin = linkedin;
      
        // Resume and profile photo are separate profile fields.
        if (profilePhotoResponse) {
            user.profile.profilePhoto = profilePhotoResponse.secure_url;
        }
        if (resumeResponse && user.role === "student") {
            user.profile.resume = resumeResponse.secure_url;
            user.profile.resumeOriginalName = (resumeFile || file).originalname;
        }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}