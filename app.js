/* COMP3011 Prac Assignment
*  Author: Daehwan Yeo 19448288
*  Reference: Lecture 5, 6, 7 and Lab resources
*  Last mod: 27/04/2025
*/

require('dotenv').config(); // Load environment variables

// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Configures middlewares body-parser, express-session, passport, flash
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport.js Local Strategy for authentication
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return done(null, false, { message: 'Invalid username' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return done(null, false, { message: 'Invalid password' });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Global middleware to expose user, success, and error messages to all views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});


// Sets up routes: userRoutes and postRoutes
app.use('/', userRoutes);
app.use('/posts', postRoutes);

app.get('/', (req, res) => {
  res.redirect('/posts');
});

// Admin Route: View Users
app.get('/users', async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    req.flash('error', 'Unauthorized access.');
    return res.redirect('/posts');
  }

  try {
    const users = await User.find({}, 'username'); // Fetch only usernames
    res.render('users', { users });
  } catch (err) {
    console.error("Error fetching users:", err);
    req.flash('error', 'Error loading users.');
    res.redirect('/posts');
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));