const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('../voice/voice-lib');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
		.setDescription('Verandert het volume van de muziek')
		.addIntegerOption((integer) => integer.setName('volume').setDescription('Het nieuwe volume van de muziek').setRequired(true)),
	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(client, interaction) {
		/* This will get the volume that has been provided */
		const volume = interaction.options.getInteger('volume');

		/* If the volume is higher than 200, return. */
		if (volume > 200) return await interaction.reply({ content: 'Kan niet hoger gaan dan 200%', ephemeral: true });

		/* Checking if the bot is connected. If it isn't, return. */
		const isConnected = await music.isConnected({
			interaction: interaction,
		});
		if (!isConnected) return await interaction.reply({ content: 'Er worden geen nummers afgespeeld', ephemeral: true });

		music.volume({
			interaction: interaction,
			volume: volume,
		});

		await interaction.reply({ content: `Het volume is nu ${volume}` });
	},
};
