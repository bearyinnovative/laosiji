'use strict';

const {Adapter} = require('hubot');

const {
  HTTPClient, RTMClient,
  EventConnected, EventMessage, EventClosed, EventError,
} = require('./client');

class BearyChat extends Adapter {

  send(envelope, ...strings) {
    const msg = this.client.packMsg(false, envelope, strings);
    this.client.sendMsg(envelope, msg);
  }

  reply(envelope, ...strings) {
    const msg = this.client.packMsg(true, envelope, strings);
    this.client.sendMsg(envelope, msg);
  }

  run() {
    let tokens = process.env.HUBOT_BEARYCHAT_TOKENS;
    if (!tokens) {
      this.robot.logger.error('No BearyChat tokens provided to Hubot');
      return;
    }
    this.tokens = tokens.split(',');

    const mode = process.env.HUBOT_BEARYCHAT_MODE;
    if (mode && mode.toLowerCase() === 'rtm') {
      this.client = new RTMClient();
    } else {
      this.client = new HTTPClient();
    }

    this.client.on(EventConnected, () => this.emit('connected'));
    this.client.on(EventMessage, this.receive.bind(this));
    this.client.on(EventClosed, this.handleClosed.bind(this));
    this.client.on(EventError, this.handleError.bind(this));

    this.client.run(this.tokens, this.robot);
  }

  handleClosed() {
    this.robot.logger.error('client closed');

    this.robot.logger.info('restarting client');
    this.client.run(this.tokens, this.robot);
  }

  handleError(e) {
    this.robot.logger.error(`client error ${e}`);
  }

}

exports.use = (robot) => new BearyChat(robot);
