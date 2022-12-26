const Convo = require("../models/convoModel");
const Contact = require("../models/contactModel");
const Message = require("../models/messageModel");
const sanitize = require("sanitize-html");
const ExpressError = require("../utils/ExpressErrors");

const currentUserContactInfo = async (userID) => {
  return await Contact.findById(userID).populate({
    path: "convos",
    populate: [{ path: "sender" }, { path: "receiver" }, { path: "messages" }],
  });
};

module.exports.showAll = async (req, res) => {
  const searchedUsername = req.query.username;
  const contactInfo = await currentUserContactInfo(req.user._id);
  const sanitizedUsername = sanitize(searchedUsername);
  if (searchedUsername && sanitizedUsername.length === 0) {
    throw new ExpressError("Invalid Username", 400);
  }

  // if searched contact is the current user, return nothing
  // if searched contact is already added, return nothing
  if (
    (searchedUsername && searchedUsername === contactInfo.username) ||
    contactInfo.convos.some(
      (e) =>
        e.sender.username === searchedUsername ||
        e.receiver.username === searchedUsername
    )
  ) {
    res.status(200).json([]);
  } else if (searchedUsername) {
    const foundContact = await Contact.find({ username: searchedUsername });
    if (foundContact) res.status(200).json(foundContact);
    else return res.status(200).json([]);
  } else {
    res.status(200).json({ contactInfo, convoList: contactInfo.convos });
  }
};

// ADD CONTACT AND ADD CONVO
module.exports.addConvo = async (req, res) => {
  const { id } = req.body;
  const sender = await Contact.findById(req.user._id);
  const receiver = await Contact.findById(id);
  const newConvo = new Convo({ sender: req.user._id, receiver: receiver._id });
  sender.convos.push(newConvo);
  receiver.convos.push(newConvo);
  await newConvo.save();
  await sender.save();
  await receiver.save();
  res.status(200).json({ message: `Contact with id ${id}Added Successfully` });
};

module.exports.deleteConvo = async (req, res) => {
  const { id } = req.params; // ID for the conversation
  const convo = await Convo.findById(id);
  await Contact.findByIdAndUpdate(req.user._id, { $pull: { convos: id } }); // delete the convo from the current user
  const convoInContacts = await Contact.find({ convos: { _id: id } }); // check if messages is in one of the contacts
  // delete the convo and messages if convo is not found in any contacts
  if (convoInContacts.length === 0) {
    await Message.deleteMany({ _id: { $in: convo.messages } });
    await Convo.findByIdAndDelete(id);
  }
  res.status(200).json({ message: "Deleted convo successfully" });
};
