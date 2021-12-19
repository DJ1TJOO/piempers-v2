const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core-discord');
const yts = require('yt-search');
const eventEmitter = require('events');
const activeSongs = new Map();
const event = new eventEmitter();

module.exports.event = event;

exports.play = async (options = {}) => {
	const { interaction, channel, song } = options;
	if (!channel || channel?.type !== 'GUILD_VOICE') throw new Error(`INVALID_VOICE_CHANNEL: There is no valid VoiceChannel provided.`);
	if (!song || typeof song !== 'string') throw new Error(`INVALID_MUSIC_URL: There is no valid Music URL provided.`);
	if (!interaction) throw new Error(`INVALID_INTERACTION: There is no valid CommandInteraction provided.`);

	const data = activeSongs.get(channel.guild.id) || {};

	if (!channel.guild.me.voice.channel) {
		data.connection = await connectToChannel(channel);
	}
	if (!data.connection) {
		data.connection = await connectToChannel(channel);
	}

	if (!data.queue) data.queue = [];
	if (!data.repeat) data.repeat = false;

	data.guildId = channel.guild.id;

	let queueSongInfo;
	const songInfo = (await yts(song)).all.filter((ch) => ch.type === 'video' || ch.type === 'list')[0];
	if (!songInfo) throw new Error(`NO_SONG: There was no song found with the name/URL '${song}'.`);
	if (songInfo.type === 'list') {
		const playlistSongs = await yts({ listId: songInfo.listId });

		for (const video of playlistSongs.videos) {
			const ytdlSongInfo = await ytdl.getInfo(video.videoId);

			queueSongInfo = {
				title: video.title,
				description: ytdlSongInfo.videoDetails.description,
				duration: video.duration.duration,
				views: ytdlSongInfo.videoDetails.viewCount,
				author: video.author.name,
				url: ytdlSongInfo.videoDetails.video_url,
				thumbnail: video.thumbnail,
				likes: ytdlSongInfo.videoDetails.likes,
				dislikes: ytdlSongInfo.videoDetails.dislikes,
				extra: {
					type: 'playlist',
					playlist: playlistSongs,
				},
			};

			await data.queue.push({
				info: queueSongInfo,
				requester: interaction.user,
				url: ytdlSongInfo.videoDetails.video_url,
				channel: interaction.channel,
			});
		}
	} else {
		const ytdlSongInfo = await ytdl.getInfo(songInfo.url);

		queueSongInfo = {
			title: songInfo.title,
			description: songInfo.description,
			duration: songInfo.timestamp,
			views: songInfo.views,
			author: songInfo.author.name,
			url: songInfo.url,
			thumbnail: songInfo.thumbnail,
			likes: ytdlSongInfo.videoDetails.likes,
			dislikes: ytdlSongInfo.videoDetails.dislikes,
			extra: {
				type: 'video',
				playlist: null,
			},
		};

		await data.queue.push({
			info: queueSongInfo,
			requester: interaction.user,
			url: songInfo.url,
			channel: interaction.channel,
		});
	}

	if (!data.dispatcher || data.queue.length <= 1) {
		playSong(data, interaction);
	} else if (queueSongInfo.extra.type === 'playlist') {
		event.emit('addList', interaction.channel, queueSongInfo.extra.playlist, interaction.user);
	} else {
		event.emit('addSong', interaction.channel, queueSongInfo, interaction.user);
	}

	activeSongs.set(channel.guild.id, data);
};

exports.isConnected = async (options = {}) => {
	const { interaction } = options;
	if (!interaction) throw new Error(`INVALID_INTERACTION: There is no valid CommandInteraction provided.`);

	const fetchedData = activeSongs.get(interaction.guild.id);

	if (!fetchedData?.connection && !fetchedData?.player) return Boolean(false);
	else return Boolean(true);
};

exports.stop = async (options = {}) => {
	const { interaction } = options;
	if (!interaction) throw new Error(`INVALID_INTERACTION: There is no valid CommandInteraction provided.`);

	if (!activeSongs.has(interaction.guild.id) || !activeSongs.get(interaction.guild.id)?.connection || !activeSongs.get(interaction.guild.id)?.player) {
		throw new Error(`NO_MUSIC: There is no music playing in that server.`);
	}

	const fetchedData = await activeSongs.get(interaction.guild.id);

	fetchedData.player.stop();
	fetchedData.connection.destroy();
	activeSongs.delete(interaction.guild.id);
};

