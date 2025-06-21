/* COMP3011 Prac Assignment
*  Author: Daehwan Yeo 19448288
*  Reference: Lecture 5, 6, 7 and Lab resources
*  Controller logic for posts: create, update, delete, show, search
*  Handles form validation using Joi
*  Handles authorization (only post creator or admin can edit/delete)
*  Last mod: 27/04/2025
*/

const Post = require('../models/post');
const Joi = require('joi');

// Joi schema for post validation
const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string() // handle single tag as string
  ).optional()
});

// Show all posts, with optional search query
exports.index = async (req, res) => {
  try {
    const search = req.query.search;
    let posts = [];

    if (search) {
      const regex = new RegExp(search, 'i');
      posts = await Post.find({
        $or: [
          { title: regex },
          { tags: { $regex: regex } } // Fix for searching within array
        ]
      }).populate('createdBy');
    } else {
      posts = await Post.find().populate('createdBy');
    }

    res.render('index', { posts, search });
  } catch (err) {
    req.flash('error', 'Failed to load posts.');
    res.redirect('/');
  }
};

// Show new post form
exports.showNewForm = (req, res) => {
  res.render('form', { post: {}, formTitle: "Create New Post", formAction: "/posts" });
};

// Create a new post
exports.create = async (req, res) => {
  try {
    const { error, value } = postSchema.validate(req.body);
    if (error) {
      req.flash('error', error.details[0].message);
      return res.redirect('/posts/new');
    }

    // Normalize tags into an array
    value.tags = typeof value.tags === 'string'
      ? value.tags.split(',').map(tag => tag.trim())
      : value.tags;

    const post = new Post({
      ...value,
      createdBy: req.user._id
    });

    await post.save();
    req.flash('success', 'Post created successfully!');
    res.redirect('/posts');
  } catch (err) {
    console.error('Create error:', err);
    req.flash('error', 'Error creating post.');
    res.redirect('/posts/new');
  }
};

// Show edit form
exports.showEditForm = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      req.flash('error', 'Post not found.');
      return res.redirect('/posts');
    }

    res.render('form', { post, formTitle: "Edit Post", formAction: `/posts/${post._id}?_method=PUT` });
  } catch (err) {
    req.flash('error', 'Error loading post.');
    res.redirect('/posts');
  }
};

// Update a post
exports.update = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || !post.createdBy.equals(req.user._id)) {
      req.flash('error', 'Unauthorized');
      return res.redirect('/posts');
    }

    const { error, value } = postSchema.validate(req.body);
    if (error) {
      req.flash('error', error.details[0].message);
      return res.redirect(`/posts/${req.params.id}/edit`);
    }

    // Normalize tags into an array
    value.tags = typeof value.tags === 'string'
      ? value.tags.split(',').map(tag => tag.trim())
      : value.tags;

    await Post.findByIdAndUpdate(req.params.id, value);
    req.flash('success', 'Post updated successfully!');
    res.redirect('/posts');
  } catch (err) {
    console.error('Update error:', err);
    req.flash('error', 'Error updating post.');
    res.redirect('/posts');
  }
};

// Delete a post
exports.remove = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || (!post.createdBy.equals(req.user._id) && !req.user.isAdmin)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Post deleted successfully!" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, message: "Error deleting post." });
  }
};


// Search posts by title or tags
exports.searchPosts = async (req, res) => {
  try {
    const query = req.query.q || '';
    const regex = new RegExp(query, 'i');
    const posts = await Post.find({
      $or: [
        { title: regex },
        { tags: { $regex: regex } }
      ]
    }).populate('createdBy');

    res.render('index', { posts, search: query });
  } catch (err) {
    console.error('Search error:', err);
    req.flash('error', 'Something went wrong during search.');
    res.redirect('/posts');
  }
};

// Show a single post details
exports.show = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('createdBy');
    if (!post) {
      req.flash('error', 'Post not found.');
      return res.redirect('/posts');
    }

    res.render('post', { post });
  } catch (err) {
    console.error('Post retrieval error:', err);
    req.flash('error', 'Something went wrong.');
    res.redirect('/posts');
  }
};
