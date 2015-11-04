var rdf = require('rdf-ext');

var utils = {};

if (process.browser) {
  utils.readFile = function (filename) {
    return new Promise(function (resolve) {
      rdf.defaultRequest('GET', filename, {}, null, function (status, headers, content) {
        resolve(content);
      });
    });
  };
} else {
  utils.readFile = function (filename, base) {
    return new Promise(function (resolve) {
      resolve(require('fs').readFileSync(require('path').join(base, filename)).toString());
    });
  };
}

module.exports = utils;
