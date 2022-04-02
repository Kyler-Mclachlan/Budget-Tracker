// website name is lychee-cobbler-55273 hello! thanks guys
const express = require("express");
// const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 3001;
const MONGODB_URI ='mongodb+srv://PW_USER:TestUser1@cluster0.yjdej.mongodb.net/budget?retryWrites=true&w=majority';

const app = express();

// app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true
});

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => console.log(`🌍 Connected on localhost:${PORT}`));