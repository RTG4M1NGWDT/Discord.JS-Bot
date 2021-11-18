const Command = require("../../base/Command");
const got = require("got");
const { MessageEmbed } = require("discord.js");

class Goosey extends Command {
  constructor(...args) {
    super(...args, {
      name: "goosey",
      aliases: [],
      description: "See some cute goosies!",
      usage: "!goosey",
      category: "Animals"
    });
  }

  async execute(client, message, args) {
    const subreddits = ["geese"];
    const index = Math.floor(
      Math.random() * (subreddits.length - 1 - 0 + 1) + 0
    );
    const embed = new MessageEmbed();
    await got(
      `https://www.reddit.com/r/${subreddits[index]}/random/.json?sort=top&t=day&limit=100`
    ).then(response => {
      const [list] = JSON.parse(response.body);
      const [post] = list.data.children;

      const permalink = post.data.permalink;
      const animalUrl = `https://reddit.com${permalink}`;
      const animalImage = post.data.preview.images[0].source.url.replace(new RegExp("amp;", "g"), "");
      const animalTitle = post.data.title;
      const animalUpvotes = post.data.ups;
      const animalNumComments = post.data.num_comments;

      embed.setTitle(`${animalTitle}`);
      embed.setURL(`${animalUrl}`);
      embed.setColor("RANDOM");
      embed.setImage(animalImage);
      embed.setFooter(`👍 ${animalUpvotes} 💬 ${animalNumComments}`);

      message.channel.send({ embeds: [embed] });
    });
  }
}

module.exports = Goosey;
