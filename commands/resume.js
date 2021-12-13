const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('../voice/voice-lib');

module.exports = {
	data: new SlashCommandBuilder().setName('resume').setDescription('Hervat het huidige nummer dat wordt afgespeeld'),
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

		/* Checking if the music is already resumed. If it is, return. */
		const isResumed = music.isResumed({
			interaction: interaction,
		});
		if (isResumed) return await interaction.reply({ content: 'Het liedje is al hervat', ephemeral: true });

		music.resume({
			interaction: interaction,
		});

		await interaction.reply({ content: `Hervat de muziek` });
	},
};
