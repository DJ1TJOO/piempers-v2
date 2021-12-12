const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('customrank')
		.setDescription('Custom rank toevoegen of verwijderen')
		.addRoleOption((option) => option.setName('role').setDescription('role').setRequired(true)),

	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").CommandInteraction} interaction
	 */
	async execute(client, interaction) {
		const role = interaction.options.getRole('role');

		const customranks = ['amongus'];
		if (!role || !customranks.find((r) => r === role.name)) {
			const embed = new MessageEmbed()
				.setTitle('Customrank')
				.setDescription(`${role.name} is not an avaliable customrank!`)
				.setColor('#FFAA00')
				.setThumbnail(client.user.displayAvatarURL())
				.setTimestamp(Date.now())
				.setFooter('PiEmPeRs | Made by DJ1TJOO');
			return await interaction.reply({ embeds: [embed] });
		}

		/**
		 * @type {import("discord.js").GuildMember}
		 */
		const member = interaction.member;
		if (member.roles.cache.find((r) => r.id === role.id)) {
			member.roles.remove(role);
			const embed = new MessageEmbed()
				.setTitle('Customrank')
				.setDescription(`Je hebt nu niet meer de ${role.name} customrank!`)
				.setColor('#FFAA00')
				.setThumbnail(client.user.displayAvatarURL())
				.setTimestamp(Date.now())
				.setFooter('PiEmPeRs | Made by DJ1TJOO');
			return await interaction.reply({ embeds: [embed] });
		} else {
			member.roles.add(role);
			const embed = new MessageEmbed()
				.setTitle('Customrank')
				.setDescription(`Je hebt nu de ${role.name} customrank!`)
				.setColor('#FFAA00')
				.setThumbnail(client.user.displayAvatarURL())
				.setTimestamp(Date.now())
				.setFooter('PiEmPeRs | Made by DJ1TJOO');
			return await interaction.reply({ embeds: [embed] });
		}
	},
};
