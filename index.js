//0. Display on system file upon intial load get()
//Get all uploaded files JSON
//

//Setup Express
const express = require("express");
const app = express();
// app.use(express.static("public"));
app.use(express.static("uploads"));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const fileUpload = require("express-fileupload");
app.use(fileUpload());
app.set("view engine", "pug");

//Setup node
const fs = require("fs");
const path = require("path");

// let cache = { 1: "test1", 2: "test2" };
let cache = {};
let fileList = {};
const port = 8080;
const uploadDir = __dirname + path.sep + "uploads";
let domMessage = [];

//Serve Main page
app.get("/", function (req, res) {
  // res.sendFile(__dirname + "/index.html"); //static page
  console.log(Object.keys(cache));
  res.render("index", {
    message0: Object.keys(cache)[0],
    message1: Object.keys(cache)[1],
    message2: Object.keys(cache)[2],
    message3: Object.keys(cache)[3],
    message4: Object.keys(cache)[4],
  });
});

//Upload
app.post("/upload", function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let uploadedFile = req.files.uploadfile;
  // let uploadName = uploadDir + path.sep + uploadedFile.name;

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
      fileList[`${uploadedFile.name}`] = {
        mimetype: uploadedFile.mimetype,
        url: `http://localhost:${port}/download/${uploadedFile.name}`,
      };
      res.status(200).send(`File ${uploadedFile.name} uploaded`);
      // console.log(cache);
      console.log(fileList);
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

//Get Filelist
app.get("/filelist", function (req, res) {
  res.status(200).json(fileList);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
