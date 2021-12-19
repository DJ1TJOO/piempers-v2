const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('../voice/voice-lib');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('repeat')
		.setDescription('Herhaalt het spelende nummer voor altijd')
		.addBooleanOption((boolean) => boolean.setName('onoroff').setDescription('Zet de herhaling aan of uit').setRequired(true)),
	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(client, interaction) {
		/* This will get the boolean that has been provided */
		const value = interaction.options.getBoolean('onoroff');

		/* Checking if the bot is connected. If it isn't, return. */
		const isConnected = await music.isConnected({
			interaction: interaction,
		});
		if (!isConnected) return await interaction.reply({ content: 'Er worden geen nummers afgespeeld', ephemeral: true });

		/* Checking if the music is already repeated. If it is, return. */
		const isRepeated = music.isRepeated({
			interaction: interaction,
		});
		if (isRepeated === value) return await interaction.reply({ content: `Herhaalmodus is al ${value ? 'ingeschakeld' : 'uitgeschakeld'}`, ephemeral: true });

		try {
			music.repeat({
				interaction: interaction,
				value: value,
			});
		} catch (error) {
			return await interaction.reply({ content: `Herhaalmodus is al ${value ? 'ingeschakeld' : 'uitgeschakeld'}`, ephemeral: true });
		}

		await interaction.reply({ content: `Herhaalmodus gewijzigd naar ${value ? 'ingeschakeld' : 'uitgeschakeld'}` });
	},
};
