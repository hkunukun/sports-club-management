const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Player = require("./models/Player");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/sportsclub";

// GET: Display all players
app.get("/api/players", async (req, res) => {
    try {
        const players = await Player.find().sort({ _id: 1 });
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch players." });
    }
});

// GET: Display all players for the webpage
app.get("/api/all-players", async (req, res) => {
    try {
        const players = await Player.find().sort({ _id: 1 });
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch players." });
    }
});

// POST: Add a new player
app.post("/api/players", async (req, res) => {
    try {
        const { name, sport, age } = req.body;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof sport !== "string" ||
            !sport.trim() ||
            age === undefined ||
            age === "" ||
            !Number.isFinite(Number(age)) ||
            Number(age) < 5 ||
            Number(age) > 100
        ) {
            return res.status(400).json({
                message: "Please provide a valid name, sport, and age between 5 and 100."
            });
        }

        const existingPlayer = await Player.findOne({
            name: name.trim(),
            sport: sport.trim(),
            age: Number(age)
        });

        if (existingPlayer) {
            return res.status(409).json({
                message: "Player already exists."
            });
        }

        const player = await Player.create({
            name: name.trim(),
            sport: sport.trim(),
            age: Number(age)
        });

        res.status(201).json({
            message: "Player added successfully.",
            player
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to add player." });
    }
});

// PUT: Update a player
app.put("/api/players/:id", async (req, res) => {
    try {
        const { name, sport, age } = req.body;

        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof sport !== "string" ||
            !sport.trim() ||
            age === undefined ||
            age === "" ||
            !Number.isFinite(Number(age)) ||
            Number(age) < 5 ||
            Number(age) > 100
        ) {
            return res.status(400).json({
                message: "Please provide a valid name, sport, and age."
            });
        }

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid player ID." });
        }

        const player = await Player.findByIdAndUpdate(
            req.params.id,
            {
                name: name.trim(),
                sport: sport.trim(),
                age: Number(age)
            },
            { new: true, runValidators: true }
        );

        if (!player) {
            return res.status(404).json({ message: "Player not found." });
        }

        res.json({
            message: "Player updated successfully.",
            player
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update player." });
    }
});

// DELETE: Delete a player
app.delete("/api/players/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid player ID." });
        }

        const player = await Player.findByIdAndDelete(req.params.id);

        if (!player) {
            return res.status(404).json({ message: "Player not found." });
        }

        res.json({
            message: "Player deleted successfully.",
            player
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete player." });
    }
});

// Start the server after MongoDB connects
mongoose.connect(MONGO_URL)
    .then(() => {
        console.log("MongoDB connected successfully");
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch(error => {
        console.error("MongoDB connection failed:", error.message);
    });