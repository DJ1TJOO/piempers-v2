const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('../voice/voice-lib');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Speelt een lied af')
		.addStringOption((string) => string.setName('song').setDescription('Naam of url van het lied').setRequired(true)),
	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(client, interaction) {
		/* This will get the song that has been provided */
		const song = interaction.options.getString('song');

		/* Gets the voice channel where the member is in. If the member isn't in any, return. */
		const voiceChannel = interaction.member.voice.channel;
		if (!voiceChannel) return await interaction.reply({ content: 'Je moet in een voice channel zijn!', ephemeral: true });

		try {
			/* Rickroll */
			const rickroll = Math.random() * (200 - 1) + 1;
			if (rickroll === 199) {
				music.play({
					interaction: interaction,
					channel: voiceChannel,
					song: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
				});
			} else {
				music.play({
					interaction: interaction,
					channel: voiceChannel,
					song: song,
				});
			}
			await interaction.reply({ content: 'Muziek gestart', ephemeral: true });
		} catch (error) {
			await interaction.reply({ content: 'Muziek kon niet gestart worden', ephemeral: true });
		}
	},
};
