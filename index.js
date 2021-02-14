// TODO:
//0. Display on system file upon intial load get()

//Setup Express
const express = require("express");
const app = express();
// app.use(express.static("public"));
app.use(express.static("uploads"));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const fileUpload = require("express-fileupload");
app.use(fileUpload());

//Setup node
const fs = require("fs");
const path = require("path");

// let cache = { 1: "test1", 2: "test2" };
let cache = {};
const port = 8080;
const uploadDir = __dirname + path.sep + "uploads";

//Serve Main page
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

//Upload
app.post("/upload", function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let uploadedFile = req.files.uploadfile;
  let uploadName = uploadDir + path.sep + uploadedFile.name;

  // uploadedFile.mv(uploadName, function (err) {
  //   if (err) return res.status(500).send(err);
  //   cache[`${uploadedFile.name}`] = {
  //     mimetype: uploadedFile.mimetype,
  //     data: uploadedFile.data,
  //   };
  //   res.send(`File ${uploadedFile.name} uploaded`);
  //   console.log(cache);
  // });

  //Promised read write
  function writeFile(name) {
    return new Promise((resolve, reject) => {
      fs.writeFile(uploadDir + path.sep + name, uploadedFile.data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(name);
        }
      });
    });
  }

  let readFile = function (fileName) {
    return new Promise((resolve, reject) => {
      fs.readFile(uploadDir + path.sep + fileName, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  };

  writeFile(uploadedFile.name)
    .then((filename) => readFile(filename))
    .then((data) => {
      cache[`${uploadedFile.name}`] = {
        mimetype: uploadedFile.mimetype,
        data: data,
      };
      res.send(`File ${uploadedFile.name} uploaded`);
      console.log(cache);
      // console.log(Object.keys(cache).length);
    });
});

//Download
app.get("/download/:filename", function (req, res) {
  const target = req.params.filename;
  res.setHeader("Content-Description", "File Transfer");
  res.setHeader("Content-Disposition", `attachment; filename=${target}`);
  res.setHeader("Content-Type", "application/octet-stream");
  res.end(cache[`${target}`].data);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
