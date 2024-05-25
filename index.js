import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import process from "process";
dotenv.config();
import cookieParser from "cookie-parser";
import multer from "multer";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";
import connectDB from "./config/db.js";
import userRoutes from "./routes/User.js";
import postRoutes from "./routes/Post.js"
import otpRoutes from "./routes/OTP.js";
import hackRoutes from "./routes/hackathonRoutes.js";
import { updateImage } from "./Controllers/User.js";

dotenv.config({ path: "./config.env" });
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(logger);
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use("/user", userRoutes);
app.use("/otp", otpRoutes);
app.use("/post", postRoutes);
app.use("/hackathon", hackRoutes);
app.post("/updateImage/:id", upload.single("image"), updateImage);

app.use(errorHandler);
const port = process.env.PORT || 3000;

// app.listen(port, () => 
const httpServer = createServer(app);
const io = new Server(httpServer,{
    cors:{
        origin:"https://localhost:3000"
    }
});
io.on("connection", (socket) => {
    console.log(`🚀 New client connected with ID: ${socket.id}`);
  });
  
  // Start the HTTP server
    httpServer.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
  });
  
connectDB();
