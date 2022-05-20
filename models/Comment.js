const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  post:{type:Schema.Types.ObjectId,required:true},
  name:{type:String, required:true, minlength:1},
  message:{type:String, required:true, minlength:1,maxlength:1500},
  timestamp:{type:Date, required:true, default:Date.now()}
});

module.exports = mongoose.model('Comment',CommentSchema);