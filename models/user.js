/* COMP3011 Prac Assignment
*  Author: Daehwan Yeo 19448288
*  Reference: Lecture 5, 6, 7 and Lab resources
*  Mongoose Schema
*  It defines the shape of documents inside a collection. 
*  It ensures data consistency within our MongoDB database. 
*  It specifies the fields, data types, validation rules, and relationships.
*  User schema definition (username, hashed password, isAdmin flag)
*  Last mod: 27/04/2025
*/

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
