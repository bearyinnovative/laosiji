'use strict';

require('babel-register');

const legilimens = require('legilimens');
const snitch = require('../lib/snitch');
snitch.init();

const owner = 'bearyinnovative';


module.exports = (robot) => {
  robot.respond(/(今晚上啥|check:).*snitch$/i, (res) => {
    legilimens.report(owner, 'snitch').then((r) => {
      res.reply([
        '',
        '今晚 **snitch** 要上',
        '```',
        r.report,
        '```',
      ].join('\n'));
    }).catch((e) => {
      res.reply(e.toString());
    });
  });

  robot.respond(/(今晚上啥|check:).*pensieve/i, (res) => {
    legilimens.report(owner, 'pensieve').then((r) => {
      res.reply([
        '',
        '今晚 **pensieve** 要上',
        '```',
        r.report,
        '```',
      ].join('\n'));
    }).catch((e) => {
      res.reply(e.toString());
    });
  });

  robot.respond(/(部署啥|check deploy:).*snitch$/i, (res) => {
     legilimens
      .getLatestRelease(owner, 'snitch')
      .then((latestRelease) => {
        return legilimens.getDiffFiles(
          owner,
          'snitch',
          latestRelease.tag_name,
          'master'
        );
      })
      .then((files) => {
        const components = snitch.getUpdateComponents(files);
        if (components.length > 0) {
          res.reply([
            '**snitch** 要部署',
            '```',
            components.map((c) => `- ${c}`).join('\n'),
            '```',
          ].join('\n'));
        } else {
          res.reply('snitch 没有什么要部署的');
        }
      })
      .catch((e) => {
        res.reply(e.toString());
      });
  });
};
