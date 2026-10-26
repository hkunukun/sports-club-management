const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    sport: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 5,
        max: 100
    }
});

module.exports = mongoose.model("Player", playerSchema);