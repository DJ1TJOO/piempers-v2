/* eslint-disable no-prototype-builtins */
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('casino')
		.setDescription('Alle casino commands')
		.addSubcommand((command) =>
			command
				.setName('restart')
				.setDescription('Reset de casino')
				.addIntegerOption((option) => option.setName('money').setDescription('hoeveel geld om mee te starten').setRequired(true))
				.addIntegerOption((option) => option.setName('dagen').setDescription('Hoeveel dagen tot reset').setRequired(false)),
		)
		.addSubcommand((command) => command.setName('leaderboard').setDescription('Bekijk de casino leaderboard'))
		.addSubcommand((command) =>
			command
				.setName('money')
				.setDescription('Bekijk de money')
				.addUserOption((option) => option.setName('user').setDescription('gebruiker').setRequired(false)),
		)
		.addSubcommand((command) =>
			command
				.setName('withdraw')
				.setDescription('Geld uit je bank halen')
				.addIntegerOption((option) => option.setName('amount').setDescription('Amount of money').setRequired(true)),
		)
		.addSubcommand((command) =>
			command
				.setName('deposit')
				.setDescription('Geld op je bank zetten')
				.addIntegerOption((option) => option.setName('amount').setDescription('Amount of money').setRequired(true)),
		)
		.addSubcommand((command) =>
			command
				.setName('give')
				.setDescription('Geef geld aan anderen')
				.addIntegerOption((option) => option.setName('amount').setDescription('Amount of money').setRequired(true))
				.addUserOption((option) => option.setName('user').setDescription('Aan wie').setRequired(true)),
		)
		.addSubcommand((command) =>
			command
				.setName('steal')
				.setDescription('Steel geld van anderen')
				.addIntegerOption((option) => option.setName('amount').setDescription('Amount of money').setRequired(true))
				.addUserOption((option) => option.setName('user').setDescription('Van wie').setRequired(true)),
		)
		.addSubcommandGroup((command) =>
			command
				.setName('bet')
				.setDescription('Gok tegen een ander')
				.addSubcommand((subcommand) =>
					subcommand
						.setName('start')
						.setDescription('start een bet')
						.addIntegerOption((option) => option.setName('amount').setDescription('Amount of money').setRequired(true))
						.addUserOption((option) => option.setName('user').setDescription('Aan wie').setRequired(true)),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('accept')
						.setDescription('Accept bet')
						.addUserOption((option) => option.setName('user').setDescription('Van wie').setRequired(true)),
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('deny')
						.setDescription('Deny bet')
						.addUserOption((option) => option.setName('user').setDescription('Van wie').setRequired(true)),
				),
		)
		.addSubcommand((command) =>
			command
				.setName('coinflip')
				.setDescription('Doe een coinflip')
				.addIntegerOption((option) => option.setName('amount').setDescription('Amount of money').setRequired(true)),
		)
		.addSubcommand((command) => command.setName('dailywheel').setDescription('Een kans om geld te winnen'))
		.addSubcommand((command) =>
			command
				.setName('roulet')
				.setDescription('Draain aan het roulet')
				.addIntegerOption((option) => option.setName('number').setDescription('1-36').setRequired(true))
				.addIntegerOption((option) => option.setName('amount').setDescription('Amount of money').setRequired(true)),
		)
		.addSubcommand((command) =>
			command
				.setName('slotmachine')
				.setDescription('Draai aan de slotmachine')
				.addIntegerOption((option) => option.setName('amount').setDescription('Amount of money').setRequired(true)),
		)
		.addSubcommand((command) =>
			command
				.setName('wheel')
				.setDescription('Draai aan het wheel')
				.addIntegerOption((option) => option.setName('amount').setDescription('Amount of money').setRequired(true)),
		),
	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(client, interaction) {
		const author = interaction.user;

		client.updateUser(interaction.guildId, author);

		if (interaction.options.getSubcommandGroup() === 'bet') {
			return await bet(client, interaction);
		} else if (interaction.options.getSubcommand() === 'restart') {
			return await restart(client, interaction);
		} else if (interaction.options.getSubcommand() === 'leaderboard') {
			return await leaderboard(client, interaction);
		} else if (interaction.options.getSubcommand() === 'money') {
			return await money(client, interaction);
		} else if (interaction.options.getSubcommand() === 'withdraw') {
			return await withdraw(client, interaction);
		} else if (interaction.options.getSubcommand() === 'deposit') {
			return await deposit(client, interaction);
		} else if (interaction.options.getSubcommand() === 'coinflip') {
			return await coinflip(client, interaction);
		} else if (interaction.options.getSubcommand() === 'dailywheel') {
			return await dailywheel(client, interaction);
		} else if (interaction.options.getSubcommand() === 'steal') {
			return await steal(client, interaction);
		} else if (interaction.options.getSubcommand() === 'give') {
			return await give(client, interaction);
		} else if (interaction.options.getSubcommand() === 'roulet') {
			return await roulet(client, interaction);
		} else if (interaction.options.getSubcommand() === 'slotmachine') {
			return await slotmachine(client, interaction);
		} else if (interaction.options.getSubcommand() === 'wheel') {
			return await wheel(client, interaction);
		}
	},
};

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").CommandInteraction} interaction
 */
