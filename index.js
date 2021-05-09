const config = require("config");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const logger = require("./middleware/logger");
const express = require("express");
const files = require("./routes/files");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
app.use("/api/files", files);

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("connected to mongodb.."))
  .catch((err) => console.error("Cound not connect to monodb..", err));

console.log("application name: " + config.get("name"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
}

app.use(logger);

//set PORT=5000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
