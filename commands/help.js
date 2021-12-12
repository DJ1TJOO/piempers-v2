const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder().setName('help').setDescription('Laat alle commands zien'),
	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(client, interaction) {
		const embed = new MessageEmbed()
			.setTitle('PiEmPeRs | Help')
			.setDescription(
				client.commands.reduce((prev, current) => {
					if (typeof prev === 'string') {
						return prev + `${current.data.name} | ${current.data.description}\n`;
					} else {
						return `${prev.data.name} | ${prev.data.description}\n` + `${current.data.name} | ${current.data.description}\n`;
					}
				}),
			)
			.setThumbnail(client.user.displayAvatarURL())
			.setColor('#FFAA00')
			.setTimestamp(Date.now())
			.setFooter('PiEmPeRs | Made by DJ1TJOO');

		await interaction.reply({ embeds: [embed] });
	},
};
