const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('../voice/voice-lib');

module.exports = {
	data: new SlashCommandBuilder().setName('stop').setDescription('Stopt de muziek van de bot en verbreekt de verbinding'),
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

		/* Checking if there is music playing or not. If there isn't, return. */
		const queue = music.queue({
			interaction: interaction,
		});
		if (queue.length === 0) return await interaction.reply({ content: 'Er wordt geen muziek afgespeeld', ephemeral: true });

		music.stop({
			interaction: interaction,
		});

		await interaction.reply({ content: `De muziek is gestopt` });
	},
};
