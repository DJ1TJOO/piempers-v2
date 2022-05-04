const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('../voice/voice-lib');
const radios = require('../radios.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('playradio')
		.setDescription('Speelt een radio station af')
		.addStringOption((string) =>
			string
				.setName('station')
				.setDescription('Radio station')
				.addChoices(Object.keys(radios).map((x) => [x, radios[x]]))
				.setRequired(true),
		),
	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(client, interaction) {
		/* This will get the song that has been provided */
		const song = interaction.options.getString('station');

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
