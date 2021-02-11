const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const path = require("path");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

let cache = {};
const uploadDir = __dirname + path.sep + "uploads";

function readFile(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(uploadDir + path.sep + fileName, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(body); //TODO:
      }
    });
  });
}

function writeFile(name, body) {
  return new Promise((resolve, reject) => {
    fs.writeFile(uploadDir, path.sep + name, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(readFile(body)); //TODO:
      }
    });
  });
}

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
  uploadPath = __dirname + path.sep + "uploads" + path.sep + uploadedFile.name;

  uploadedFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);

    res.send(`File ${req.files.uploadfile.name} uploaded`);
  });
});

let port = 8000;
app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

// TODO: Ensure your writeFile calls the readFile function at the end
