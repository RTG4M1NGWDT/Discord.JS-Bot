const { Client, Intents } = require('discord.js');
const { TOKEN } = process.env;

const client = new Client({
  intents: [Intents.FLAGS.GUILDS]
});

client.on('ready', () => {
  console.log(`${client.user.username} is online!`);
});

client.login(TOKEN);
