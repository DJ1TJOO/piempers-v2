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

		const player = await music.getPlayer({
			interaction: interaction,
		});

		let duration = queue[0].info.duration;
		if (player && player.state && player.state.playbackDuration) {
			let time = 0;
			const times = queue[0].info.duration.split(':');
			if (times.length > 2) {
				time += new Number(times[0]) * 3600000;
				time += new Number(times[1]) * 60000;
				time += new Number(times[2]) * 1000;
			} else if (times.length > 1) {
				time += new Number(times[0]) * 60000;
				time += new Number(times[1]) * 1000;
			} else {
				time += new Number(times[0]) * 1000;
			}

			time -= player.state.playbackDuration;

			let seconds = Math.floor((time / 1000) % 60);
			let minutes = Math.floor((time / (1000 * 60)) % 60);
			let hours = Math.floor((time / (1000 * 60 * 60)) % 24);

			hours = hours > 0 ? (hours < 10 ? '0' + hours : hours) + ':' : '';
			minutes = minutes < 10 ? '0' + minutes : minutes;
			seconds = seconds < 10 ? '0' + seconds : seconds;

			duration = hours + minutes + ':' + seconds;
		}

		const embed = new MessageEmbed().setColor('#FFAA00').setThumbnail(queue[0].info.thumbnail).setTimestamp(Date.now()).setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		const info = queue.map((x, i) => (i === 0 ? '' : `${i}) [${x.info.title}](${x.info.url}) - ${x.info.duration}`)).join('\n');
		embed.addField('Now playing', `[${queue[0].info.title}](${queue[0].info.url}) - ${duration}`);
		embed.addField('Queue', info.length > 0 ? (info.length > 1024 ? info.substring(0, 1000) + '...' : info) : 'No queue');

		await interaction.reply({ embeds: [embed] });
	},
};
