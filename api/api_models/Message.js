const mongoose = require('mongoose') 
const User = require('./User')
const MessageSchema = new mongoose.Schema ( {
    sender : {type: mongoose.Schema.Types.ObjectId, ref: User},
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: User},
    text: String
}, {timestamps: true});

const MessageModel = mongoose.model('Message', MessageSchema);  
module.exports = MessageModel;