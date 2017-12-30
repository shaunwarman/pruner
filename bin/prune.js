#!/usr/bin/env node

const Path = require('path');
const Pruner = require('..');

const args = process.argv.slice(2);

let path = args.shift();
if (!path) {
  path = Path.resolve(process.cwd(), 'node_modules');
}

Pruner.prune(path);
