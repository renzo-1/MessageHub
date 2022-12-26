// require('dotenv').config();
// const mongoose = require('mongoose');
// const Message = require('./models/messageModel');
// const Convo = require('./models/convoModel');
// const Contact = require('./models/contactModel')
// const catchAsync = require('./utils/catchAsync')

// mongoose.connect(process.env.DB_URI)
//     .then(() => { console.log('Connection Open') })
//     .catch(err => { console.log(err);});

// // const sample = (array) => array[Math.floor(Math.random() * array.length)] 

// const seedDB = async () => {
//     await Contact.deleteMany({})
//     await Convo.deleteMany({})
//     await Message.deleteMany({})
//     const contacts = await Contact.insertMany([{username: 'Jane'}, {username: 'John'}])
//     const janeID = contacts[0]._id;
//     const johnID = contacts[1]._id;

//     const messages1 = await Message.insertMany([
//         {sender: janeID, receiver: johnID, body: '1. Hello! This is a SEED message', creationTime: new Date().toISOString()},
//         {sender: johnID, receiver: janeID, body: '2. Hello! This is a SEED message', creationTime: new Date().toISOString()},
//         {sender: janeID, receiver: johnID, body: '3. Hello! This is a SEED message', creationTime: new Date().toISOString()},
//         {sender: johnID, receiver: janeID, body: '4. Hello! This is a SEED message', creationTime: new Date().toISOString()}
//     ]);

    
//     const messages2 = await Message.insertMany([
//         {sender: janeID, receiver: johnID, body: '1. Hello! This is a SEED message', creationTime: new Date().toISOString()},
//         {sender: johnID, receiver: janeID, body: '2. Hello! This is a SEED message', creationTime: new Date().toISOString()},
//         {sender: janeID, receiver: johnID, body: '3. Hello! This is a SEED message', creationTime: new Date().toISOString()},
//         {sender: johnID, receiver: janeID, body: '4. Hello! This is a SEED message', creationTime: new Date().toISOString()}
//     ]);

//     await Convo.insertMany([{messages: messages1}, {messages: messages2}])
// }


// seedDB()
// .then(() => {
//     console.log('Seeds Saved!');
//     mongoose.connection.close();
// })
// .catch((e) => {
//     console.log("Connection Error:",e)
// })

require('dotenv').config();
const mongoose = require('mongoose');
const Message = require('./models/messageModel');
const Convo = require('./models/convoModel');
const Contact = require('./models/contactModel')
const catchAsync = require('./utils/catchAsync')

mongoose.connect(process.env.DB_URI)
    .then(() => { console.log('Connection Open') })
    .catch(err => { console.log(err);});

// const sample = (array) => array[Math.floor(Math.random() * array.length)] 

const seedDB = async () => {
    await Contact.deleteMany({});
    await Message.deleteMany({});
    await Convo.deleteMany({});
    const contacts = await Contact.insertMany([{username: 'Jane'}, {username: 'John'}, {username: 'Didi'}])
    const janeID = contacts[0]._id;
    const johnID = contacts[1]._id;
    const didiID = contacts[2]._id;

      const messages1 = await Message.insertMany([
        {sender: janeID, receiver: johnID, body: '1. Hello! This is a SEED message', creationTime: new Date().toISOString()},
        {sender: johnID, receiver: janeID, body: '2. Hello! This is a SEED message', creationTime: new Date().toISOString()},
        {sender: janeID, receiver: johnID, body: '3. Hello! This is a SEED message', creationTime: new Date().toISOString()},
        {sender: johnID, receiver: janeID, body: '4. Hello! This is a SEED message', creationTime: new Date().toISOString()}
    ]);

    
    const messages2 = await Message.insertMany([
        {sender: janeID, receiver: johnID, body: '1. Hello! This is a SEED message', creationTime: new Date().toISOString()},
        {sender: johnID, receiver: janeID, body: '2. Hello! This is a SEED message', creationTime: new Date().toISOString()},
        {sender: janeID, receiver: johnID, body: '3. Hello! This is a SEED message', creationTime: new Date().toISOString()},
        {sender: johnID, receiver: janeID, body: '4. Hello! This is a SEED message', creationTime: new Date().toISOString()}
    ]);


    const convos = await Convo.insertMany([
        {sender: janeID, receiver: johnID, messages: messages1}, 
        {sender: janeID, receiver: didiID, messages: messages2},
        {sender: johnID, receiver: janeID, messages: messages1}, 
        {sender: didiID, receiver: janeID, messages: messages2}])
        
    const convo1 = convos[0]._id;
    const convo2 = convos[1]._id;

    await Contact.findByIdAndUpdate(janeID, { convos: [convo1,  convo2]});
    await Contact.findByIdAndUpdate(johnID, { convos: convo1});
    await Contact.findByIdAndUpdate(didiID, { convos: convo2});
}


seedDB()
.then(() => {
    console.log('Seeds Saved!');
    mongoose.connection.close();
})
.catch((e) => {
    console.log("Connection Error:",e)
})