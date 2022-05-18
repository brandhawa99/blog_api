const { default: mongoose } = require("mongoose")
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username:{type:String,minlength:1,required:true},
  password:{type:String, required:true},
  admin:{type:Boolean,default:false, required:true},
})

module.exports = mongoose.model('User',UserSchema);