async function deposit(client, interaction) {
	const cash = interaction.options.getInteger('amount');

	if (client.casino[interaction.guildId][interaction.user.id]['cash'] < cash && client.casino[interaction.guildId][interaction.user.id]['cash'] >= 0) {
		const embed = new MessageEmbed()
			.setTitle('Deposit')
			.setDescription('You do not have ' + cash + 'PiEmPeRs cash.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter('PiEmPeRs | Made by DJ1TJOO');

		return await interaction.reply({ embeds: [embed] });
	}

	client.casino[interaction.guildId][interaction.user.id]['cash'] = client.casino[interaction.guildId][interaction.user.id]['cash'] - cash;
	client.casino[interaction.guildId][interaction.user.id]['bank'] = client.casino[interaction.guildId][interaction.user.id]['bank'] + cash;

	client.saveCasino();

	const embed = new MessageEmbed()
		.setTitle('Deposit')
		.setDescription(cash + 'PiEmPeRs will be added to your bank.')
		.setColor('#FFAA00')
		.setThumbnail(client.user.displayAvatarURL())
		.setTimestamp(Date.now())
		.setFooter('PiEmPeRs | Made by DJ1TJOO');

	return await interaction.reply({ embeds: [embed] });
}

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").CommandInteraction} interaction
 */
async function withdraw(client, interaction) {
	const cash = interaction.options.getInteger('amount');
	if (client.casino[interaction.guildId][interaction.user.id]['bank'] < cash && client.casino[interaction.guildId][interaction.user.id]['bank'] >= 0) {
		const embed = new MessageEmbed()
			.setTitle('Withdraw')
			.setDescription('You do not have ' + cash + 'PiEmPeRs on your bank.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	}

	client.casino[interaction.guildId][interaction.user.id]['cash'] = client.casino[interaction.guildId][interaction.user.id]['cash'] + cash;
	client.casino[interaction.guildId][interaction.user.id]['bank'] = client.casino[interaction.guildId][interaction.user.id]['bank'] - cash;

	client.saveCasino();

	const embed = new MessageEmbed()
		.setTitle('Withdraw')
		.setDescription(cash + 'PiEmPeRs will be added to your cash.')
		.setColor('#FFAA00')
		.setThumbnail(client.user.displayAvatarURL())
		.setTimestamp(Date.now())
		.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

	return await interaction.reply({ embeds: [embed] });
}

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").CommandInteraction} interaction
 */
async function money(client, interaction) {
	const user = interaction.options.getUser('user');

	if (user) client.updateUser(interaction.guildId, user);

	const embed = new MessageEmbed()
		.setTitle('Money')
		.setDescription(
			(user ? user.username + ' has ' : 'You have ') +
				client.casino[interaction.guildId][user?.id || interaction.user.id]['cash'].toFixed(2) +
				'PiEmPeRs cash and ' +
				client.casino[interaction.guildId][user?.id || interaction.user.id]['bank'].toFixed(2) +
				'PiEmPeRs on ' +
				(user ? 'their' : 'your') +
				' bank.',
		)
		.setColor('#FFAA00')
		.setThumbnail(client.user.displayAvatarURL())
		.setTimestamp(Date.now())
		.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

	return await interaction.reply({ embeds: [embed] });
}

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").CommandInteraction} interaction
 */
async function leaderboard(client, interaction) {
	const embed = new MessageEmbed()
		.setTitle('Leaderboard')
		.setColor('#FFAA00')
		.setThumbnail(client.user.displayAvatarURL())
		.setTimestamp(Date.now())
		.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

	let topArray = [];
	for (const key in client.casino[interaction.guildId]) {
		if (!client.casino[interaction.guildId].hasOwnProperty(key)) continue;

		if (key === 'starteddate' || key === 'startingcash' || key === 'enddate') continue;
		topArray.push({ id: key, total: client.casino[interaction.guildId][key]['cash'] + client.casino[interaction.guildId][key]['bank'] });
	}

	topArray.sort((a, b) => {
		a = a.total;
		b = b.total;

		return a > b ? -1 : a < b ? 1 : 0;
	});

	topArray = topArray.slice(0, topArray.length < 9 ? topArray.length : 9);

	for (let i = 0; i < topArray.length; i++) {
		const key = topArray[i];
		const user = await interaction.guild.members.fetch(key.id);
		embed.addField(
			'\u200b' + (i + 1) + '. ' + user.user.tag,
			'\u200b' +
				'Cash: ' +
				Math.round((client.casino[interaction.guildId][key.id]['cash'] + Number.EPSILON) * 100) / 100 +
				', bank: ' +
				Math.round((client.casino[interaction.guildId][key.id]['bank'] + Number.EPSILON) * 100) / 100 +
				', total: ' +
				Math.round((key.total + Number.EPSILON) * 100) / 100,
		);
	}

	return await interaction.reply({ embeds: [embed] });
}

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").CommandInteraction} interaction
 */
async function restart(client, interaction) {
	const author = interaction.member;

	if (!author.roles.cache.find((r) => r.name === 'Casino Manager')) {
		const embed = new MessageEmbed()
			.setTitle('Restart')
			.setDescription("You have to have the role 'Casino Manager' to excute this command!")
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter('PiEmPeRs | Made by DJ1TJOO');

		return await interaction.reply({ embeds: [embed] });
	}

	const today = new Date();
	let dd = today.getDate();

	let mm = today.getMonth() + 1;
	let yyyy = today.getFullYear();
	if (dd < 10) {
		dd = `0${dd}`;
	}

	if (mm < 10) {
		mm = `0${mm}`;
	}

	client.casino[interaction.guildId]['starteddate'] = `${dd}-${mm}-${yyyy}`;
	client.casino[interaction.guildId]['startingcash'] = interaction.options.getInteger('money');

	const days = interaction.options.getInteger('dagen');
	today.setDate(today.getDate() + days ? days : 0);
	dd = today.getDate();

	mm = today.getMonth() + 1;
	yyyy = today.getFullYear();
	if (dd < 10) {
		dd = `0${dd}`;
	}

	if (mm < 10) {
		mm = `0${mm}`;
	}
	client.casino[interaction.guildId]['enddate'] = `${dd}-${mm}-${yyyy}`;

	const topArray = [];
	for (const key in client.casino[interaction.guildId]) {
		if (!client.casino[interaction.guildId].hasOwnProperty(key)) continue;
		topArray.push({ id: key, total: client.casino[interaction.guildId][key]['cash'] + client.casino[interaction.guildId][key]['bank'] });
	}

	topArray.sort((a, b) => {
		a = a.total;
		b = b.total;

		return a > b ? -1 : a < b ? 1 : 0;
	});

	for (const key in client.casino[interaction.guildId]) {
		if (key === 'starteddate' || key === 'startingcash' || key === 'enddate') continue;

		client.casino[interaction.guildId][key]['cash'] = interaction.options.getInteger('money');
		client.casino[interaction.guildId][key]['bank'] = 0;
		client.casino[interaction.guildId][key]['won'].push(topArray.indexOf(topArray.find((top) => top.id === key)));
	}

	client.saveCasino();

	const embed = new MessageEmbed()
		.setTitle('Restart')
		.setDescription('The leaderboard has been resetted and started with ' + interaction.options.getInteger('money') + 'PiEmPeRs.')
		.setColor('#FFAA00')
		.setThumbnail(client.user.displayAvatarURL())
		.setTimestamp(Date.now())
		.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

	return await interaction.reply({ embeds: [embed] });
}
