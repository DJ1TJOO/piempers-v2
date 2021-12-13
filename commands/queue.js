const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const music = require('../voice/voice-lib');

module.exports = {
	data: new SlashCommandBuilder().setName('queue').setDescription('Toont de wachtrij'),
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

		const queue = await music.getQueue({
			interaction: interaction,
		});
		if (queue.length < 1) return await interaction.reply({ content: 'Er worden geen nummers afgespeeld' });

		const embed = new MessageEmbed().setColor('#FFAA00').setThumbnail(queue[0].info.thumbnail).setTimestamp(Date.now()).setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		const info = queue.map((x, i) => (i === 0 ? '' : `${i}) [${x.info.title}](${x.info.url}) - ${x.info.duration}`)).join('\n');
		embed.addField('Now playing', `[${queue[0].info.title}](${queue[0].info.url}) - ${queue[0].info.duration}`);
		embed.addField('Queue', info.length > 0 ? info : 'No queue');

		await interaction.reply({ embeds: [embed] });
	},
};
