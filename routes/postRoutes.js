/* COMP3011 Prac Assignment
*  Author: Daehwan Yeo 19448288
*  Reference: Lecture 5, 6, 7 and Lab resources
*  Routes related to posts (show all, create, edit, delete, search)
*  Includes middleware for authentication
*  Separate route to view single post details
*  Last mod: 27/04/2025
*/

const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'You must be logged in');
  res.redirect('/login');
}

// Routes
router.get('/', postController.index); // Show all posts
router.get('/search', postController.searchPosts); // Search posts by title/tags
router.get('/new', ensureAuthenticated, postController.showNewForm);
router.post('/', ensureAuthenticated, postController.create);
router.get('/:id', postController.show); // Route to show individual post details
router.get('/:id/edit', ensureAuthenticated, postController.showEditForm);
router.post('/:id/update', ensureAuthenticated, postController.update);
router.delete('/:id', ensureAuthenticated, postController.remove);

module.exports = router;
