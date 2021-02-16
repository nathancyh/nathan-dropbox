"use strict";
let node;
let textnode;
let message = [];
fetch("http://localhost:8080/filelist")
  .then((response) => response.json())
  .then((data) => {
    for (let index = 0; index < Object.keys(data).length; index++) {
      if (Object.keys(data)[index] != undefined) {
        message[index] = Object.keys(data)[index];
        node = document.createElement("LI");
        textnode = document.createTextNode(message[index]);
        node.appendChild(textnode);
        document.getElementById("filelist").appendChild(node);
      } else {
        message[index] = "";
      }
    }
  });
