const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const {isLoggedIn} = require('../middleware')
const {showAll, showOne, addConvo, deleteConvo} = require('../controllers/convos')

router.route('/')
    // SHOW ALL CONVOS
    .get(isLoggedIn, catchAsync(showAll))
    // ADD NEW CONVO
    .post(isLoggedIn, catchAsync(addConvo));

router.route('/:id')
    //  get one convo
    .get(isLoggedIn, catchAsync(showOne))
    // delete a convo
    .delete(isLoggedIn, catchAsync(deleteConvo))


module.exports = router;
