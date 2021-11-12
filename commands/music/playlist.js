const ytdl = require('ytdl-core');
const ytpl = require('ytpl');

const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    StreamType,
    AudioPlayerStatus
} = require('@discordjs/voice');
const {
    getDuration,
    sendEmbed,
    playSong
} = require('../../Utility.js');

module.exports = {
    aliases: [],
    async execute(client, message, args) {
        const voice_channel = message.member.voice.channel;
        
        if (!voice_channel) {
            return sendEmbed(message.channel, "ERROR", "RED", "Please join a voice channel first!");
        }
        
        const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : '';
        
        if (/^.*(youtu.be\/|list=)([^#&?]*).*/gi.test(url)) {
            const search = await ytpl(url.split('list=')[1].split('&index=')[0]).catch();
            if(!search) return sendEmbed(message.channel, "ERROR", "RED", "I could not find a playlist with that url.");
            const results = search.items;
            playSong(message.guild, results, client);
        } else {
            return sendEmbed(message.channel, "ERROR", "RED", "Searching for playlists by name is not yet supported.");
        }
    }
}
