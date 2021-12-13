const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('../voice/voice-lib');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removequeue')
		.setDescription('Verwijdert een nummer uit de wachtrij')
		.addIntegerOption((integer) => integer.setName('number').setDescription('Het nummer van het wachtrijnummer dat moet worden verwijderd').setRequired(true)),
	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(client, interaction) {
		/* Get the number that has been provided */
		const number = interaction.options.getInteger('number');

		/* Checking if the bot is connected. If it isn't, return. */
		const isConnected = await music.isConnected({
			interaction: interaction,
		});
		if (!isConnected) return await interaction.reply({ content: 'Er worden geen nummers afgespeeld', ephemeral: true });

		/* Get the queue to check if the number exists. If it isn't, return. */
		const queue = await music.getQueue({
			interaction: interaction,
		});
		if (!queue[number - 1]) return await interaction.reply({ content: 'Dat nummer van de wachtrij bestaat niet', ephemeral: true });

		music.removeQueue({
			interaction: interaction,
			number: number,
		});

		await interaction.reply({ content: `Het ${number}e nummer uit de wachtrij verwijderd.` });
	},
};
