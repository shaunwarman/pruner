const FS = require('fs');
const Path = require('path');
const Pruner = require('..');
const Test = require('tape');

const {promisify} = require('util');

Test('pruner', t => {
  async function setup() {
    const files = ['readme.md', 'changelog.md', 'docs.txt', 'intro.txt'];
    const path = Path.resolve(process.cwd(), 'test', 'fixtures', 'app');

    const writeFile = promisify(FS.writeFile);

    for (let file of files) {
      const fd = `${path}/${file}`;
      await writeFile(fd, {}, {mode: 0o755});
    }
  }

  t.test('create', t => {
    t.equals(typeof Pruner, 'object');
    t.equals(typeof Pruner.prune, 'function');
    t.end();
  });

  t.test('path assertions', async t => {
    try {
      await Pruner.prune({});
    }
    catch (e) {
      t.ok(e.message, 'Path must be a string!');
      t.end();
    }
  });

  t.test('options assertions', async t => {
    try {
      await Pruner.prune('/tmp', 'null');
    }
    catch (e) {
      t.ok(e.message, 'Options must be a object!');
      t.end();
    }
  });

  t.test('remove md files', async t => {
    setup();

    try {
      const path = Path.resolve(process.cwd(), 'test', 'fixtures', 'app');

      await Pruner.prune(path, {types: ['.md']});
    }
    catch (e) {
      t.fail(e);
    }
    t.end();
  });

  t.test('remove multiple file types', async t => {
    setup();

    try {
      const path = Path.resolve(process.cwd(), 'test', 'fixtures', 'app');

      await Pruner.prune(path, {types: ['.md', '.txt']});
    }
    catch (e) {
      t.fail(e);
    }
    t.end();
  });
});
