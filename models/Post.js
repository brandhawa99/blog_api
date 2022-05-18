const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {DateTime} = require('luxon');
const { options } = require('../routes');

const PostSchema = new Schema({
  author:{type:Schema.Types.ObjectId,ref:'Author',required:true},
  title:{type:String,maxlength:50, required:true},
  blog:{type:String,minlength:1, required:true},
  timestamp:{type:Date,default: new Date().getTime()}
});

PostSchema
.virtual('date')
.get(function(){
  let date = DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_MED);
  return date;
})

module.exports = mongoose.model("Post",PostSchema);