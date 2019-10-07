const Discord = require('discord.js');
const auth = require('./auth.json');
const config = require('./config.json');
const client = new Discord.Client();

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

// Map the emoji to symantics
const Emoji = {
	'👍': 'seen',
	'💯': 'done',
};

// One tracker per person
const Tracker = function(n) {
	this.name = n;
	this.counts = {
		'seen': 0,
		'done': 0,
	};
};

// Keep a list of Trackers
const trackers = [];

const start_time = new Date();

function addNewTracker(name, reaction) {
	const new_tracker = new Tracker(name);
	new_tracker.counts[Emoji[reaction]]++;
	trackers.push(new_tracker);
}

client.once('ready', () => {
	console.log('Inspecting!');
	client.user.setActivity('the channel...', { type: 'LISTENING' });
});

client.on('messageReactionAdd', (mr, user) => {
	// Don't care about bot reactions or channels
	// that we aren't configured to watch.
	if (user.bot || mr.message.channel.name != config.channel) return;

	if (mr.emoji in Emoji) {
		let found = false;
		const reaction = mr.emoji;

		if (trackers.length === 0) {
			addNewTracker(user.username, reaction);
		}
		else {
			// Try to find an existing tracker
			for (const t of trackers) {
				if (t.name === user.username) {
					t.counts[Emoji[reaction]]++;
					found = true;
					break;
				}
			}
			if (!found) {
				addNewTracker(user.username, reaction);
			}
		}
	}
});

client.on('message', message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;
	if (!config.users.includes(message.author.username)) {
		console.log('Got: ' + message.author.name + ' and it didn\'t match.');
		return;
	}

	const dm_target = message.author;
	const args = message.content.slice(config.prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'status') {
		message.react('👍')
			.catch(() => console.error('One of the emojis failed to react.'));
		dm_target.send('I have ' + trackers.length + ' trackers for the ' + config.channel + ' channel. Up since: ' + start_time);
	}
	if (command === 'report') {
		dm_target.send('Here\'s what I\'ve been tracking in ' + config.channel + ':');
		for (const t of trackers) {
			dm_target.send(t.name + ' saw: *' + t.counts.seen + '* and completed: *' + t.counts.done + '*');
		}
	}
});

client.login(auth.token);
