const { toggleAutoplay } = require('../../Utility.js');
const { AudioPlayerStatus } = require('@discordjs/voice');
const ytsr = require('ytsr');
const ytdl = require('ytdl-core');

module.exports = {
  aliases: [],
  async execute(client, message, args) {
    toggleAutoplay(message);
  }    
}
