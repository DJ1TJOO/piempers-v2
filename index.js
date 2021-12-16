/* eslint-disable no-prototype-builtins */
// Load envoirment variables
require('dotenv').config();

// Require node
const fs = require('fs');

// Require the necessary discord.js classes
const { Client, Collection, Intents } = require('discord.js');

// Create a new client instance
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

// Commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// Voice
require('./voice/voice-events');

// Casino
client.casino = require('./casino.json');
client.saveCasino = () => {
	const json = JSON.stringify(client.casino, null, 4);
	fs.writeFileSync('casino.json', json, 'utf8');
};

/**
 * @param {import('discord.js').Snowflake} guildId
 * @param {import('discord.js').GuildMember} member
 */
client.updateUser = (guildId, member) => {
	if (!client.casino[guildId]) client.createCasino(guildId);

	if (!(member.id in client.casino[guildId])) {
		client.casino[guildId][member.id] = {};
	}

	if (!('tag' in client.casino[guildId][member.id])) {
		client.casino[guildId][member.id]['tag'] = member.tag.split(' ').join('_');
	}

	if (client.casino[guildId][member.id]['tag'] !== member.tag.split(' ').join('_')) {
		client.casino[guildId][member.id]['tag'] = member.tag.split(' ').join('_');
	}

	if (!('cash' in client.casino[guildId][member.id])) {
		client.casino[guildId][member.id]['cash'] = client.casino[guildId]['startingcash'];
	}

	if (!('bank' in client.casino[guildId][member.id])) {
		client.casino[guildId][member.id]['bank'] = 0;
	}

	if (!('won' in client.casino[guildId][member.id])) {
		client.casino[guildId][member.id]['won'] = [];
	}

	client.saveCasino();
};

/**
 * @param {import('discord.js').Snowflake} guildId
 */
client.createCasino = (guildId) => {
	client.casino[guildId] = {};

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

	client.casino[guildId]['starteddate'] = `${dd}-${mm}-${yyyy}`;
	client.casino[guildId]['startingcash'] = 0;

	dd = today.getDate();

	mm = today.getMonth() + 1;
	yyyy = today.getFullYear();
	if (dd < 10) {
		dd = `0${dd}`;
	}

	if (mm < 10) {
		mm = `0${mm}`;
	}
	client.casino[guildId]['enddate'] = `${dd}-${mm}-${yyyy}`;
};

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity('/help voor meer info');
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(client, interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN).then(() => {
	console.log(
		client.generateInvite({
			scopes: ['applications.commands', 'bot', 'guilds'],
			permissions: [
				'ADD_REACTIONS',
				'ATTACH_FILES',
				'CHANGE_NICKNAME',
				'CONNECT',
				'EMBED_LINKS',
				'MANAGE_MESSAGES',
				'MANAGE_ROLES',
				'READ_MESSAGE_HISTORY',
				'SPEAK',
				'STREAM',
				'START_EMBEDDED_ACTIVITIES',
				'VIEW_CHANNEL',
			],
		}),
	);
});
