const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const CommentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, minlength: 1 },
    message: { type: String, required: true, minlength: 1, maxlength: 1500 },
    timestamp: { type: Date, required: true, default: Date.now() },
  },
  {
    toJSON: { virtuals: true },
    timestamps: true,
  }
);

CommentSchema.virtual("formatted_date").get(function () {
  let date = DateTime.fromJSDate(this.createdAt).toLocaleString(
    DateTime.DATETIME_MED
  );
  return date;
});

module.exports = mongoose.model("Comment", CommentSchema);
