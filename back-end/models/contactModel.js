const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const ContactSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    convos: [{
        type: Schema.Types.ObjectId,
        ref: 'Convo'
    }]
})

ContactSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('Contact', ContactSchema);
