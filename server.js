const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = 5000;

const allowedOrigins = [
    "http://localhost:3000",             // for local development
    "https://seat-secure.vercel.app"     // for deployed frontend
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }));
  
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

app.options("*", cors()); // Handle preflight requests

app.use(bodyParser.json());

// ✅ MongoDB Connection
mongoose.connect("mongodb+srv://adithyagv:adith%40123@cluster0.d9kiu.mongodb.net/")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Schemas
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    interests: { type: [String], required: false },
});
const User = mongoose.model("users", userSchema);

const feedbackSchema = new mongoose.Schema({
    eventId: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Feedback = mongoose.model("feedbacks", feedbackSchema);

// ✅ Feedback POST
app.post("/feedback", async (req, res) => {
    try {
        const { eventId, rating, comment } = req.body;
        if (!eventId || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newFeedback = new Feedback({ eventId, rating, comment });
        await newFeedback.save();
        res.status(201).json({ message: "Feedback submitted successfully!", feedback: newFeedback });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({ message: "Error submitting feedback", error });
    }
});

// ✅ Forgot Password
app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    console.log("Forgot password request for:", email);

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found with this email." });
        }

        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        user.password = hashedPassword;
        await user.save();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"SeatPal Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "SeatPal - Password Reset",
            html: `
                <h3>Hello ${user.username},</h3>
                <p>We’ve reset your SeatPal account password as requested.</p>
                <p><strong>New Password:</strong> <code>${tempPassword}</code></p>
                <p>Please use this password to log in and consider changing it once you're in.</p>
                <p>If you didn’t request this change, please contact our support team immediately.</p>
                <p>Best,<br/>SeatPal Team</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "New password sent to your email." });
    } catch (error) {
        console.error("Error sending reset email:", error);
        res.status(500).json({ message: "Failed to send reset email. Please try again." });
    }
});

// ✅ Register
app.post("/register", async (req, res) => {
    try {
        const { username, email, password, city } = req.body;
        if (!username || !email || !password || !city) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword, city });
        await newUser.save();

        res.status(201).json({ message: "Registration successful!", user: newUser });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal Server Error. Please try again later." });
    }
});

// ✅ Event Schema
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    city: { type: String, required: true },
    image: { type: String, required: true },
});
eventSchema.index({ city: 1 });
const Event = mongoose.model("events", eventSchema);

// ✅ Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const userCityEvents = await Event.find({ city: user.city });

        res.status(200).json({
            message: "Login successful",
            user: { username: user.username, city: user.city, interests: user.interests },
            events: userCityEvents,
        });
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json({ message: "Error logging in", error: err });
    }
});

// ✅ Image Upload (optional, not used in add event below)
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// ✅ Add Event
app.post("/events", async (req, res) => {
    try {
        const { title, type, date, time, venue, description, price, city, image } = req.body;
        if (!title || !type || !date || !time || !venue || !description || !price || !city || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newEvent = new Event({ title, type, date, time, venue, description, price, city, image });
        await newEvent.save();
        res.status(201).json({ message: "Event added successfully", event: newEvent });
    } catch (err) {
        console.error("Error adding event:", err);
        res.status(500).json({ message: "Error adding event", error: err });
    }
});

// ✅ Get All Events
app.get("/events", async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json({ events });
    } catch (err) {
        console.error("Error fetching events:", err);
        res.status(500).json({ message: "Error fetching events", error: err });
    }
});

// ✅ Get Event by ID
app.get("/event/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (err) {
        console.error("Error fetching event:", err);
        res.status(500).json({ message: "Error fetching event", error: err });
    }
});

// ✅ Get Events by City
app.get("/events/:city", async (req, res) => {
    const { city } = req.params;
    try {
        const events = await Event.find({
            city: { $regex: new RegExp(`^${city}$`, "i") },
        });
        res.status(200).json({ events });
    } catch (err) {
        console.error("Error fetching events:", err);
        res.status(500).json({ message: "Error fetching events", error: err });
    }
});

// ✅ Update Event
app.put("/events/:id", upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        if (req.file) {
            updatedData.image = req.file.filename;
        }
        const updatedEvent = await Event.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (err) {
        console.error("Error updating event:", err);
        res.status(500).json({ message: "Error updating event", error: err });
    }
});

// ✅ Delete Event
app.delete("/events/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        console.error("Error deleting event:", err);
        res.status(500).json({ message: "Error deleting event", error: err });
    }
});

// ✅ Get Feedbacks for Event
app.get("/feedback/:eventId", async (req, res) => {
    try {
        const { eventId } = req.params;
        const feedbacks = await Feedback.find({ eventId }).sort({ createdAt: -1 });
        res.status(200).json({ feedbacks });
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ message: "Error fetching feedbacks", error });
    }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
