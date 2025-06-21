/* COMP3011 Prac Assignment
*  Author: Daehwan Yeo 19448288
*  Reference: Lecture 5, 6, 7 and Lab resources
*  Routes for user authentication (register, login, logout)
*  Input validation using Joi
*  Uses Passport.js for login authentication
*  Last mod: 27/04/2025
*/

const express = require('express');
const router = express.Router();
const passport = require('passport');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const User = require('../models/user');


// Show register form
router.get('/register', (req, res) => {
  res.render('register');
});


// Handle register
router.post('/register', async (req, res) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    req.flash('error', error.details[0].message);
    return res.redirect('/register');
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ username: req.body.username, password: hashedPassword });
    await user.save();
    req.flash('success', 'Registered successfully! You can now login.');
    res.redirect('/login');
  } catch (err) {
    req.flash('error', 'Username may already be taken.');
    res.redirect('/register');
  }
});


// Show login form
router.get('/login', (req, res) => {
  res.render('login');
});


// Handle login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/posts',
  failureRedirect: '/login',
  failureFlash: true
}));


// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    req.flash('success', 'Logged out!');
    res.redirect('/login');
  });
});

module.exports = router;
