'use strict';

const exec = require('child_process').exec;

module.exports = (robot) => {
  robot.respond(/睡一觉$/i, (res) => {
    const root = process.env.LAOSIJI_ROOT;
    if (!root) return;

    const cmd = `cd ${root} && git fetch origin && git reset --hard origin/master`;
    exec(cmd, (e, stdout, stderr) => {
      if (e) {
        res.reply(e);
      } else {
        res.reply('代码更新了，我去重启了。。。');
        exec('supervisorctl restart laosiji');
      }
    });
  });
};
