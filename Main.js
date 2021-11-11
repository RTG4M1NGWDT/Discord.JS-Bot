const {
    Client,
    Intents
} = require('discord.js');
const {
    TOKEN
} = process.env;

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

client.on('ready', () => {
    console.log(`${client.user.username} is online!`);
    require('./handlers/EventHandler')(client);
});

client.login(TOKEN);
