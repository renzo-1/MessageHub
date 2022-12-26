const Convo = require('../models/convoModel')
const Message = require('../models/messageModel')
const sanitize = require('sanitize-html');

module.exports.getMessage = async(req,res) => {
    const {id} = req.params; // convo id
    const convo = await Convo.findById(id);
    const messages = await Message.find({_id: {$in: convo.messages}})
        .populate(['sender', 'receiver'])
    const reducedMessages = messages.map(m => ({  
            sender: m.sender.username, 
            receiver: m.receiver.username, 
            body: m.body, 
            creationTime: m.createdAt.toLocaleString()}))
    res.json( reducedMessages );
}

module.exports.postMessage = async(req,res) => {
    const {id} = req.params;
    const {message} = req.body;
    const senderID = req.user._id; //current user
    const sanitizedMessage = sanitize(message);
    if (sanitizedMessage.length===0){
        throw new ExpressError('Invalid Message', 406);
    }  
    const convo = await Convo.findById(id).populate(['sender', 'receiver']);
    const receiverID = convo.receiver._id.toString() === senderID.toString() ? convo.sender._id: convo.receiver._id;
    const newMessage = await new Message({ sender: senderID, receiver: receiverID, body: sanitize(message)}).populate(['sender', 'receiver'])
    convo.messages.push(newMessage);
    await convo.save();
    await newMessage.save()
        .then( () => { 
            res.status(200).json({  
                sender: newMessage.sender.username, 
                receiver: newMessage.receiver.username, 
                body: newMessage.body, 
                creationTime: newMessage.createdAt.toLocaleString()});
        })
        .catch( error => res.status(500).json({message: 'Message Failed'}))
}