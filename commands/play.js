const ytdl = require('ytdl-core');
const search = require('yt-search');
const {RichEmbed} = require('discord.js');

module.exports = async (bot, message, active) => {
    if(!message.member.voiceChannel)    return message.channel.send('Please connect to a voice channel first');
    let song = message.content.substring(6);
    if(!song) return message.channel.send('Enter a song name after the command');

    let data = active.get(message.guild.id) || {};
    if(!data.connection) data.connection = await message.member.voiceChannel.join();
    if(!data.queue) data.queue = [];
    data.guildID = message.guild.id;

    search(song, async function(err, res) {

        if(err) return message.channel.send('Something went wrong');

        let info = res.videos[0];
        data.queue.push({
            songTitle: info.title,
            url: info.url,
            requester: message.author.username,
            announceChannel: message.channel.id
        });

        if(!data.dispatcher) play(bot, active, data);
        else{
            let embed = new RichEmbed().setTitle('Added To Queue:').setDescription(`${info.title}\n[@${message.author.username}]`).setColor('#30b3c1');
            message.channel.send(embed);
        }

        active.set(message.guild.id, data);
    });
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