const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = fs.readFileSync('weetjes.txt', 'utf-8');
const lines = data.split('\n');

module.exports = {
	data: new SlashCommandBuilder().setName('weetje').setDescription('Stuurt een weetje!'),
	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(client, interaction) {
		const embed = new MessageEmbed()
			.setTitle('Een leuk weetje')
			.setDescription(lines[Math.floor(Math.random() * lines.length)])
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter('PiEmPeRs | Made by DJ1TJOO');

		await interaction.reply({ embeds: [embed] });
	},
};
