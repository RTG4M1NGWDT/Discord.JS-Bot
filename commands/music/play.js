const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
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
    play
} = require('../../Utility.js');

module.exports = {
    aliases: ['p'],
    async execute(client, message, args) {
        play(message, args.join(" "));
    }
}
