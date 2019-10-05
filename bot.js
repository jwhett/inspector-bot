const Discord = require('discord.js');
const auth = require('./auth.json');
const client = new Discord.Client();

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('the channel...', { type: 'LISTENING' });
});

client.on('messageReactionAdd', (mr, user) => {
	//console.log("Reaction found: " + message.messageReaction.emoji + " from user: " + message.user.username);
	console.log("Reaction found!! Emoji: " + mr.emoji + " On: " + mr.message + " From: " + user.username);
});

client.on('message', message => {
	if (!message.content.startsWith(auth.prefix) || message.author.bot) return;

	const args = message.content.slice(auth.prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'inspect') {
		message.react('👍')
			.then(() => message.react('💯'))
			.catch(() => console.error('One of the emojis failed to react.'));
	}
});

client.login(auth.token);
