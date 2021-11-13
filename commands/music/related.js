const { play } = require('../../Utility.js');
const { AudioPlayerStatus } = require('@discordjs/voice');
const ytsr = require('ytsr');
const ytdl = require('ytdl-core');

module.exports = {
  aliases: [],
  async execute(client, message, args) {
    const search = await ytsr(queue.nowPlaying.name);
    const info = await ytdl.getInfo(search.items[0].url)
    const related = info.related_videos[0];
    play(message, related[0].title)
  }    
}
