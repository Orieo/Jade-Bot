const kick = require('../commands/kick');
const play = require('../commands/play');
const skip = require('../commands/skip');
const queue = require('../commands/showQueue');

module.exports = (client, message, active) => {
    if(message.content.startsWith('!kick')) {
        return kick(message);
    }else if(message.content.startsWith('!play')) {
        return play(client, message, active);
    }else if(message.content.startsWith('!skip')) {
        return skip(client, message, active);
    }else if(message.content.startsWith('!queue')) {
        return queue(client, message, active);
    }
}