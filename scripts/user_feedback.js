'use strict';

require('babel-register');

module.exports = (robot) => {
  robot.hear(/add feedback/, (res) => {
    res.send('@<==bwCMj=>');
  });
};
