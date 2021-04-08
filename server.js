const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 3000;
var MONOGODB_URI = process.env.MONOGODB_URI || "mongodb://localhost/budget";

mongoose.connect(MONOGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false
});
const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));



// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
