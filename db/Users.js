const mongoose = require('mongoose')

const SomtodaySessions = new mongoose.Schema({
    memberId: {
        type: String,
        required: true,
        unique: true,
    },
    refresh_token:{
        type: String,
        required: true
    },
    api_url:{
        type: String,
        required: true
    },
    schoolUuid:{
        type:String,
        required:true,
        default:"22573883-6e73-47f0-9cfe-ea748b0103c3",
    }



}, { collection:'RefreshTokens'})

module.exports = mongoose.model('RefreshTokens', SomtodaySessions);
