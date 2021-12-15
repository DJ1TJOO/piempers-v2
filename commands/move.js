const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('../voice/voice-lib');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('move')
		.setDescription('Verplaatst nummer omhoog of omlaag in de wachtrij')
		.addIntegerOption((integer) => integer.setName('from').setDescription('Het nummer uit de wachtrij dat verplaatst moet worden').setRequired(true))
		.addIntegerOption((integer) => integer.setName('to').setDescription('Waar het nummer in de wachtrij moet staan').setRequired(true)),

	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(client, interaction) {
		/* This will get the number that has been provided */
		const to = interaction.options.getInteger('to');
		const from = interaction.options.getInteger('from');

		/* Checking if the bot is connected. If it isn't, return. */
		const isConnected = await music.isConnected({
			interaction: interaction,
		});
		if (!isConnected) return await interaction.reply({ content: 'Er worden geen nummers afgespeeld', ephemeral: true });

		/* Checking if the number is higher than the queue length. If it is, return. */
		const queue = music.getQueue({
			interaction: interaction,
		});
		if (to >= queue.length) return await interaction.reply({ content: 'Zo ver kan ik niet springen!', ephemeral: true });
		if (from >= queue.length) return await interaction.reply({ content: 'Dit nummer bestaat niet!', ephemeral: true });

		music.move({
			interaction: interaction,
			from: from,
			to: to,
		});

		await interaction.reply({ content: `Spring het nummer naar het opgegeven wachtrijnummer.` });
	},
};
