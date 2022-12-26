const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn} = require('../middleware');
const { postMessage, getMessage } = require('../controllers/messages');

router.route('/n')
 // send message
    .get(isLoggedIn, catchAsync(getMessage))
    .post(isLoggedIn, catchAsync(postMessage));


module.exports = router;