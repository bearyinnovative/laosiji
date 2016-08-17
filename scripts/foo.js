'use strict';

const _ = require('underscore');

module.exports = (robot) => {
  robot.hear(/^foo$/i, (res) => {
    res.send('bar');
  });

  const mentioned = new RegExp(`^${robot.name}`, 'i');

  robot.catchAll((msg) => {
    if (msg.message.text.match(mentioned)) {
      msg.send(_.sample([
        '好的我知道了',
        '宝宝真棒',
        '[你收到了一个 BearyChat 红包，请升级后查收]',
      ], 1)[0]);
    }

    msg.finish();
  });
};
