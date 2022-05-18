const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user:{type:Schema.Types.ObjectId,required:true},
  timestamp:{type:Date, required:true, default:Date.now()},
  message:{type:String, required:true, minlength:1,maxlength:1500}
});

module.exports = mongoose.model('Comment',CommentSchema);