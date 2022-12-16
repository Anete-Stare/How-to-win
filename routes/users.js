const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

router.route('/registreties')
    .get(users.renderRegister)
//post route to submit form and then we take the form data and register/create new user, but not logging in, but when we register, we want to be logged in also.(req.login)
    .post(catchAsync (users.register))

router.route('/pierakstities')
//router that serves a form for login
    .get(users.renderLogin)
//NEED TO CHECK FLASH MESSAGES, THOSE DO NOT WORK WITH PASSPORT HERE!
//this is where we do actual login, middleware passport.authenticate() comes from passport tool and here we specify local strategy, but that can be google, fb, twitter etc.
    .post(passport.authenticate('local',{failureFlash: true, failureRedirect: '/pierakstities', successRedirect: '/laimesti' }),users.login)

//logout route below
router.get('/iziet',users.logout);

module.exports = router;