.PHONY: run install-hubot-bearychat

install-hubot-bearychat:
	@npm install --verbose --cache-min 999999 ./hubot-bearychat

run: install-hubot-bearychat
	@./bin/hubot -a bearychat -n 一言不合就开车斯基
