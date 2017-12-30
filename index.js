const defaults = require('./defaults');

const {checkFile, removeFile, readDir} = require('./lib/util');

const NS_PER_SEC = 1e9;

// TODO
// Testing
// Allow configurable binary
// Allow patterns / globs in options or defaults

module.exports = {

  /**
   * prune - prune items from specified path
   *  with optional options
   *
   * @param {string} path - the file path to prune
   * @param {object} options - the options
   */
  async prune (path, options = defaults) {
    if (typeof path !== 'string') {
      throw new Error('Path must be a string!');
    }

    if (typeof options !== 'object') {
      throw new Error('Options must be an object!');
    }

    let removedFiles = [];
    let removedTotalSize = 0;

    // start time
    const start = process.hrtime();

    await _prune(path, options);

    // end time
    const [sec, nanosec] = process.hrtime(start);

    // private prune used for recursion while still..
    // ..maintaining captured timings
    async function _prune(path, options) {
      // read files in current path
      let files = await readDir(path);

      // iterate over files, cleaning up matches
      files.forEach(file => {
        options.types.forEach(async type => {
          if (file.includes(type)) {
            const {size} = await checkFile(path, file);
            removedTotalSize += size;
            removedFiles.push(file);
            try {
              await removeFile(path, file);
            }
            catch (e) {}
          }
        });
      });

      // if path ends in node_modules, dive into each directory
      if (path.split('/').pop() === 'node_modules') {
        for (let file of files) {
          await _prune(`${path}/${file}`, options);
        }
      }

      // if path contains node_modules then dive deeper
      if (files.includes('node_modules')) {
        await _prune(`${path}/node_modules`, options);
      }
    }

    console.log(`Removed ${removedFiles.length} files - ${removedTotalSize / 1e6} mb in size`);
    console.log(`Prune took ${((sec * NS_PER_SEC) + nanosec) / 1e6} milliseconds`);
  }
}
