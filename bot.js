const Discord = require('discord.js');
const auth    = require('./auth.json');
const config  = require('./config.json');
const client  = new Discord.Client();

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

// One tracker per person
var Tracker = function(n){
    this.name   = n;
	this.counts = {
    	"seen": 0,
    	"done": 0
	};
};

// Map the emoji to symantics
var Emoji = {
    '👍': 'seen',
    '💯': 'done'
};

// Keep a list of Trackers
var trackers = [];

client.once('ready', () => {
	console.log('Inspecting!');
	client.user.setActivity('the channel...', { type: 'LISTENING' });
});

client.on('messageReactionAdd', (mr, user) => {
    // Don't care about bot reactions or channels
    // that we aren't configured to watch.
	if (user.bot || mr.message.channel.name != config.channel) return;

	if (mr.emoji in Emoji) {
        var   found        = false;
        const reaction     = mr.emoji;
        const channel_name = mr.message.channel.name;

        console.log('Reaction in ch: ' + channel_name);

    	if (trackers.length === 0) {
        	// First time!
        	var t = new Tracker(user.username);
        	t.counts[Emoji[reaction]]++;
        	trackers.push(t);
    	} else {
        	// Try to find an existing tracker
        	for (var t of trackers) {
            	if (t.name === user.username) {
                	t.counts[Emoji[reaction]]++;
                	found = true;
                	break;
            	};
        	};
        	if (!found) {
            	// Need to add a new tracker
            	var t = new Tracker(user.username);
            	t.counts[Emoji[reaction]]++;
            	trackers.push(t);
        	};
    	};
	};
});

client.on('message', message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'inspect') {
		message.react(Emoji.seen)
			.then(() => message.react(Emoji.done))
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
