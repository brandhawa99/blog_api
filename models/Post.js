const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {DateTime} = require('luxon');

const PostSchema = new Schema({
  author:{type:Schema.Types.ObjectId,ref:'Author',required:true},
  title:{type:String,maxlength:50, required:true},
  blog:{type:String,minlength:1, required:true},
  timestamp:{type:Date,default: Date.now()},
  public:{type:Boolean, default:true},
});

PostSchema
.virtual('date')
.get(function(){
  let date = DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_MED);
  return date;
})

PostSchema
  .virtual('url')
  .get(function(){
    return '/posts/'+this._id
  })

module.exports = mongoose.model("Post",PostSchema);