const fs = require("fs");

function appendToJSON(fileName, data) {
  fs.readFile(fileName, "utf-8", (err, fileData) => {
    if (err) {
      console.log("File " + fileName + " does not exist, and will be created.");
      return createNewJson(fileName, data);
    } else {
      let parsed;
      if (fileData.length <= 0) {
        parsed = [data];
      } else {
        parsed = JSON.parse(fileData);
        parsed.push(data);
      }
      fs.writeFile(fileName, JSON.stringify(parsed, null, 2), (err) => {
        if (err) return console.log(err);
        console.log("New data added successfully");
      });
    }
  });
}
function createNewJson(fileName, data) {
  let newFile;
  if (JSON.stringify(data).includes("[")) {
    newFile = data;
  } else {
    newFile = [data];
  }

  fs.writeFile(fileName, JSON.stringify(newFile, null, 2), (err) => {
    if (err) throw new Error(err);
  });
}
exports.appendToJSON = appendToJSON;
exports.createNewJson = createNewJson;
