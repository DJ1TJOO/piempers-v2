/* eslint-disable no-prototype-builtins */
const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const Canvas = require('canvas');

const slotmachineImages = {};
const loadSlotmachineImages = async () => {
	slotmachineImages.citroen = await Canvas.loadImage('./slotmachine/citroen.png');
	slotmachineImages.sinaasapple = await Canvas.loadImage('./slotmachine/sinaasapple.png');
	slotmachineImages.watermeloen = await Canvas.loadImage('./slotmachine/watermeloen.png');
	slotmachineImages.pruim = await Canvas.loadImage('./slotmachine/pruim.png');
	slotmachineImages.seven = await Canvas.loadImage('./slotmachine/7.png');
	slotmachineImages.banaan = await Canvas.loadImage('./slotmachine/banaan.png');
	slotmachineImages.kers = await Canvas.loadImage('./slotmachine/kers.png');
	slotmachineImages.bel = await Canvas.loadImage('./slotmachine/bel.png');
	slotmachineImages.bar = await Canvas.loadImage('./slotmachine/bar.png');
	slotmachineImages.slot = await Canvas.loadImage('./slotmachine/slot.png');
};

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

		let subcommand = null;
		try {
			subcommand = interaction.options.getSubcommandGroup();
			// eslint-disable-next-line no-empty
		} catch {}

		if (subcommand === 'bet') {
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
async function steal(client, interaction) {
	const user = interaction.options.getMember('user');
	if (user) client.updateUser(interaction.guildId, user.user);

	const cash = interaction.options.getInteger('amount');

	if (
		!user ||
		client.casino[interaction.guildId][user.id]['cash'] <= client.casino[interaction.guildId][user.id]['startingcash'] ||
		(client.casino[interaction.guildId][user.id]['cash'] / 100) * 30 < cash
	) {
		const embed = new MessageEmbed()
			.setTitle('Steal')
			.setDescription('You cannot steal from ' + user.displayName + '.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	}

	if (client.casino[interaction.guildId][interaction.user.id]['cash'] < cash && client.casino[interaction.guildId][interaction.user.id]['cash'] >= 0) {
		const embed = new MessageEmbed()
			.setTitle('Steal')
			.setDescription('You do not have ' + cash + 'PiEmPeRs cash. Use withdraw to get cash if you have it on your bank.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	}

	if (client.casino[interaction.guildId][user.id]['cash'] < cash && client.casino[interaction.guildId][user.id]['cash'] >= 0) {
		const embed = new MessageEmbed()
			.setTitle('Steal')
			.setDescription(user.displayName + ' does not have ' + cash + 'PiEmPeRs cash.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	}

	const flip = Math.round(Math.random());

	if (flip === 1) {
		client.casino[interaction.guildId][interaction.user.id]['cash'] = client.casino[interaction.guildId][interaction.user.id]['cash'] + cash;
		client.casino[interaction.guildId][user.id]['cash'] = client.casino[interaction.guildId][user.id]['cash'] - cash;
		client.saveCasino();

		const embed = new MessageEmbed()
			.setTitle('Steal')
			.setDescription('You won the steal there will be ' + cash + 'PiEmPeRs added to your cash. And ' + cash + ' removed from ' + user.displayName)
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	} else {
		client.casino[interaction.guildId][interaction.user.id]['cash'] = client.casino[interaction.guildId][interaction.user.id]['cash'] - cash;
		client.casino[interaction.guildId][user.id]['cash'] = client.casino[interaction.guildId][user.id]['cash'] + cash;
		client.saveCasino();

		const embed = new MessageEmbed()
			.setTitle('Steal')
			.setDescription('You lost the steal there will be ' + cash + 'PiEmPeRs removed from your cash. And ' + cash + ' added to ' + user.displayName)
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	}
}

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").CommandInteraction} interaction
 */
async function wheel(client, interaction) {
	const cash = interaction.options.getInteger('amount');

	if (client.casino[interaction.guildId][interaction.user.id]['cash'] < cash && client.casino[interaction.guildId][interaction.user.id]['cash'] >= 0) {
		const embed = new MessageEmbed()
			.setTitle('Wheel')
			.setDescription('You do not have ' + cash + 'PiEmPeRs cash. Use withdraw to get cash if you have it on your bank.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	}

	const options = {
		0.0: 10,
		0.35: 10,
		0.4: 10,
		0.45: 10,
		0.5: 10,
		0.55: 10,
		0.6: 10,
		0.65: 10,
		0.7: 10,
		0.75: 20,
		0.8: 20,
		0.85: 30,
		0.9: 30,
		1: 5,
		1.2: 30,
		1.25: 30,
		1.3: 20,
		1.35: 20,
		1.4: 10,
		1.45: 10,
		1.5: 10,
		1.55: 10,
		1.6: 10,
		1.65: 10,
		1.7: 10,
		//  3: 5,
		//  6: 3,
		//  11: 1
	};

	const option = get(options);

	if (option > 1) {
		client.casino[interaction.guildId][interaction.user.id]['cash'] = client.casino[interaction.guildId][interaction.user.id]['cash'] + cash * (option - 1);
		client.saveCasino();

		const embed = new MessageEmbed()
			.setTitle('Wheel')
			.setDescription('You won the wheel by ' + ((option - 1) * 100).toFixed(2) + '% there will be ' + (cash * (option - 1)).toFixed(2) + 'PiEmPeRs added to your cash.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	} else if (option < 1) {
		client.casino[interaction.guildId][interaction.user.id]['cash'] = client.casino[interaction.guildId][interaction.user.id]['cash'] - cash * (1 - option);
		client.saveCasino();

		const embed = new MessageEmbed()
			.setTitle('Wheel')
			.setDescription('You lost the wheel by ' + ((1 - option) * 100).toFixed(2) + '% there will be ' + (cash * (1 - option)).toFixed(2) + 'PiEmPeRs removed from your cash.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	} else {
		const embed = new MessageEmbed()
			.setTitle('Wheel')
			.setDescription('You played even there will be no PiEmPeRs removed from or added to your cash.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	}
}

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").CommandInteraction} interaction
 */
async function slotmachine(client, interaction) {
	if (!slotmachineImages.citroen) {
		await loadSlotmachineImages();
	}

	const cash = interaction.options.getInteger('amount');

	if (client.casino[interaction.guildId][interaction.user.id]['cash'] < cash && client.casino[interaction.guildId][interaction.user.id]['cash'] >= 0) {
		const embed = new MessageEmbed()
			.setTitle('Slotmachine')
			.setDescription('You do not have ' + cash + 'PiEmPeRs cash. Use withdraw to get cash if you have it on your bank.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	}

	const canvas = Canvas.createCanvas(382, 535);
	const ctx = canvas.getContext('2d');

	ctx.drawImage(slotmachineImages.slot, 0, 0, canvas.width, canvas.height);

	let slot1 = Math.round(Math.random() * 9) - 1;
	if (slot1 < 0) slot1 = 0;
	switch (slot1) {
		case 0:
			ctx.drawImage(slotmachineImages.banaan, 45, 90, 63, 63);
			break;
		case 1:
			ctx.drawImage(slotmachineImages.kers, 45, 90, 63, 63);
			break;
		case 2:
			ctx.drawImage(slotmachineImages.seven, 45, 90, 63, 63);
			break;
		case 3:
			ctx.drawImage(slotmachineImages.pruim, 45, 90, 63, 63);
			break;
		case 4:
			ctx.drawImage(slotmachineImages.watermeloen, 45, 90, 63, 63);
			break;
		case 5:
			ctx.drawImage(slotmachineImages.sinaasapple, 45, 90, 63, 63);
			break;
		case 6:
			ctx.drawImage(slotmachineImages.citroen, 45, 90, 63, 63);
			break;
		case 7:
			ctx.drawImage(slotmachineImages.bel, 45, 90, 63, 63);
			break;
		case 8:
			ctx.drawImage(slotmachineImages.bar, 45, 90, 63, 63);
			break;

		default:
			ctx.drawImage(slotmachineImages.kers, 45, 90, 63, 63);
			break;
	}

	let slot2 = Math.round(Math.random() * 9) - 1;
	if (slot2 < 0) slot2 = 0;
	switch (slot2) {
		case 0:
			ctx.drawImage(slotmachineImages.banaan, 125, 90, 63, 63);
			break;
		case 1:
			ctx.drawImage(slotmachineImages.kers, 125, 90, 63, 63);
			break;
		case 2:
			ctx.drawImage(slotmachineImages.seven, 125, 90, 63, 63);
			break;
		case 3:
			ctx.drawImage(slotmachineImages.pruim, 125, 90, 63, 63);
			break;
		case 4:
			ctx.drawImage(slotmachineImages.watermeloen, 125, 90, 63, 63);
			break;
		case 5:
			ctx.drawImage(slotmachineImages.sinaasapple, 125, 90, 63, 63);
			break;
		case 6:
			ctx.drawImage(slotmachineImages.citroen, 125, 90, 63, 63);
			break;
		case 7:
			ctx.drawImage(slotmachineImages.bel, 125, 90, 63, 63);
			break;
		case 8:
			ctx.drawImage(slotmachineImages.bar, 125, 90, 63, 63);
			break;

		default:
			ctx.drawImage(slotmachineImages.kers, 125, 90, 63, 63);
			break;
	}

	let slot3 = Math.round(Math.random() * 9) - 1;
	if (slot3 < 0) slot3 = 0;
	switch (slot3) {
		case 0:
			ctx.drawImage(slotmachineImages.banaan, 205, 90, 63, 63);
			break;
		case 1:
			ctx.drawImage(slotmachineImages.kers, 205, 90, 63, 63);
			break;
		case 2:
			ctx.drawImage(slotmachineImages.seven, 205, 90, 63, 63);
			break;
		case 3:
			ctx.drawImage(slotmachineImages.pruim, 205, 90, 63, 63);
			break;
		case 4:
			ctx.drawImage(slotmachineImages.watermeloen, 205, 90, 63, 63);
			break;
		case 5:
			ctx.drawImage(slotmachineImages.sinaasapple, 205, 90, 63, 63);
			break;
		case 6:
			ctx.drawImage(slotmachineImages.citroen, 205, 90, 63, 63);
			break;
		case 7:
			ctx.drawImage(slotmachineImages.bel, 205, 90, 63, 63);
			break;
		case 8:
			ctx.drawImage(slotmachineImages.bar, 205, 90, 63, 63);
			break;

		default:
			ctx.drawImage(slotmachineImages.kers, 45, 90, 63, 63);
			break;
	}

	if (slot1 === slot2 && slot2 === slot3) {
		client.casino[interaction.guildId][interaction.user.id]['cash'] = client.casino[interaction.guildId][interaction.user.id]['cash'] + cash * 100;
		client.saveCasino();

		const embed = new MessageEmbed()
			.setTitle('Slotmachine')
			.setDescription('You won the slotmachine. There will be ' + cash * 100 + 'PiEmPeRs added to your cash.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		await interaction.reply({
			files: [
				{
					attachment: canvas.toBuffer(),
				},
			],
		});
		setTimeout(async () => {
			await interaction.followUp({ embeds: [embed] });
		}, 100);
	} else {
		client.casino[interaction.guildId][interaction.user.id]['cash'] = client.casino[interaction.guildId][interaction.user.id]['cash'] - cash;
		client.saveCasino();

		const embed = new MessageEmbed()
			.setTitle('Slotmachine')
			.setDescription('You lost the slotmachine. There will be ' + cash + 'PiEmPeRs removed from your cash.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		await interaction.reply({
			files: [
				{
					attachment: canvas.toBuffer(),
				},
			],
		});
		setTimeout(async () => {
			await interaction.followUp({ embeds: [embed] });
		}, 100);
	}
}

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").CommandInteraction} interaction
 */
async function roulet(client, interaction) {
	const cash = interaction.options.getInteger('amount');

	if (client.casino[interaction.guildId][interaction.user.id]['cash'] < cash && client.casino[interaction.guildId][interaction.user.id]['cash'] >= 0) {
		const embed = new MessageEmbed()
			.setTitle('Roulet')
			.setDescription('You do not have ' + cash + 'PiEmPeRs cash. Use withdraw to get cash if you have it on your bank.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	}

	const number = interaction.options.getInteger('number');

	const numberR = Math.round(Math.random() * 36);
	if (number === numberR) {
		const cashAdded = cash * 36;
		client.casino[interaction.guildId][interaction.user.id]['cash'] = client.casino[interaction.guildId][interaction.user.id]['cash'] + cashAdded;
		client.saveCasino();

		const embed = new MessageEmbed()
			.setTitle('Roulet')
			.setDescription('You won the rouconst the number was ' + numberR + '. There will be ' + cashAdded + 'PiEmPeRs added to your cash.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	} else {
		client.casino[interaction.guildId][interaction.user.id]['cash'] = client.casino[interaction.guildId][interaction.user.id]['cash'] - cash;
		client.saveCasino();

		const embed = new MessageEmbed()
			.setTitle('Roulet')
			.setDescription('You lost the rouconst the number was ' + numberR + '. There will be ' + cash + 'PiEmPeRs removed from your cash.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	}
}

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").CommandInteraction} interaction
 */
async function give(client, interaction) {
	const user = interaction.options.getMember('user');
	if (user) client.updateUser(interaction.guildId, user.user);

	const cash = interaction.options.getInteger('amount');

	if (client.casino[interaction.guildId][interaction.user.id]['cash'] < cash && client.casino[interaction.guildId][interaction.user.id]['cash'] >= 0) {
		const embed = new MessageEmbed()
			.setTitle('Give')
			.setDescription('You do not have ' + cash + 'PiEmPeRs cash. Use withdraw to get cash if you have it on your bank.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	}

	client.casino[interaction.guildId][interaction.user.id]['cash'] = client.casino[interaction.guildId][interaction.user.id]['cash'] - cash;
	client.casino[interaction.guildId][user.id]['cash'] = client.casino[interaction.guildId][user.id]['cash'] + cash;
	client.saveCasino();

	const embed = new MessageEmbed()
		.setTitle('Give')
		.setDescription('You have given ' + user.displayName + ' ' + cash + 'PiEmPeRs.')
		.setColor('#FFAA00')
		.setThumbnail(client.user.displayAvatarURL())
		.setTimestamp(Date.now())
		.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

	return await interaction.reply({ embeds: [embed] });
}

function get(input) {
	const array = [];
	for (const item in input) {
		if (item in input) {
			// Safety
			for (let i = 0; i < input[item]; i++) {
				array.push(item);
			}
		}
	}
	// Probability Fun
	return array[Math.floor(Math.random() * array.length)];
}

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").CommandInteraction} interaction
 */
async function dailywheel(client, interaction) {
	if (!('dailywheel' in client.casino[interaction.guildId][interaction.user.id])) {
		const date = new Date();
		date.setDate(date - 1);
		client.casino[interaction.guildId][interaction.user.id]['dailywheel'] = date.toDateString();
		client.saveCasino();
	}

	if (client.casino[interaction.guildId][interaction.user.id]['dailywheel'] === new Date().toDateString()) {
		const embed = new MessageEmbed()
			.setTitle('Dailywheel')
			.setDescription('You already did the dailywheel today.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	}

	const options = {
		3: 35,
		4: 24,
		7: 23,
		10: 14,
		100: 3,
		1000: 1,
	};

	const option = get(options);
	const date = new Date();
	client.casino[interaction.guildId][interaction.user.id]['dailywheel'] = date.toDateString();
	client.casino[interaction.guildId][interaction.user.id]['cash'] = client.casino[interaction.guildId][interaction.user.id]['cash'] + parseInt(option);
	client.saveCasino();

	const embed = new MessageEmbed()
		.setTitle('Dailywheel')
		.setDescription('You won the dailywheel. You got ' + option + '. There will be ' + option + 'PiEmPeRs added to your cash.')
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
async function coinflip(client, interaction) {
	const cash = interaction.options.getInteger('amount');

	if (client.casino[interaction.guildId][interaction.user.id]['cash'] < cash && client.casino[interaction.guildId][interaction.user.id]['cash'] >= 0) {
		const embed = new MessageEmbed()
			.setTitle('Coinflip')
			.setDescription('You do not have ' + cash + 'PiEmPeRs cash. Use withdraw to get cash if you have it on your bank.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	}

	const flip = Math.round(Math.random());

	if (flip === 1) {
		client.casino[interaction.guildId][interaction.user.id]['cash'] = client.casino[interaction.guildId][interaction.user.id]['cash'] + cash;
		client.saveCasino();
		const embed = new MessageEmbed()
			.setTitle('Coinflip')
			.setDescription('You won the coinflip there will be ' + cash + 'PiEmPeRs added to your cash.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	} else {
		client.casino[interaction.guildId][interaction.user.id]['cash'] = client.casino[interaction.guildId][interaction.user.id]['cash'] - cash;
		client.saveCasino();
		const embed = new MessageEmbed()
			.setTitle('Coinflip')
			.setDescription('You lost the coinflip there will be ' + cash + 'PiEmPeRs removed from your cash.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	}
}

const betInfo = {};

/**
 * @param {import("discord.js").Client} client
 * @param {import("discord.js").CommandInteraction} interaction
 */
async function bet(client, interaction) {
	if (interaction.options.getSubcommand() === 'start') {
		const user = interaction.options.getMember('user');

		if (!client.casino[interaction.guildId][user.id]) {
			const embed = new MessageEmbed()
				.setTitle('Bet')
				.setDescription('You cannot bet ' + user.displayName + '.')
				.setColor('#FFAA00')
				.setThumbnail(client.user.displayAvatarURL())
				.setTimestamp(Date.now())
				.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

			return await interaction.reply({ embeds: [embed] });
		}

		const cash = interaction.options.getInteger('amount');

		if (client.casino[interaction.guildId][interaction.user.id]['cash'] < cash && client.casino[interaction.guildId][interaction.user.id]['cash'] >= 0) {
			const embed = new MessageEmbed()
				.setTitle('Bet')
				.setDescription('You do not have ' + cash + 'PiEmPeRs cash. Use withdraw to get cash if you have it on your bank.')
				.setColor('#FFAA00')
				.setThumbnail(client.user.displayAvatarURL())
				.setTimestamp(Date.now())
				.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

			return await interaction.reply({ embeds: [embed] });
		}

		const embed = new MessageEmbed()
			.setTitle('Bet')
			.setDescription('You betted ' + user.displayName + ' with ' + cash + '.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	} else if (interaction.options.getSubcommand() === 'deny') {
		for (const id in betInfo) {
			if (!(id in betInfo)) continue;
			if (betInfo[id]['sender'] !== interaction.options.getMember('user').id) continue;
			if (betInfo[id]['reciver'] !== interaction.user.id) continue;
			delete betInfo[id];
		}

		const embed = new MessageEmbed()
			.setTitle('Bet')
			.setDescription('You denied the bed of ' + interaction.options.getMember('user').displayName + '.')
			.setColor('#FFAA00')
			.setThumbnail(client.user.displayAvatarURL())
			.setTimestamp(Date.now())
			.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

		return await interaction.reply({ embeds: [embed] });
	} else if (interaction.options.getSubcommand() === 'accept') {
		const user = interaction.options.getMember('user');
		let betId = 0;
		for (const id in betInfo) {
			if (!(id in betInfo)) continue;
			if (betInfo[id]['sender'] !== user.id) continue;
			if (betInfo[id]['reciver'] !== interaction.user.id) continue;
			betId = id;
		}

		if (!user || betId === 0) {
			const embed = new MessageEmbed()
				.setTitle('Bet')
				.setDescription(user.displayName + " didn't bet you.")
				.setColor('#FFAA00')
				.setThumbnail(client.user.displayAvatarURL())
				.setTimestamp(Date.now())
				.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

			return await interaction.reply({ embeds: [embed] });
		}

		const cash = betInfo[betId]['amount'];
		if (client.casino[interaction.guildId][interaction.user.id]['cash'] < cash && client.casino[interaction.guildId][interaction.user.id]['cash'] >= 0) {
			const embed = new MessageEmbed()
				.setTitle('Bet')
				.setDescription('You do not have ' + cash + 'PiEmPeRs cash. Use withdraw to get cash if you have it on your bank.')
				.setColor('#FFAA00')
				.setThumbnail(client.user.displayAvatarURL())
				.setTimestamp(Date.now())
				.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

			return await interaction.reply({ embeds: [embed] });
		}

		const flip = Math.round(Math.random());

		if (flip === 1) {
			client.casino[interaction.guildId][interaction.user.id]['cash'] = client.casino[interaction.guildId][interaction.user.id]['cash'] + cash;
			client.casino[interaction.guildId][user.id]['cash'] = client.casino[interaction.guildId][user.id]['cash'] - cash;
			const embed = new MessageEmbed()
				.setTitle('Bet')
				.setDescription('You won the bet there will be ' + cash + 'PiEmPeRs added to your cash. And ' + cash + ' removed from ' + user.displayName)
				.setColor('#FFAA00')
				.setThumbnail(client.user.displayAvatarURL())
				.setTimestamp(Date.now())
				.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

			await interaction.reply({ embeds: [embed] });
		} else {
			client.casino[interaction.guildId][interaction.user.id]['cash'] = client.casino[interaction.guildId][interaction.user.id]['cash'] - cash;
			client.casino[interaction.guildId][user.id]['cash'] = client.casino[interaction.guildId][user.id]['cash'] + cash;
			const embed = new MessageEmbed()
				.setTitle('Bet')
				.setDescription('You lost the bet there will be ' + cash + 'PiEmPeRs removed from your cash. And ' + cash + ' added to ' + user.displayName)
				.setColor('#FFAA00')
				.setThumbnail(client.user.displayAvatarURL())
				.setTimestamp(Date.now())
				.setFooter(`PiEmPeRs | Made by DJ1TJOO`);

			await interaction.reply({ embeds: [embed] });
		}

		for (const id in betInfo.casino) {
			if (!(id in betInfo.casino)) continue;
			if (betInfo.casino[id]['sender'] !== user.id) continue;
			if (betInfo.casino[id]['reciver'] !== interaction.user.id) continue;
			delete betInfo.casino[id];
		}
	}
}

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
	const user = interaction.options.getMember('user');

	if (user) client.updateUser(interaction.guildId, user.user);

	const embed = new MessageEmbed()
		.setTitle('Money')
		.setDescription(
			(user ? user.displayName + ' has ' : 'You have ') +
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
		if (!(key in client.casino[interaction.guildId])) continue;

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
		if (!(key in client.casino[interaction.guildId])) continue;
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
