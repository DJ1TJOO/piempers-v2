const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Zegt')
		.addStringOption((option) => option.setName('tekst').setDescription('tekst').setRequired(true)),
	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(client, interaction) {
		await interaction.reply(interaction.options.getString('tekst'));
	},
};
