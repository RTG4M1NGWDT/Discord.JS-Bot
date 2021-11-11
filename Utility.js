const {
    Channel,
    MessageEmbed
} = require('discord.js');

/**
 * @param {Channel} channel - The channel
 * @param {string} title - The title
 * @param {string} color - The color
 * @param {string} description - The description
 * @param {Object} fields - The fields
 * @param {string} footer - The footer
 * @param {string} image - The image
 * @param {string} thumbnail - The thumbnail
 * @param {string[]} timestamp - The timestamp 
 * @param {string} url - The url
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

module.exports.sendEmbed = sendEmbed;
module.exports.getDuration = getDuration;
