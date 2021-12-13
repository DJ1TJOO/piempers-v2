const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('../voice/voice-lib');

module.exports = {
	data: new SlashCommandBuilder().setName('pause').setDescription('Pauzeert het huidige nummer dat wordt afgespeeld'),
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

		/* Checking if the music is already paused. If it is, return. */
		const isPaused = music.isPaused({
			interaction: interaction,
		});
		if (isPaused) return await interaction.reply({ content: 'Het nummer is al gepauzeerd', ephemeral: true });

		music.pause({
			interaction: interaction,
		});

		await interaction.reply({ content: `De muziek gepauzeerd` });
	},
};
