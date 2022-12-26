const mongoose = require('mongoose');
const Message = require('./messageModel');
const { Schema } = mongoose;
const Contact = require('./contactModel')

const convoSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'Contact',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'Contact',
        required: true
    },
    messages: [{
       type: Schema.Types.ObjectId,
       ref: 'Message'
    }],
})

module.exports = mongoose.model('Convo', convoSchema);