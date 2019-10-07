// One tracker per person
var Tracker = function(n){
    this.name = n;
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
