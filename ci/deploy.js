const fs = require('fs');

function listFolderRecursive(path) {
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    fs.readdirSync(path).forEach(function (file, index) {
      const curPath = path + "/" + file;

      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        listFolderRecursive(curPath);
      } else {
        console.log(curPath + "....")
      }
    });
    console.log(path + "....")
  } else {
    console.log("Not exist : " + path)
  }
}

console.log("List dist folder...");

listFolderRecursive(process.argv[2] + "/electron/output");

console.log("Successfully list dist folder!");
