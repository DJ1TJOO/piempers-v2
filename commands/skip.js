const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('../voice/voice-lib');

module.exports = {
	data: new SlashCommandBuilder().setName('skip').setDescription('Slaat het huidige nummer over'),
	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(client, interaction) {
		/* Checking if the bot is connected. If it isn't, return. */
		const isConnected = await music.isConnected({
			interaction: interaction,
		});
		if (!isConnected) return await interaction.reply({ content: 'Er worden geen nummers afgespeeld', ephemeral: true });

		music.skip({
			interaction: interaction,
		});

		await interaction.reply({ content: `Het nummer overgeslagen` });
	},
};
