const mongoose = require("mongoose");
const { Schema } = mongoose;

const messageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'Contact',
    }, 
    receiver: {
            type: Schema.Types.ObjectId,
            ref: 'Contact',
    }, 
    body: {
        type: String,
        required: true,
    },
}, { timestamps: true })

module.exports = mongoose.model('Message', messageSchema);