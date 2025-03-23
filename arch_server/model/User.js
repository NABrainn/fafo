const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
