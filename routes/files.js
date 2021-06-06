const Joi = require("joi");
const { File, validate } = require("../models/file");
const express = require("express");
const router = express.Router();

async function getFileById(id) {
  try {
    const file = await File.findById({ _id: id });
    return file;
  } catch (err) {
    console.error(err);
  }
}

async function deleteFileById(id) {
  try {
    const result = await File.deleteOne({ _id: id });
    return result;
  } catch (err) {
    console.error(err);
  }
}

async function getFiles(ownerId) {
  try {
    const files = await File.find({ ownerId });
    return files;
  } catch (err) {
    console.error(err);
  }
}

async function addFile() {
  const file = new File({
    name: "mihael1 file 6",
    ownerId: "609eb51d2c72ab2a74c699df",
  });
  try {
    const result = await file.save();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

router.get("/", (req, res) => {
  const schama = Joi.object({
    ownerId: Joi.string().required(),
  });
  const { error } = schama.validate(req.query);
  if (error) return res.status(400).send(error.details[0].message);

  getFiles(req.query.ownerId)
    .then((files) => res.send(files))
    .catch((err) => res.send(err));
});

router.post("/", (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  console.log(req.body);
});

router.delete("/", (req, res) => {
  const schama = Joi.object({
    _id: Joi.string().required(),
  });
  const { error } = schama.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);
  deleteFileById(req.body._id)
    .then((res) => res.send(res))
    .catch((err) => res.send(err));
});

module.exports = router;
