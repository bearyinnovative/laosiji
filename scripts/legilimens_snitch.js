'use strict';

require('babel-register');

const legilimens = require('../lib/legilimens');
const snitch = require('../lib/snitch');
snitch.init();

const owner = 'bearyinnovative';
const repo = 'snitch';
const prOpts = {state: 'closed', sort: 'updated', direction: 'desc'};

function getReleaseLog(latestRelease, pullRequests, baseBranch) {
  baseBranch = baseBranch || 'master';

  const lastReleaseTime = new Date(latestRelease.created_at);
  const prsAfterLastRelease = pullRequests
    .filter((pr) => new Date(pr.merged_at) > lastReleaseTime)
    .filter((pr) => pr.base.ref === baseBranch);

  const lds = lastReleaseTime.toLocaleDateString();
  const lts = lastReleaseTime.toLocaleTimeString();
  const report = [
    `Last release time is ${lds} ${lts}`,
  ];

  const rv = {
    lastReleaseTime,
    pullRequestsAfterLastRelease: prsAfterLastRelease,
  };

  if (prsAfterLastRelease.length > 0) {
    prsAfterLastRelease.forEach((pr, idx) => {
      report.push(`${idx + 1}. #${pr.number} ${pr.title} by @${pr.user.login}`);
    });
  } else {
    report.push('No new pull requests be merged');
  }

  rv.report = report.join('\n');

  return rv;
}

module.exports = (robot) => {
  robot.respond(/snitch (上啥|deploy check)$/i, (res) => {
    Promise.all([
      legilimens.getLatestRelease(owner, repo),
      legilimens.getPullRequests(owner, repo, prOpts),
    ]).then((rv) => {
      const latestRelease = rv[0];
      const pullRequests = rv[1];

      const releaseLog = getReleaseLog(latestRelease, pullRequests);

      res.reply([
        '',
        '**snitch** 要上',
        '```',
        releaseLog.report,
        '```',
      ].join('\n'));

      return legilimens.getDiffFiles(
        owner, repo, latestRelease.tag_name, 'master'
      ).then((files) => {
        const componentsToUpdate = snitch.getUpdateComponents(files);
        if (componentsToUpdate.length <= 0) return;
        res.reply([
          '',
          '还有要重新部署',
          '```',
          componentsToUpdate.map((c) => `- ${c}`).join('\n'),
          '```',
        ].join('\n'));
      });
    }).catch((e) => {
      res.reply(e.toString());
    });
  });
};
