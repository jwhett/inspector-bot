const Discord = require('discord.js');
const auth = require('./auth.json');
const tracking = require('./tracker.js');
const client = new Discord.Client();

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

// Keep a list of Trackers
var trackers = [];

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('the channel...', { type: 'LISTENING' });
});

client.on('messageReactionAdd', (mr, user) => {
	//console.log("Reaction found!! tracking.Emoji: " + mr.emoji + " On: " + mr.message + " From: " + user.username);
	if (user.bot) {
    	console.log("that's a bot");
    	return // Ignore bot reactions
	};
	if (mr.emoji in tracking.Emoji) {
    	var found = false;
    	var reaction = mr.emoji;
    	if (trackers.length === 0) {
        	// First time!
        	var t = new tracking.Tracker(user.username);
        	t.counts[tracking.Emoji[reaction]]++;
        	trackers.push(t);
    	} else {
        	// Try to find an existing tracker
        	for (var t of trackers) {
            	if (t.name === user.username) {
                	t.counts[tracking.Emoji[reaction]]++;
                	found = true;
                	break;
            	};
        	};
        	if (!found) {
            	// Need to add a new tracker
            	var t = new tracking.Tracker(user.username);
            	t.counts[tracking.Emoji[reaction]]++;
            	trackers.push(t);
        	};
    	};
	};
});

client.on('message', message => {
	if (!message.content.startsWith(auth.prefix) || message.author.bot) return;

	const args = message.content.slice(auth.prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'inspect') {
		message.react(tracking.Emoji.seen)
			.then(() => message.react(tracking.Emoji.done))
			.catch(() => console.error('One of the emojis failed to react.'));
	};
	if (command === 'report') {
    	message.channel.send("Here's what I have tracked:");
    	for (var t of trackers) {
        	message.channel.send(t.name + " saw: *" + t.counts.seen + "* and completed: *" + t.counts.done + "*");
    	};
	};
});

client.login(auth.token);
