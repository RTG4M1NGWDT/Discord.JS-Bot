const {
    Client,
    Channel,
    Guild,
    Message,
    MessageEmbed
} = require('discord.js');
const ytdl = require('ytdl-core');
const ytsr = require('ytsr');
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    StreamType,
    AudioPlayerStatus
} = require('@discordjs/voice');

/**
 * @param {Channel} channel - Represents any channel on Discord.
 * @param {string} title - The title.
 * @param {string} color - The color.
 * @param {string} description - The description.
 * @param {Object} fields - The fields.
 * @param {string} footer - The footer.
 * @param {string} image - The image.
 * @param {string} thumbnail - The thumbnail.
 * @param {string[]} timestamp - The timestamp. 
 * @param {string} url - The url.
 */
const sendEmbed = (channel, title, color, description, fields, footer, image, thumbnail, timestamp, url) => {
    const embed = new MessageEmbed()

    if (!channel) return console.warn("Please provide a value for channel!");
    if (!(channel instanceof Channel)) return console.warn("That is not a channel! Please provide a channel!")

    if (!title) title = "Null";
    embed.setTitle(`${title}`)

    if (!color) color = "BLUE";
    embed.setColor(`${color}`)

    if (!description) {} else embed.setDescription(description);

    if (!fields) {} else embed.addFields(fields);

    if (!footer) {} else embed.setFooter(footer);

    if (!image) {} else embed.setImage(image);

    if (!thumbnail) {} else embed.setThumbnail(thumbnail);

    if (!timestamp) {} else embed.setTimestamp(timestamp);

    if (!url) {} else embed.setURL(url);

    channel.send({
        embeds: [embed]
    });
}


/**
 * @param {number} seconds - The seconds
 */
const getDuration = (seconds) => {
    const format = val => `0${Math.floor(val)}`.slice(-2);
    const hours = seconds / 3600;
    const minutes = (seconds % 3600) / 60;

    if (Math.floor(hours) == 0) {
        return [minutes, seconds % 60].map(format).join(':');
    }

    return [hours, minutes, seconds % 60].map(format).join(':')
}

/**
 * @param {Guild} guild - Represents a guild (or a server) on Discord.
 * @param {Object} song - The songs.
 * @param {Client} client - The main hub for interacting with the Discord API.
*/
const playSong = async (guild, song, client) => {
    const song_queue = client.queue.get(guild.id);
    if (!song) {
      setTimeout(() => {
        if(!song) {
          song_queue.connection.destroy();
          sendEmbed(song_queue.text_channel, "No more songs", "RED", "There are no more songs left in the queue so I have left the voice channel.");
          client.queue.delete(guild.id);
          return;
        }
      }, 10000)
    } else {
            const stream = ytdl(song.url, {
                filter: 'audioonly'
            });
        let resource = createAudioResource(stream, {
            inputType: StreamType.Arbitrary,
        });
        song_queue.audio_player.play(resource);
        song_queue.connection.subscribe(song_queue.audio_player);
        song_queue.audio_player.on(AudioPlayerStatus.Idle, async () => {
            song_queue.songs.shift();
            playSong(guild, song_queue.songs[0], client);
        });
        sendEmbed(song_queue.text_channel, "Now Playing", "BLUE", `Now Playing ${song.name}`);
        song_queue.nowPlaying = song;
        
        if(song_queue.autoplay == true) {
          const search = await ytsr(song_queue.nowPlaying.name);
          const info = await ytdl.getInfo(search.items[0].url)
          const related = info.related_videos;
          const index = Math.floor(Math.random() * (related.length - 2 - 0 + 1) + 0);
          play(song_queue.message, related[index].title)
      }
    }
}

