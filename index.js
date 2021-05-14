const config = require("config");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const logger = require("./middleware/logger");
const express = require("express");
const auth = require("./routes/auth");
const files = require("./routes/files");
const users = require("./routes/users");
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.error("JwtPrivateKey is not defined.");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB.."))
  .catch((err) => console.error("Cound not connect to MongoDB..", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use("/api/files", files);
app.use("/api/users", users);
app.use("/api/auth", auth);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
}

app.use(logger);

//set PORT=5000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
