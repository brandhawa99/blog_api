const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name:{type:String, required:true, minlength:1},
  last_name:{type:String, required:true, minlength:1},
  username:{type:String, required:true, minlength:1}, 
  password:{type:String, required:true},
})

module.exports = mongoose.model('Author', AuthorSchema);