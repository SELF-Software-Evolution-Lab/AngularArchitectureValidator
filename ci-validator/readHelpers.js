const fs = require('fs');

exports.readFile = async (filePath) => {
  try { return await fs.promises.readFile(filePath, 'utf8'); }
  catch (err) { throw new Error(`Error: There was a problem reading the file ${filePath}.`); }
}

exports.readDir = async (dirPath) => {
  try { return await fs.promises.readdir(dirPath, 'utf8'); }
  catch (err) { throw new Error(`Error: There was a problem reading the directory ${dirPath}.`); }
}