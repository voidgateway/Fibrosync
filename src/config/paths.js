const path = require('node:path');

const ROOT_DIR = path.resolve(__dirname, '..', '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

module.exports = {
  ROOT_DIR,
  PUBLIC_DIR,
  VIEWS_DIR: path.join(PUBLIC_DIR, 'views'),
  ASSETS_DIR: path.join(PUBLIC_DIR, 'assets'),
};
