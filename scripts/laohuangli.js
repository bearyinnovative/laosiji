'use strict';

require('babel-register');

const huangli = require('l-a-a-s').huangli;

const todayHuangli = () => huangli();
const presentAct = (a) => {
  if (a.reason) {
    return `- **${a.name}**: ${a.reason}`;
  }
  return `- **${a.name}**`;
}

module.exports = (robot) => {
  robot.respond(/黄历$/i, (res) => {
    const respond = [
      '想问点什么呢？',
      '`黄历 女神`：今天女神是什么？',
      '`黄历 饮料`：今天喝点什么？',
      '`黄历 事宜`：今天干点什么？',
    ].join('\n');
    res.reply(respond);
  });
  robot.respond(/黄历.*女神$/i, (res) => {
    res.reply(`今日女神亲近指数: ${todayHuangli().goddess.symbol}`);
  });
  robot.respond(/黄历.*饮料$/i, (res) => {
    res.reply(`今日饮料推荐：${todayHuangli().drinkings.join('、')}`);
  });
  robot.respond(/黄历.*事宜$/i, (res) => {
    const acts = todayHuangli().activites;
    const goodActs = acts.good.map(presentAct).join('\n');
    const badActs = acts.bad.map(presentAct).join('\n');
    const respond = [
      '黄历告诉你，是日：',
      '**宜**',
      goodActs,
      '**忌**',
      badActs,
    ].join('\n');
    res.reply(respond);
  });
};
