const Discord = require("discord.js")

module.exports = {
  name: "message",
  description: "Painel de elos",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
        interaction.reply({ content: `Você não possui permissão para utilzar este comando!`, ephemeral: true })
    } else {
        let embed = new Discord.EmbedBuilder()
        .setColor("Purple")
        .setImage ()
        .setDescription(`\n\n**Compra de Contas com Elo** `);

        let painel = new Discord.ActionRowBuilder().addComponents(
            new Discord.StringSelectMenuBuilder()
            .setCustomId("rank_options")
            .setPlaceholder("Escolha o Elo da conta que deseja comprar!")
            .addOptions(
                {
                    label: "Gold",
                    description: "Compre uma conta com o Elo Ouro",
                    value: "gold",
                    emoji: "🥰"
                },
                {
                    label: "Platinum",
                    description: "Compre uma conta com o Elo Platina",
                    value: "platinum",
                    emoji: "🥰"
                },
                {
                    label: "Diamond",
                    description: "Compre uma conta com o Elo Diamante",
                    value: "diamond",
                    emoji: "🥰"
                },
                {
                    label: "Master",
                    description: "Compre uma conta com o elo Mestre",
                    value: "master",
                    emoji: "<:master:1066994137896849418>"
                }
            )
        );

        interaction.reply({ content: `✅ Mensagem enviada!`, ephemeral: true })
        interaction.channel.send({ embeds: [embed], components: [painel] })
    }


  }
}