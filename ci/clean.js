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

    console.log(`Deleting directory "${path}process.env.npm_config_dir +".`);
    fs.rmdirSync(path);
  }
}

console.log("Cleaning working tree...");

/* Main folder App */
deleteFolderRecursive(process.env.npm_config_dir + "/build");
deleteFolderRecursive(process.env.npm_config_dir + "/dist");
deleteFolderRecursive(process.env.npm_config_dir + "/node_modules");

/* Angular App */
deleteFolderRecursive(process.env.npm_config_dir + "/angular/dist");
deleteFolderRecursive(process.env.npm_config_dir + "/angular/build");
deleteFolderRecursive(process.env.npm_config_dir + "/angular/node_modules");

/* Electron App */
deleteFolderRecursive(process.env.npm_config_dir + "/electron/dist");
deleteFolderRecursive(process.env.npm_config_dir + "/electron/build");
deleteFolderRecursive(process.env.npm_config_dir + "/electron/node_modules");

console.log("Successfully cleaned working tree!");

// For Update ...
