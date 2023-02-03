const { Client, GatewayIntentBits } = require('discord.js');
const Discord = require("discord.js");
const { v4 : uuidv4 } = require('uuid');
require('dotenv').config()
var fs = require('fs');

const myData = require('./databases/estoque.json');
const pagAtivos = require('./databases/pagAtivos.json')

const client = new Discord.Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

module.exports = client

client.on('interactionCreate', (interaction) => {

  if(interaction.type === Discord.InteractionType.ApplicationCommand){

      const cmd = client.slashCommands.get(interaction.commandName);

      if (!cmd) return interaction.reply(Error);

      interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

      cmd.run(client, interaction)

   }
})

client.slashCommands = new Discord.Collection()
require('./handler')(client)
client.login(process.env.TOKEN)


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})


client.on("interactionCreate", (interaction) => {
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === "rank_options") {

      let options = interaction.values[0]

      if (options === "gold") {

         const channel_name = `✨gold-${interaction.user.id}`;
         const text_category_id = "1067186618391343195" 
        
         if (!interaction.guild.channels.cache.get(text_category_id)) text_category_id = null;
  
         if (interaction.guild.channels.cache.find(c => c.name === channel_name)) {
           interaction.reply({ content: `❌ Você já possui uma compra aberta em ${interaction.guild.channels.cache.find(c => c.name === channel_name)}!`, ephemeral: true })
         } else {
           interaction.guild.channels.create({
           name: channel_name,
           type: Discord.ChannelType.GuildText,
           parent: text_category_id,
           permissionOverwrites: [
             {
               id: interaction.guild.id,
               deny: [
                 Discord.PermissionFlagsBits.ViewChannel
               ]
             },
             {
               id: interaction.user.id,
               allow: [
                 Discord.PermissionFlagsBits.ViewChannel,
                 Discord.PermissionFlagsBits.SendMessages,
                 Discord.PermissionFlagsBits.AttachFiles,
                 Discord.PermissionFlagsBits.EmbedLinks,
                 Discord.PermissionFlagsBits.AddReactions
               ]
             }
           ]
         }).then( (ch) => {

            const indexAccount = myData.findIndex(k => k.elo === "gold")
            const goldAccount = {...myData[indexAccount]}
            const myDataFiltered = myData.filter(k => k.user !== goldAccount.user)
            const myDataSpliced = {...myData.splice(indexAccount,1)}

            console.log(myData)
            
            fs.writeFile("./databases/estoque.json", JSON.stringify(myDataFiltered), function(err) {
              if(err) {
                   console.log(err);
               } else {
                   console.log("Moved to pagAtivos");
               }
               
            }); 

            const Account = {
              "user": goldAccount.user,
              "password": goldAccount.password,
              "elo": goldAccount.elo,
              "vendedor": goldAccount.vendedor,
              "comprador": interaction.user.id,
              "canal": ch.id,
              "data": new Date()
            }

            pagAtivos.push(Account)

           fs.writeFile("./databases/pagAtivos.json", JSON.stringify(pagAtivos), function(err) {
             if(err) {
                  console.log(err);
              } else {
                  console.log("Saved");
              }
              
           }); 

           console.log(myData)

            interaction.reply({ content: `Olá ${interaction.user}, seu ticket foi aberto em ${ch}!`, ephemeral: true })
            const embed = new Discord.EmbedBuilder()
            .setColor("Purple")
            .setDescription(`${goldAccount.user}\n${goldAccount.password}\n${goldAccount.elo}\n${goldAccount.vendedor}`);
            const button = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
             .setCustomId("close_ticket")
             .setEmoji("🔒")
             .setStyle(Discord.ButtonStyle.Danger)
            );
       
            ch.send({ embeds: [embed], components: [button] })


         })
         }

      } else if (options === "platinum") {

        interaction.reply({ content: `Você escolheu Platinum`, ephemeral: true })

      } else if ( options === "diamond"){

        interaction.reply({ content: `Você escolheu Diamond`, ephemeral: true })

      } else if (options === "master"){

        interaction.reply({ content: `Você escolheu Master`, ephemeral: true })

      } 
    }
  } else if (interaction.isButton()) {
      if (interaction.customId === "close_ticket") {
        interaction.reply('Foda-se')

        const indexPayment = pagAtivos.findIndex(k => k.comprador === interaction.user.id)
        const payment = {...pagAtivos[indexPayment]}
        const pagAtivosFiltered = pagAtivos.filter(k => k.comprador !== interaction.user.id)

        const accountBack = {
          "user": payment.user,
          "password": payment.password,
          "elo": payment.elo,
          "vendedor": payment.vendedor  
        }

        myData.unshift(accountBack)

        fs.writeFile("./databases/pagAtivos.json", JSON.stringify(pagAtivosFiltered), function(err) {
          if(err) {
              console.log(err);
          } else {
              console.log("Removed from pagAtivos ");
          }
      }); 

      fs.writeFile("./databases/estoque.json", JSON.stringify(myData), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Back to Storage ");
        }
    }); 


        setTimeout ( () => {
        try { 
          interaction.channel.delete()
        } catch (e) {
          return;
        }
      }, 5000)
    }
  }

})

/*

let request = require(`request`);
function download(url){
    request.get(url)
        .on('error', console.error)
        .pipe(fs.createWriteStream('./importar/import.txt'));
}

client.on('messageCreate', async (msg) => {

  if (msg.attachments) {
    
    
   download(msg.attachments.first().url)

    const data = fs.readFileSync('./importar/import.txt', {encoding:'utf8', flag:'r'});

    const content = data.toString();
    const splited = content.split('\n')

    const user = splited[0]
    const userSplited = user.split(': ')
    const finalUser = userSplited[1]

    console.log(finalUser)
    /*
    const user = splited[0]
    const password = splited[1]
    const elo = splited[2]
    const vendedor = splited[3]
    const pix = splited[4]


    const passwordSplited = password.split(': ')
    const eloSplited = elo.split(': ')
    const vendedorSplited = vendedor.split(': ')
    const pixSplited = pix.split(': ')

    const finalUser = userSplited[1]
    const finalPassword = passwordSplited[1]
    const finalElo = eloSplited[1]
    const finalVendedor = vendedorSplited[1]
    const finalPix = pixSplited[1]

    const Account = {
      "id": uuidv4(),
      "user": finalUser,
      "password": finalPassword,
      "elo": finalElo,
      "vendedor": finalVendedor,
      "pixVendedor": finalPix
    }

  
  }

});

*/