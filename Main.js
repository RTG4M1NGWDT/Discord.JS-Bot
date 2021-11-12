const {
    Client,
    Collection,
    Intents
} = require('discord.js');
const {
    TOKEN
} = process.env;

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
});

client.commands = new Collection();
client.aliases = new Collection();
client.queue = new Map();

client.on('ready', () => {
    console.log(`${client.user.username} is online!`);
    require('./handlers/EventHandler.js')(client);
    require('./handlers/CommandHandler.js')(client);
});

client.login(TOKEN);
