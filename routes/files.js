const { File, validateFile } = require("../models/file");
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

async function getFiles() {
  try {
    const files = await File.find();
    return files;
  } catch (err) {
    console.error(err);
  }
}

async function addFile() {
  const file = new File({
    name: "Angular file",
    author: "Mosh",
    tags: ["Angular", "frontend"],
    isPusblished: true,
  });
  try {
    const result = await file.save();
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

router.get("/", (req, res) => {
  getFiles()
    .then((files) => res.send(files))
    .catch((err) => res.send(err));
});

router.get("/:id", (req, res) => {
  getFileById(req.body.id)
    .then((file) => res.send(file))
    .catch((err) => res.send(err));
});

router.post("/", (req, res) => {
  const { error } = validateFile(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  console.log(req.body);
});

/*router.put("/:id", (req, res) => {
  const file = files.find((el) => el.id === parseInt(req.params.id));
  if (!file) {
    return res.status(404).send("The couse with the given ID was not found.");
  }

  const { error } = validateFile(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  file.name = req.body.name;
  res.send(file);
});

router.delete("/:id", (req, res) => {
  const file = await file.deleteOne({ _id: req.params.id });
  if (!file) {
    return res.status(404).send("The couse with the given ID was not found.");
  }

  res.send(file);
});*/

module.exports = router;
