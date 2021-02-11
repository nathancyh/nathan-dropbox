const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const path = require("path");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

let cache = {};

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/upload", function (req, res) {
  let uploadedFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  uploadedFile = req.files.uploadfile;
  uploadPath = __dirname + "/uploaded" + uploadedFile.name;

  uploadedFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    res.send(`File ${req.files.uploadfile.name} uploaded`);
  });
});

app.listen(8000, () => {
  console.log("App listening on port 8000!");
});

// function readFile(params) {
//   return new Promise(req, res) {

//   };
// }

function writeFile(params) {}