exports.repeat = async (options = {}) => {
	const { interaction, value } = options;
	if (!interaction) throw new Error(`INVALID_INTERACTION: There is no valid CommandInteraction provided.`);
	if (!value) value === false;
	if (value === undefined || typeof value !== 'boolean') throw new Error(`INVALID_BOOLEAN: There is no valid Boolean provided.`);

	if (!activeSongs.has(interaction.guild.id) || !activeSongs.get(interaction.guild.id)?.connection || !activeSongs.get(interaction.guild.id)?.player) {
		throw new Error(`NO_MUSIC: There is no music playing in that server.`);
	}

	const fetchedData = await activeSongs.get(interaction.guild.id);

	if (fetchedData?.repeat === value) throw new Error(`ALREADY_(UN)REPEATED: The song is already unrepeated / on repeat, check this with the isRepeated() function.`);

	fetchedData.repeat = value;
	activeSongs.set(interaction.guild.id, fetchedData);
};

exports.isRepeated = async (options = {}) => {
	const { interaction } = options;
	if (!interaction) throw new Error(`INVALID_INTERACTION: There is no valid CommandInteraction provided.`);

	if (!activeSongs.has(interaction.guild.id) || !activeSongs.get(interaction.guild.id)?.connection || !activeSongs.get(interaction.guild.id)?.player) {
		throw new Error(`NO_MUSIC: There is no music playing in that server.`);
	}

	const fetchedData = activeSongs.get(interaction.guild.id);

	return Boolean(fetchedData.repeat);
};

exports.skip = async (options = {}) => {
	const { interaction } = options;
	if (!interaction) throw new Error(`INVALID_INTERACTION: There is no valid CommandInteraction provided.`);

	if (!activeSongs.has(interaction.guild.id) || !activeSongs.get(interaction.guild.id)?.connection || !activeSongs.get(interaction.guild.id)?.player) {
		throw new Error(`NO_MUSIC: There is no music playing in that server.`);
	}

	const fetchedData = await activeSongs.get(interaction.guild.id);
	const player = await fetchedData.player;
	const connection = await fetchedData.connection;

	await fetchedData.queue.shift();

	if (fetchedData.queue.length > 0) {
		activeSongs.set(interaction.guild.id, fetchedData);

		playSong(fetchedData, interaction);
	} else {
		player.stop();
		setTimeout(async () => {
			try {
				const newFetchedData = await activeSongs.get(interaction.guild.id);

				if (newFetchedData && newFetchedData.queue && newFetchedData.queue.length > 0) return;

				event.emit('finish', interaction.channel);
				activeSongs.delete(interaction.guild.id);

				connection.destroy();
			} catch (error) {
				console.log('could not disconnect');
			}
		}, 1000 * 60 * 5);
	}
};

exports.pause = async (options = {}) => {
	const { interaction } = options;
	if (!interaction) throw new Error(`INVALID_INTERACTION: There is no valid CommandInteraction provided.`);

	if (!activeSongs.has(interaction.guild.id) || !activeSongs.get(interaction.guild.id)?.connection || !activeSongs.get(interaction.guild.id)?.player) {
		throw new Error(`NO_MUSIC: There is no music playing in that server.`);
	}

	const fetchedData = activeSongs.get(interaction.guild.id);
	const player = fetchedData.player;

	if (player.state.status === 'paused') throw new Error(`ALREADY_PAUSED: The song is already paused, check this with the isPaused() function.`);

	player.pause();
};

exports.isPaused = async (options = {}) => {
	const { interaction } = options;
	if (!interaction) throw new Error(`INVALID_INTERACTION: There is no valid CommandInteraction provided.`);

	if (!activeSongs.has(interaction.guild.id) || !activeSongs.get(interaction.guild.id)?.connection || !activeSongs.get(interaction.guild.id)?.player) {
		throw new Error(`NO_MUSIC: There is no music playing in that server.`);
	}

	const fetchedData = activeSongs.get(interaction.guild.id);
	const player = fetchedData.player;

	if (player.state.status === 'paused') return Boolean(true);
	else return Boolean(false);
};

