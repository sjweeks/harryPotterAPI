const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    expires: {type: Date, required: true},
    session: {type: String, required: true}
});

module.exports = mongoose.model("sessions", sessionSchema);