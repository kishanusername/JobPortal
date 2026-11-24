import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import aiRoute from "./routes/aiRoute.js";

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ],
    credentials:true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;


// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/ai", aiRoute);

app.use((error, _req, res, _next) => {
    if (error?.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
            message: "Profile photo must be smaller than 5 MB.",
            success: false
        });
    }
    if (error?.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
            message: error.field === "resume"
                ? "Please upload a PDF or Word resume."
                : error.field === "profilePhoto"
                    ? "Please upload a valid profile image."
                    : "Please upload a supported image, PDF, or Word document.",
            success: false
        });
    }
    console.error("Request failed:", error);
    return res.status(500).json({
        message: "An unexpected server error occurred.",
        success: false
    });
});


const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running at port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exitCode = 1;
    }
};

startServer();