exports.resume = async (options = {}) => {
	const { interaction } = options;
	if (!interaction) throw new Error(`INVALID_INTERACTION: There is no valid CommandInteraction provided.`);

	if (!activeSongs.has(interaction.guild.id) || !activeSongs.get(interaction.guild.id)?.connection || !activeSongs.get(interaction.guild.id)?.player) {
		throw new Error(`NO_MUSIC: There is no music playing in that server.`);
	}

	const fetchedData = activeSongs.get(interaction.guild.id);
	const player = fetchedData.player;

	if (player.state.status === 'playing') throw new Error(`ALREADY_RESUMED: The song is already playing, check this with the isResumed() function.`);

	player.unpause();
};

exports.isResumed = async (options = {}) => {
	const { interaction } = options;
	if (!interaction) throw new Error(`INVALID_INTERACTION: There is no valid CommandInteraction provided.`);

	if (!activeSongs.has(interaction.guild.id) || !activeSongs.get(interaction.guild.id)?.connection || !activeSongs.get(interaction.guild.id)?.player) {
		throw new Error(`NO_MUSIC: There is no music playing in that server.`);
	}

	const fetchedData = activeSongs.get(interaction.guild.id);
	const player = fetchedData.player;

	if (player.state.status === 'playing') return Boolean(true);
	else return Boolean(false);
};

exports.jump = async (options = {}) => {
	const { interaction, number } = options;
	if (!interaction) throw new Error(`INVALID_INTERACTION: There is no valid CommandInteraction provided.`);
	if (typeof number !== 'number' || !Number.isInteger(number)) throw new Error('INVALID_NUMBER: There is no valid Number provided.');

	if (!activeSongs.has(interaction.guild.id) || !activeSongs.get(interaction.guild.id)?.connection || !activeSongs.get(interaction.guild.id)?.player) {
		throw new Error(`NO_MUSIC: There is no music playing in that server.`);
	}

	const fetchedData = await activeSongs.get(interaction.guild.id);

	if (number >= fetchedData.queue.length) throw new Error(`TO_HIGH_NUMBER: The number is higher than the queue length.`);

	await fetchedData.queue.splice(0, number);
	activeSongs.set(interaction.guild.id, fetchedData);

	playSong(activeSongs.get(interaction.guild.id), interaction);
};

exports.move = async (options = {}) => {
	const { interaction, from, to } = options;
	if (!interaction) throw new Error(`INVALID_INTERACTION: There is no valid CommandInteraction provided.`);
	if (typeof from !== 'number' || !Number.isInteger(from)) throw new Error('INVALID_NUMBER: There is no valid From provided.');
	if (typeof to !== 'number' || !Number.isInteger(to)) throw new Error('INVALID_NUMBER: There is no valid To provided.');

	if (!activeSongs.has(interaction.guild.id) || !activeSongs.get(interaction.guild.id)?.connection || !activeSongs.get(interaction.guild.id)?.player) {
		throw new Error(`NO_MUSIC: There is no music playing in that server.`);
	}

	const fetchedData = await activeSongs.get(interaction.guild.id);

	if (from >= fetchedData.queue.length || to >= fetchedData.queue.length) throw new Error(`TO_HIGH_NUMBER: The number is higher than the queue length.`);

	const song = fetchedData.queue.splice(from, 1)[0];
	fetchedData.queue.splice(to, 0, song);

	// Remove current song and start playing
	if (to === 0) {
		fetchedData.queue.splice(1, 1);
		activeSongs.set(interaction.guild.id, fetchedData);
		playSong(activeSongs.get(interaction.guild.id), interaction);
	} else {
		activeSongs.set(interaction.guild.id, fetchedData);
	}
};

exports.getQueue = async (options = {}) => {
	const { interaction } = options;
	if (!interaction) throw new Error(`INVALID_INTERACTION: There is no valid CommandInteraction provided.`);
	if (!activeSongs.has(interaction.guild.id) || !activeSongs.get(interaction.guild.id)?.connection || !activeSongs.get(interaction.guild.id)?.player) {
		throw new Error(`NO_MUSIC: There is no music playing in that server.`);
	}

	const fetchedData = await activeSongs.get(interaction.guild.id);

	return fetchedData.queue;
};

