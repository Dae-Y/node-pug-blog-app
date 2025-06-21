/* COMP3011 Prac Assignment
*  Author: Daehwan Yeo 19448288
*  Reference: Lecture 5, 6, 7 and Lab resources
*  Mongoose Schema
*  It defines the shape of documents inside a collection. 
*  It ensures data consistency within our MongoDB database. 
*  It specifies the fields, data types, validation rules, and relationships.
*  Post schema definition (title, content, tags, createdBy, createdAt)
*  Last mod: 27/04/2025
*/

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
