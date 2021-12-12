// Load envoirment variables
require('dotenv').config();

// Require node
const fs = require('fs');

// Require the necessary discord.js classes
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);

rest.put(
	process.env.NODE_ENV === 'prod'
		? Routes.applicationCommands(process.env.DISCORD_CLIENT_ID)
		: Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
	{
		body: commands,
	},
)
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
