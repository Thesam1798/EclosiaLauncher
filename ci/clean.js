const fs = require('fs');

function deleteFolderRecursive(path) {
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    fs.readdirSync(path).forEach(function (file, index) {
      const curPath = path + "/" + file;

      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

console.log("Cleaning working tree...");

deleteFolderRecursive(process.argv[2] + "/dist");
deleteFolderRecursive(process.argv[2] + "/electron/output");

deleteFolderRecursive(process.argv[2] + "/electron/node_modules");
deleteFolderRecursive(process.argv[2] + "/angular/node_modules");

console.log("Successfully cleaned working tree!");

// For Update ...
