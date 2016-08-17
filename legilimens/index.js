'use strict';

const GitHub = require('github');
const github = new GitHub({
  debug: process.env.NODE_ENV === 'debug',
});

if (process.env.LEGILIMENS_API_TOKEN) {
  github.authenticate({type: 'oauth', token: process.env.LEGILIMENS_API_TOKEN});
}

/**
 * Get latest release.
 *
 * @param {String} owner
 * @param {String} repo
 * @return {Promise<Object>}
 * @api public
 */
function getLatestRelease(owner, repo) {
  return github.repos.getLatestRelease({user: owner, repo});
}

/**
 * Get diff files between commits
 *
 * @param {String} owner
 * @param {String} repo
 * @param {String} base
 * @param {String} head
 * @return {Promise<[]Object>}
 * @api public
 */
function getDiffFiles(owner, repo, base, head) {
  return github.repos.compareCommits({
    user: owner,
    repo,
    base,
    head
  }).then((rv) => rv.files);
}

/**
 * Get pull requests report.
 *
 * @param {String} owner
 * @param {String} repo
 * @param {String} baseBranch (optional)
 * @return {Promise<Object>}
 * @api public
 */
function report(owner, repo, baseBranch) {
  baseBranch = baseBranch || 'master';

  return Promise.all([
    github.pullRequests.getAll({
      user: owner,
      repo,
      state: 'closed',
      sort: 'updated',
      direction: 'desc',
    }),
    getLatestRelease(owner, repo),
  ]).then((rvs) => {
    const prs = rvs[0];
    const latestRelease = rvs[1];
    const lastReleaseTime = new Date(latestRelease.created_at);
    const prsAfterLastRelease = prs
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
      _raw: {pullRequests: prs, latestRelease},
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
  });
}

module.exports = {
  authenticate: github.authenticate.bind(github),
  github,

  getLatestRelease,
  getDiffFiles,
  report,
};
