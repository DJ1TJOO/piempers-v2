const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('../voice/voice-lib');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jump')
		.setDescription('Springt naar een geselecteerd nummer in de wachtrij')
		.addIntegerOption((integer) => integer.setName('number').setDescription('Het nummer van de wachtrij om naar te springen').setRequired(true)),
	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(client, interaction) {
		/* This will get the number that has been provided */
		const number = interaction.options.getInteger('number');

		/* Checking if the bot is connected. If it isn't, return. */
		const isConnected = await music.isConnected({
			interaction: interaction,
		});
		if (!isConnected) return await interaction.reply({ content: 'Er worden geen nummers afgespeeld', ephemeral: true });

		/* Checking if the number is higher than the queue length. If it is, return. */
		const queue = music.queue({
			interaction: interaction,
		});
		if (number > queue.length) return await interaction.reply({ content: 'Zo ver kan ik niet springen!', ephemeral: true });

		music.jump({
			interaction: interaction,
			number: number,
		});

		await interaction.reply({ content: `Spring het nummer naar het opgegeven wachtrijnummer.` });
	},
};