/**
* @param {Message} message
* @param {Object} song
*/
const play = async (message, query) => {
    const voice_channel = message.member.voice.channel;
    
    if (!voice_channel) {
        return sendEmbed(message.channel, "ERROR", "RED", "Please join a voice channel first!");
    }

    const server_queue = message.client.queue.get(message.guild.id);
    
    if (!query.length) return sendEmbed(message.channel, "ERROR", "RED", "Please specify what song you want me to play!")
    
    let song = {};
    const search = await ytsr(query);
    const song_info = await ytdl.getInfo(search.items[0].url);
    
    song = {
        age_restricted: song_info.videoDetails.age_restricted,
        chapters: song_info.videoDetails.chapters,
        dislikes: song_info.videoDetails.dislikes,
        duration: getDuration(song_info.videoDetails.lengthSeconds),
        formattedDuration: `${getDuration(song_info.videoDetails.lengthSeconds)}`,
        id: song_info.videoDetails.videoId,
        isLive: song_info.videoDetails.isLiveContent,
        likes: song_info.videoDetails.likes,
        member: message.member,
        name: song_info.videoDetails.title,
        related: song_info.related_videos,
        thumbnail: song_info.videoDetails.thumbnails[0].url,
        uploader: {
            name: song_info.videoDetails.author.name,
            url: song_info.videoDetails.author.channel_url,
        },
        url: song_info.videoDetails.video_url,
        user: message.member.user,
        views: song_info.videoDetails.viewCount
    }
    
    if (!server_queue) {
        const player = createAudioPlayer();
        
        player.on('error', error => {
            console.error(error);
            sendEmbed(message.channel, "ERROR", "RED", "An error has occured");
        });
        
        const queue_constructor = {
            message: message,
            voice_channel: voice_channel,
            text_channel: message.channel,
            connection: null,
            songs: [],
            audio_player: player,
            autoplay: false,
            nowPlaying: null
        }
        
        message.client.queue.set(message.guild.id, queue_constructor);
        queue_constructor.songs.push(song);
        
        try {
            const connection1 = await joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            });
            
            queue_constructor.connection = connection1;
            playSong(message.guild, queue_constructor.songs[0], message.client);
        } catch (err) {
            message.client.queue.delete(message.guild.id)
            sendEmbed(message.channel, "ERROR", "RED", "An error has occured");
            throw err;
        }
    } else {
        server_queue.songs.push(song);
        sendEmbed(message.channel, "Song Added", "BLUE", `Added ${song.name} to the queue!`);
    }
}

const toggleAutoplay = async (message) => {
  const queue = message.client.queue.get(message.guild.id);
  if(!queue || !queue.songs) {
    return sendEmbed(message.channel, "ERROR", "RED", "Please play some songs before using this command.");
  }
  message.client.queue.get(message.guild.id).autoplay = !message.client.queue.get(message.guild.id).autoplay;
  
  message.channel.send(`Autoplay activation is currently ${queue.autoplay.toString()}`)

  if(queue.autoplay == true) {
    const search = await ytsr(queue.nowPlaying.name);
    const info = await ytdl.getInfo(search.items[0].url)
    const related = info.related_videos;
    const index = Math.floor(Math.random() * (related.length - 2 - 0 + 1) + 0);
    play(message, related[index].title)
  }
}

const getQueue = (queue) => {
  let allSongs = [];
  
  try {
    for (var index in queue.songs) {
      allSongs.push(queue.songs[index].name);
    }
    return allSongs.join("\n");
  } catch(err) {
    return "Queue is empty";
  }
}

const skip = (queue) => {
  queue.audio_player.stop();
  sendEmbed(queue.text_channel, "Song Skipped!", "BLUE", "Song Skipped!");
}

const disconnect = (queue) => {
  queue.connection.destroy();
  const message = queue.message;
  sendEmbed(queue.text_channel, "Music Stopped!", "BLUE", "Music Stopped!");
  message.client.queue.delete(queue.text_channel.guild.id);
}

module.exports.sendEmbed = sendEmbed;
module.exports.getDuration = getDuration;
module.exports.play = play;
module.exports.toggleAutoplay = toggleAutoplay;
module.exports.getQueue = getQueue;
module.exports.skip = skip;
module.exports.disconnect = disconnect;
