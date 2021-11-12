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
    sendEmbed
} = require('../../Utility.cjs');

module.exports = {
    aliases: ['p'],
    async execute(client, message, args) {
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) {
            return sendEmbed(message.channel, "ERROR", "RED", "Please join a voice channel first!");
        }

        const server_queue = client.queue.get(message.guild.id);


        if (!args.length) return sendEmbed(message.channel, "ERROR", "RED", "Please specify what song you want me to play!")
        let song = {};

        const search = await ytsr(args.join(" "));
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
                voice_channel: voice_channel,
                text_channel: message.channel,
                connection: null,
                songs: [],
                audio_player: player
            }
            client.queue.set(message.guild.id, queue_constructor);
            queue_constructor.songs.push(song);
            try {
                const connection1 = await joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator
                });
                queue_constructor.connection = connection1;
                video_player(message.guild, queue_constructor.songs[0], client);
            } catch (err) {
                client.queue.delete(message.guild.id)
                sendEmbed(message.channel, "ERROR", "RED", "An error has occured");
                throw err;
            }

        } else {
            server_queue.songs.push(song);
            sendEmbed(message.channel, "Song Added", "BLUE", `Added ${song.name} to the queue!`);
        }

    }
}
const video_player = async (guild, song, client) => {
    const song_queue = client.queue.get(guild.id);
    const Discord = require('discord.js');
    if (!song) {
        song_queue.connection.destroy();
        sendEmbed(song_queue.text_channel, "No more songs", "RED", "There are no more songs left in the queue so I have left the voice channel.");
        client.queue.delete(guild.id);
        return;
    } else {
        const stream = ytdl(song.url, {
            filter: 'audioonly'
        });
        let resource = createAudioResource(stream, {
            inputType: StreamType.Arbitrary,
        });
        song_queue.audio_player.play(resource);
        song_queue.connection.subscribe(song_queue.audio_player);
        song_queue.audio_player.on(AudioPlayerStatus.Idle, () => {
            song_queue.songs.shift();
            video_player(guild, song_queue.songs[0], client);
        });
        sendEmbed(song_queue.text_channel, "Now Playing", "BLUE", `Now Playing ${song.name}`);
    }
}
