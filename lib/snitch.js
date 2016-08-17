'use strict';

const fs = require('fs');

let _fileDeps = null;
let _componentDeps = [];
let _ignoreFiles = [];

const _uniqueArray = (a) => Array.from((new Set(a)).values());

/**
 * Get file dependencies by file name.
 *
 * @param {String} fileName
 * @return {Object}
 * @api private
 */
function getDepsByFileName(fileName) {
  if (!_fileDeps) return null;

  for (let ns in _fileDeps) {
    const file = _fileDeps[ns];
    if (file.src === fileName) return file;
  }

  return null;
}

/**
 * Calculate components to update from edited file.
 *
 * @param {Object} file
 * @return {[]String}
 * @api private
 */
function getUpdateComponentsFromFile(file) {
  if (_ignoreFiles.indexOf(file.filename) !== -1) return [];

  const fileDeps = getDepsByFileName(file.filename);
  if (!fileDeps) return [];

  return _componentDeps
    .filter((component) => component.deps.indexOf(fileDeps.ns) !== -1)
    .map((component) => component.name);
}

/**
 * Calculate components to update from edited files.
 *
 * @param {[]Object} files
 * @return {[]String}
 * @api public
 */
function getUpdateComponents(files) {
  return _uniqueArray(files.reduce((acc, file) => {
    return acc.concat(getUpdateComponentsFromFile(file));
  }, []));
}

/**
 * Load file depdencies from env json.
 *
 * @api private
 */
function initFileDeps() {
  if (!process.env.SNITCH_FILE_DEPENDENCIES) return;

  const envJSON = process.env.SNITCH_FILE_DEPENDENCIES;
  _fileDeps = JSON.parse(fs.readFileSync(envJSON, 'utf-8'));
}

/**
 * Load component depdencies from env json.
 *
 * @api private
 */
function initComponentDeps() {
  if (!process.env.SNITCH_COMPONENT_DEPENDENCIES) return;

  const envJSON = process.env.SNITCH_COMPONENT_DEPENDENCIES;
  const v = JSON.parse(fs.readFileSync(envJSON, 'utf-8'));
  _componentDeps = v.components
    .map((component) => {
      const deps = component.files
        .map(getDepsByFileName)
        .filter((i) => i)
        .reduce((acc, i) => {
          acc.push(i.ns);
          return acc.concat(i.deps);
        }, []);
      component.deps = _uniqueArray(deps);
      return component;
    });
  _ignoreFiles = v.ignores;
}

module.exports = {
  getUpdateComponents,

  init: () => {
    initFileDeps();
    initComponentDeps();
  },
};
