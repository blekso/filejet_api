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
    name: "mihael1 file 2",
    ownerId: "60a903e214935739c8dd1740",
  });
  try {
    const result = await file.save();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

router.get("/", (req, res) => {
  /*const schama = Joi.object({
    ownerId: Joi.string().required(),
  });
  const { error } = schama.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);*/

  /*getFiles(req.body.ownerId)
    .then((files) => res.send(files))
    .catch((err) => res.send(err));*/

  const ownerId = "60a903e214935739c8dd1740";
  getFiles(ownerId)
    .then((files) => res.send(files))
    .catch((err) => res.send(err));
});

/*router.get("/:id", (req, res) => {
  getFileById(req.body.id)
    .then((file) => res.send(file))
    .catch((err) => res.send(err));
});*/

router.post("/", (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  console.log(req.body);
});

module.exports = router;
