import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job',
        required:true
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['pending', 'shortlisted', 'accepted', 'rejected'],
        default:'pending'
    },
    resume:{
        type:String,
        default:""
    },
    resumeOriginalName:{
        type:String,
        default:""
    },
    interviewDate:{
        type:Date,
        default:null
    },
    recruiterNote:{
        type:String,
        default:""
    }
},{timestamps:true});
export const Application  = mongoose.model("Application", applicationSchema);