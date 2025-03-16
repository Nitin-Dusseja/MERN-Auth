import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import path from "path";
const __dirname = path.resolve();

const app = express();
// process.env.PORT || 
const port = 4000;
connectDB();

app.use('/api', require('./routes/api')); 

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

const allowedOrigins = ["http://localhost:5173",'https://mern-auth-pyww.onrender.com', "*","http://localhost:4000" ];

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'https://mern-auth-pyww.onrender.com',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Handle preflight requests
app.options("*", cors());

// Test CORS route
app.get("/test-cors", (req, res) => {
  res.json({ message: "CORS is working!" });
});

//API Endpoints
app.get("/", (req, res) => {
  res.send("Api working");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => console.log(`Server Started on port ${port}`));
