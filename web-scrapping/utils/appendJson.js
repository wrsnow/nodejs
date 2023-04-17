const fs = require("fs");
const path = require("path");
const fsPromises = require("fs/promises");

async function writeToJSON(fileName, data) {
  console.log("INSIDE writeToJSON");
  console.log(data);

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "data"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "data"));
    }
    if (!fs.existsSync(path.join(__dirname, "..", "data", "JSON_DATA"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "data", "JSON_DATA"));
    }

    await fsPromises.writeFile(
      path.join(__dirname, "..", "data", "JSON_DATA", fileName),
      JSON.stringify(data, null, 2)
    );
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = writeToJSON;