exports.getPlayer = async (options = {}) => {
	const { interaction } = options;
	if (!interaction) throw new Error(`INVALID_INTERACTION: There is no valid CommandInteraction provided.`);
	if (!activeSongs.has(interaction.guild.id) || !activeSongs.get(interaction.guild.id)?.connection || !activeSongs.get(interaction.guild.id)?.player) {
		throw new Error(`NO_MUSIC: There is no music playing in that server.`);
	}

	const fetchedData = await activeSongs.get(interaction.guild.id);

	return fetchedData.player;
};

exports.removeQueue = async (options = {}) => {
	const { interaction, number } = options;
	if (!interaction) throw new Error(`INVALID_INTERACTION: There is no valid CommandInteraction provided.`);
	if (typeof number !== 'number' || !Number.isInteger(number)) throw new Error(`INVALID_NUMBER: There is no valid Number provided.`);

	if (!activeSongs.has(interaction.guild.id) || !activeSongs.get(interaction.guild.id)?.connection || !activeSongs.get(interaction.guild.id)?.player) {
		throw new Error(`NO_MUSIC: There is no music playing in that server.`);
	}

	const fetchedData = await activeSongs.get(interaction.guild.id);
	if (fetchedData.queue.length < number) throw new Error(`TO_HIGH_NUMBER: The number is higher than the queue length.`);

	const spliceNumber = number - 1;
	fetchedData.queue.splice(spliceNumber, 1);
};

exports.volume = async (options = {}) => {
	const { interaction, volume } = options;
	if (!interaction) throw new Error(`INVALID_INTERACTION: There is no valid CommandInteraction provided.`);
	if (!volume || !Number.isInteger(volume) || volume > 200) throw new Error(`INVALID_VOLUME: There is no valid Volume Integer provided or the number is higher than 200.`);
	if (!activeSongs.has(interaction.guild.id) || !activeSongs.get(interaction.guild.id)?.connection || !activeSongs.get(interaction.guild.id)?.player) {
		throw new Error(`NO_MUSIC: There is no music playing in that server.`);
	}

	const fetchedData = await activeSongs.get(interaction.guild.id);

	fetchedData.resource.volume.setVolumeLogarithmic(volume / 100);
};

async function playSong(data, interaction) {
	try {
		const resource = await createAudioResource(await ytdl(data.queue[0].url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1 << 25 }), {
			inputType: StreamType.Opus,
			inlineVolume: true,
		});

		const player = createAudioPlayer();

		player.play(resource);

		data.player = player;
		data.resource = resource;
		data.dispatcher = await data.connection.subscribe(player);
		data.dispatcher.guildId = data.guildId;

		if (data.queue[0].info.extra.type === 'playlist') {
			event.emit('playList', data.queue[0].channel, data.queue[0].info.extra.playlist, data.queue[0].info, data.queue[0].requester);
		} else {
			event.emit('playSong', data.queue[0].channel, data.queue[0].info, data.queue[0].requester);
		}

		player.on(AudioPlayerStatus.Idle, async () => {
			finishedSong(player, data.connection, data.dispatcher, interaction);
		});

		player.on('error', (err) => console.log(err));
	} catch (error) {
		// Skip song
		exports.skip({
			interaction,
		});
	}
}

async function finishedSong(player, connection, dispatcher, interaction) {
	const fetchedData = await activeSongs.get(dispatcher.guildId);

	if (fetchedData?.repeat === true) return playSong(fetchedData, interaction);

	await fetchedData.queue.shift();

	if (fetchedData.queue.length > 0) {
		activeSongs.set(dispatcher.guildId, fetchedData);

		playSong(fetchedData, interaction);
	} else {
		player.stop();
		setTimeout(async () => {
			try {
				const newFetchedData = await activeSongs.get(dispatcher.guildId);

				if (newFetchedData && newFetchedData.queue && newFetchedData.queue.length > 0) return;

				event.emit('finish', interaction.channel);

				activeSongs.delete(dispatcher.guildId);

				connection.destroy();
			} catch (error) {
				console.log('could not disconnect');
			}
		}, 1000 * 60 * 5);
	}
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectToChannel(channel) {
	return new Promise((resolve, reject) => {
		const connection = joinVoiceChannel({
			channelId: channel.id,
			guildId: channel.guild.id,
			adapterCreator: channel.guild.voiceAdapterCreator,
			selfDeaf: false,
		});
		connection.once(VoiceConnectionStatus.Ready, () => {
			resolve(connection);
		});
		delay(30000).then(() => reject('Connection was failed to connect to VC'));
	});
}
