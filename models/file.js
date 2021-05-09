const Joi = require("joi");
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

const File = mongoose.model("file", fileSchema);

function validatefile(file) {
  const schama = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schama.validate(file);
}

module.exports.File = File;
module.exports.validatefile = validatefile;
