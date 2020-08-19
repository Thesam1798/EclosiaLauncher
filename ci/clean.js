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

/* Main folder App */
deleteFolderRecursive(process.argv[2] + "/dist");
deleteFolderRecursive(process.argv[2] + "/output");
deleteFolderRecursive(process.argv[2] + "/node_modules");

/* Angular App */
deleteFolderRecursive(process.argv[2] + "/angular/node_modules");

/* Electron App */
deleteFolderRecursive(process.argv[2] + "/electron/dist");
deleteFolderRecursive(process.argv[2] + "/electron/node_modules");

console.log("Successfully cleaned working tree!");

// For Update ...
