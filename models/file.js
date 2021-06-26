const Joi = require("joi");
const mongoose = require("mongoose");

const File = mongoose.model(
  "file",
  new mongoose.Schema({
    file_data: { type: Buffer, required: true },
    name: { type: String, required: true },
    ownerId: { type: String, ref: "user" },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    type: { type: String, required: true },
    lastModifiedDate: { type: Date, required: true },
  })
);

function validateFile(file) {
  const schama = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().required(),
    lastModifiedDate: Joi.date().required(),
  });

  return schama.validate(file);
}

module.exports.File = File;
module.exports.validate = validateFile;
