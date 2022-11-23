const express = require('express');
const router = express.Router();
const winnings = require('../controllers/winnings');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateWinning} = require('../middleware');
const multer  = require('multer');
const {storage} = require('../cloudinary'); // here we do not need to specify index.js, because node automatically looks for index file in folder
const upload = multer({ storage });

const Winning = require('../models/winning');

router.route('/')
    .get(catchAsync(winnings.index))
    .post(isLoggedIn, upload.array('image'),validateWinning, catchAsync (winnings.createWinning))


router.get('/jauns',isLoggedIn, winnings.renderNewForm)

router.route('/:id')
    .get(catchAsync(winnings.showWinning))
    .put(isLoggedIn, isAuthor,  upload.array('image'), validateWinning, catchAsync(winnings.updateWinning))  //upload.array ('image')
    .delete(isLoggedIn, isAuthor, catchAsync(winnings.deleteWinning));

router.get('/:id/labot', isLoggedIn, isAuthor, catchAsync (winnings.renderEditForm))

module.exports = router;