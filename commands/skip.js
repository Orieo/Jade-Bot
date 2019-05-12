const ytdl = require('ytdl-core');
const {RichEmbed} = require('discord.js');

module.exports = async (bot, message, active) => {

    let data = active.get(message.guild.id) || {};
    if(!data.queue) message.channel.send(`There are no songs in the queue`);
    else{
        finish(bot, active, data.dispatcher);
    }
}

async function play(client, active, data) {
    const embed = new RichEmbed().setTitle('Now Playing:').setDescription(`${data.queue[0].songTitle}\n[@${data.queue[0].requester}]`).setColor('#30b3c1');
    client.channels.get(data.queue[0].announceChannel).send(embed);
    data.dispatcher = await data.connection.playStream(ytdl(data.queue[0].url, {filter: 'audioonly', quality: 'highestaudio'}));
    data.dispatcher.guildID = data.guildID;
    data.dispatcher.once('finish', function() {
        finish(client, active, dispatcher);
    });
}

function finish(client, active, dispatcher) {
    let fetched = active.get(dispatcher.guildID);
    fetched.queue.shift();

    if(fetched.queue.length > 0) {
        active.set(dispatcher.guildID, fetched);
        play(client, active, fetched);
    }else{
        active.delete(dispatcher.guildID);
        let vc = client.guilds.get(dispatcher.guildID).me.voiceChannel;
        if(vc) vc.leave();
    }
}