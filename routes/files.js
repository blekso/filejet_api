const Joi = require("joi");
const { File, validate } = require("../models/file");
const express = require("express");
const formidable = require("formidable");
var Binary = require("mongodb").Binary;
const fs = require("fs");
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

async function addFile(newFile) {
  const file = new File(newFile);
  try {
    const result = await file.save();
    return result;
  } catch (err) {
    return err;
  }
}

router.get("/", (req, res) => {
  const schama = Joi.object({
    ownerId: Joi.string().required(),
  });
  const { error } = schama.validate(req.query);
  if (error) return res.status(400).send(error.details[0].message);

  getFiles(req.query.ownerId)
    .then((files) => {
      files.forEach((file) => delete file.file_data);
      console.log(files);
      //res.send(files);
    })
    .catch((err) => res.send(err));
});

router.get("/download", async function (req, res) {
  const schama = Joi.object({
    _id: Joi.string().required(),
    ownerId: Joi.string().required(),
  });

  const { error } = schama.validate(req.query);
  if (error) return res.status(400).send(error.details[0].message);

  const file = await getFileById(req.query._id);

  console.log(file);

  res.writeHead(200, {
    "Content-Type": file.type,
    "Content-disposition": "attachment;filename=" + file.name,
    "Content-Length": file.size,
  });

  res.end(Buffer.from(file.file_data, "binary"));
});

router.post("/", (req, res) => {
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    const verifyFile = {
      name: files.File.name,
      type: files.File.type,
      path: files.File.path,
      size: files.File.size,
      lastModifiedDate: files.File.lastModifiedDate,
    };
    const { error } = validate(verifyFile);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    var data = fs.readFileSync(files.File.path);
    var insert_data = { ...files.File };
    insert_data.ownerId = fields.ownerId;
    insert_data.file_data = Binary(data);
    const result = addFile(insert_data);
    res.send(result);
  });
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
