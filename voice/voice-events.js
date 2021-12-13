const { MessageEmbed } = require('discord.js');
const music = require('./voice-lib');

/* This will run when a new song started to play */
music.event.on('playSong', (channel, songInfo) => {
	const embed = new MessageEmbed()
		.setTitle(`Playing **${songInfo.title} - ${songInfo.duration}**`)
		.setColor('#FFAA00')
		.setThumbnail(songInfo.thumbnail)
		.setTimestamp(Date.now())
		.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

	channel.send({ embeds: [embed] });
});

/* This will run when a new song has been added to the queue */
music.event.on('addSong', (channel, songInfo, requester) => {
	const embed = new MessageEmbed()
		.setTitle(`**${songInfo.title} - ${songInfo.duration}** has been added to the queue by \`${requester.tag}\`!`)
		.setColor('#FFAA00')
		.setThumbnail(songInfo.thumbnail)
		.setTimestamp(Date.now())
		.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

	channel.send({ embeds: [embed] });
});

/* This will run when a song started playing from a playlist */
music.event.on('playList', async (channel, playlist, songInfo) => {
	const embed = new MessageEmbed()
		.setTitle(`Playing **${songInfo.title} - ${songInfo.duration}** of the playlist ${playlist.title}`)
		.setColor('#FFAA00')
		.setThumbnail(songInfo.thumbnail)
		.setTimestamp(Date.now())
		.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

	channel.send({ embeds: [embed] });
});

/* This will run when a new playlist has been added to the queue */
music.event.on('addList', async (channel, playlist, requester) => {
	const embed = new MessageEmbed()
		.setTitle(`**${playlist.title}** has been added with ${playlist.videos.length} amount of videos to the queue by \`${requester.tag}\`!`)
		.setColor('#FFAA00')
		.setThumbnail(playlist.thumbnail)
		.setTimestamp(Date.now())
		.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

	channel.send({ embeds: [embed] });
});

/* This will run when all the music has been played, and the bot disconnects. */
music.event.on('finish', (channel) => {
	const embed = new MessageEmbed().setTitle(`All music has been played, disconnecting..`).setColor('#FFAA00').setTimestamp(Date.now()).setFooter(`PiEmPeRs | Made by DJ1TJOO`);

	channel.send({ embeds: [embed] });
});
