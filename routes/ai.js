const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/predict", async (req, res) => {
    try {
        const response = await axios.post("http://127.0.0.1:5000/api/v1/predict", req.body);
        res.json(response.data);
    } catch (error) {
        console.error("Error connecting to AI model:", error.message);
        res.status(500).json({ error: "AI Model API Error" });
    }
});

module.exports = router;
