const Discord = require('discord.js');
const auth = require('./auth.json');
const client = new Discord.Client();

client.once('ready', () => {
    	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(auth.prefix) || message.author.bot) return;

	const args = message.content.slice(auth.prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'inspect') {
		message.react('👍');
	}
});

client.login(auth.token);
