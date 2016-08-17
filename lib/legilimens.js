'use strict';

const GitHub = require('github');
const github = new GitHub({
  debug: process.env.NODE_ENV === 'debug',
});

if (process.env.LEGILIMENS_API_TOKEN) {
  github.authenticate({type: 'oauth', token: process.env.LEGILIMENS_API_TOKEN});
}

/**
 * @api public
 */
function getPullRequests(owner, repo, opts) {
  opts = opts || {};
  opts.user = owner;
  opts.repo = repo;
  return github.pullRequests.getAll(opts);
}

/**
 * @api public
 */
function getLatestRelease(owner, repo) {
  return github.repos.getLatestRelease({user: owner, repo});
}

/**
 * @api public
 */
function getDiffFiles(owner, repo, base, head) {
  return github.repos.compareCommits({
    user: owner,
    repo,
    base,
    head,
  }).then((rv) => rv.files);
}

module.exports = {
  github,
  authenticate: github.authenticate.bind(github),

  getPullRequests,
  getLatestRelease,
  getDiffFiles,
};
