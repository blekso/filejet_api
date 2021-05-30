const Joi = require("joi");
const mongoose = require("mongoose");

const File = mongoose.model(
  "file",
  new mongoose.Schema({
    name: { type: String, required: true },
    ownerId: { type: String, ref: "user" },
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
  })
);

function validateFile(file) {
  const schama = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schama.validate(file);
}

module.exports.File = File;
module.exports.validate = validateFile;
