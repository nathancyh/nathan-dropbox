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

let cache = {};
const port = 8080;
const uploadDir = __dirname + path.sep + "uploads";

//Promised read write
function writeFile(name, body) {
  return new Promise((resolve, reject) => {
    fs.writeFile(uploadDir, path.sep + name, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(name); //TODO: log back the newly written file?
      }
    });
  });
}

let readFile = function (fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(uploadDir + path.sep + fileName, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(body); //TODO:
      }
    });
  });
};

//Routing
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

//Upload
app.post("/upload", function (req, res) {
  // let uploadedFile;
  // let uploadPath;
  console.log(req.files);
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let uploadedFile = req.files.uploadfile;
  let uploadPath =
    __dirname + path.sep + "uploads" + path.sep + uploadedFile.name;

  uploadedFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);
    // console.log(req.files.uploadfile.name);
    res.send(`File ${req.files.uploadfile.name} uploaded`);
  });

  // writeFile() //TODO: pass in 'name' of array? or just an index
  //   .then(readFile)
  //   .catch((err) => {
  //     console.log(`error catched ${err}`);
  //   });
  //cache.push(req.body) //USE COUNT++?
  //cache.length // lol

  // var element = { name: name };
  // cache[`${count}`] = element;
  // cache[`${count}`] = { name: 5 , data: xxx};
  // cache[`${count}`] = { name: 10 };

  // Cart is now:
  // { "1": { quantity: 5 }, "2": { quantity: 10 } }
});

//Download
app.get("/download/:filename", function (req, res) {
  const file = `${__dirname}/uploads/${req.params.filename}`;
  console.log(req.params);
  console.log(file);
  res.download(file);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

// TODO: Ensure your writeFile calls the readFile function at the end
