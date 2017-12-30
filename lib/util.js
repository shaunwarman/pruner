const FS = require('fs');
const Path = require('path');

const {promisify} = require('util');

const preaddir = promisify(FS.readdir);
const pstat = promisify(FS.stat);
const punlink = promisify(FS.unlink);

/**
 * check for file existence
 *
 * @param {string} path - the file path
 * @param {string} file - the file name
 */
function checkFile(path, file) {
  return pstat(Path.resolve(path, file));
}

/**
 * remove file
 *
 * @param {string} path - the file path
 * @param {string} file - the file name
 */
function removeFile(path, file) {
  return punlink(Path.resolve(path, file));
}

/**
 * read current directory
 *
 * @param {string} path - the file / directory path
 */
function readDir(path) {
  return preaddir(path);
}

module.exports = {
  checkFile,
  removeFile,
  readDir
};
