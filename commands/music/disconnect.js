const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    StreamType,
    AudioPlayerStatus
} = require('@discordjs/voice');
const { disconnect } = require('../../Utility.js');

module.exports = {
    aliases: ['p'],
    async execute(client, message, args) {
      const queue = client.queue.get(message.guild.id);
      disconnect(queue);
    }
}
