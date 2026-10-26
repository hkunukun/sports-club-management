const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Player = require("./models/Player");

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/sportsclub")
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Original 7 players
let players = [
    { id: 1, name: "Kiran", sport: "Cricket", age: 20 },
    { id: 2, name: "Anjali", sport: "Badminton", age: 19 },
    { id: 3, name: "Rahul", sport: "Football", age: 21 },
    { id: 4, name: "Priya", sport: "Tennis", age: 20 },
    { id: 5, name: "Arjun", sport: "Basketball", age: 22 },
    { id: 6, name: "Sneha", sport: "Cricket", age: 19 },
    { id: 7, name: "Vikram", sport: "Football", age: 21 }
];

let nextId = 8;

// GET: Original 7 players only (for Thunder Client)
app.get("/api/players", (req, res) => {
    const originalPlayers = players.filter(player => player.id <= 7);
    res.json(originalPlayers);
});

// GET: All players (for the webpage)
app.get("/api/all-players", (req, res) => {
    res.json(players);
});

// POST: Add a new player
app.post("/api/players", (req, res) => {
    const { name, sport, age } = req.body;

    if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof sport !== "string" ||
        !sport.trim() ||
        age === undefined ||
        age === "" ||
        !Number.isFinite(Number(age)) ||
        Number(age) <= 0
    ) {
        return res.status(400).json({
            message: "Please provide a valid name, sport, and age."
        });
    }

    const existingPlayer = players.find(
        player => player.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (existingPlayer) {
        return res.status(409).json({
            message: "Player already exists."
        });
    }

    const newPlayer = {
        id: nextId++,
        name: name.trim(),
        sport: sport.trim(),
        age: Number(age)
    };

    players.push(newPlayer);

    res.status(201).json({
        message: "Player added successfully.",
        player: newPlayer
    });
});

// PUT: Update a player by ID
app.put("/api/players/:id", (req, res) => {
    const id = Number(req.params.id);
    const player = players.find(item => item.id === id);

    if (!player) {
        return res.status(404).json({
            message: "Player not found."
        });
    }

    const { name, sport, age } = req.body;

    if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof sport !== "string" ||
        !sport.trim() ||
        age === undefined ||
        age === "" ||
        !Number.isFinite(Number(age)) ||
        Number(age) <= 0
    ) {
        return res.status(400).json({
            message: "Please provide a valid name, sport, and age."
        });
    }

    player.name = name.trim();
    player.sport = sport.trim();
    player.age = Number(age);

    res.json({
        message: "Player updated successfully.",
        player: player
    });
});

// DELETE: Delete a player by ID
app.delete("/api/players/:id", (req, res) => {
    const id = Number(req.params.id);
    const playerIndex = players.findIndex(item => item.id === id);

    if (playerIndex === -1) {
        return res.status(404).json({
            message: "Player not found."
        });
    }

    const deletedPlayer = players.splice(playerIndex, 1)[0];

    res.json({
        message: "Player deleted successfully.",
        player: deletedPlayer
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
