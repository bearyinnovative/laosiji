'use strict';

module.exports = (robot) => {
  const showUsage = (res) => {
    res.send('来个投票 "今晚吃啥" "KFC" "麦当劳" "兰州拉面"');
  };

  const reactions = [
    ':smile:',
    ':neutral_face:',
    ':+1:',
    ':tada:',
    ':hearts:',
  ];

  robot.respond(/来个投票(.*)/i, (res) => {
    if (res.match.length < 2) {
      showUsage(res);
      return;
    }

    let q = res.match[1].trim().split(/\s+/);
    if (!q || q.length < 3 || q.length > reactions.length) {
      showUsage(res);
      return;
    }

    q = q.map((i) => i.replace(/^"+/, '').replace(/"+$/, ''));
    const title = q[0];
    const options = q.splice(1);

    const m = [
      `@<-channel-> 投票啦！！！ ${title}`,
    ];
    for (let i = 0; i < options.length; i++) {
      m.push(`- 投 ${options[i]} 点个 ${reactions[i]}`);
    }
    res.send(m.join('\n'));
  });
};
