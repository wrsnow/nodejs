const path = require("path");
const fsPromises = require("fs/promises");

// It checks if the path
async function writeToJSONV2(fileName, data) {
  const filePath = path.join(__dirname, "..", "data", "JSON_DATA", fileName);
  try {
    const oldFile = await fsPromises.readFile(filePath, { encoding: "utf-8" });
    const parsedFile = oldFile ? JSON.parse(oldFile) : [];
    let newData = Array.isArray(data)
      ? [...parsedFile, ...data]
      : [...parsedFile, data];

    await fsPromises.writeFile(filePath, JSON.stringify(newData, null, 2));
  } catch (error) {
    if (String(error).includes("no such file or directory")) {
      try {
        const newData = Array.isArray(data) ? data : [data];
        await fsPromises.writeFile(filePath, JSON.stringify(newData, null, 2));
      } catch (error) {
        console.log(error);
      }
    } else {
      throw new Error(error);
    }
  }
}
