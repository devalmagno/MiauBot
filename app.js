import Discord, { IntentsBitField, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
import { config } from 'dotenv';
config();

const client = new Discord.Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ]
});
const api_key = process.env.APIKEY;
const prefix = '!';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'cat') {
    try {
      const response = await fetch('https://api.thecatapi.com/v1/images/search', {
        headers: {
          'x-api-key': api_key,
        }
      });
      const data = await response.json();
      const catImgUrl = data[0].url;

      const catEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Aqui está sua imagem de gato:')
        .setImage(catImgUrl);

      message.channel.send({ embeds: [catEmbed] });
    } catch (err) {
      console.error(err);
      message.channel.send('Desculpe, não consegui encontrar uma imagem de gato no momento!');
    }
  }

  if (command === 'speak') {
    const messageContent = message.content.slice(7);

    if (messageContent.length === 0) {
      message.channel.send('Adicione alguma mensagem após o comando.')
      return;
    }

    const binary = messageContent
      .split('')
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join('');
    const spoken = binary.replace(/0/g, 'miau').replace(/1/g, 'Miau');

    const catEmbed = new EmbedBuilder()
      .setColor('#ff00ff')
      .setTitle('Aqui está a tradução para MeowSpeak')
      .setDescription(spoken);

    message.channel.send({ embeds: [catEmbed] });
  }

  if (command === 'hear') {
    const messageContent = message.content.slice(6);

    if (messageContent.length === 0) {
      message.channel.send('Adicione alguma mensagem após o comando.')
      return;
    }

    const miados = messageContent
      .split('')
      .map(char => (char === 'm' || char === 'M' ? (char === 'm' ? '0' : '1') : ''))
      .join('')
      .match(/.{8}/g)
      .map(binary => String.fromCharCode(parseInt(binary, 2)))
      .join('');

    const catEmbed = new EmbedBuilder()
      .setColor('#FFFF00')
      .setTitle('Aqui está a tradução do MeowSpeak')
      .setDescription(miados);

    message.channel.send({ embeds: [catEmbed] });
  }

  if (command === 'miau') {
    const catEmbed = new EmbedBuilder()
      .setColor('#57F287')
      .setTitle('Miau')

    message.channel.send({ embeds: [catEmbed] });
  }

  if (command === 'help') {
    const commands = [
      '!miau - o gatinho mia de volta pra você',
      '!cat - retorna uma imagem aleatória de um gato',
      '!speak [mensagem] - converte uma mensagem para binário usando "miau" e "Miau"',
      '!hear [miados] - converte miados em uma mensagem de texto',
      '!help - retorna uma lista de todos os comandos disponíveis'
    ];
    const commandList = commands.join('\n');

    const catEmbed = new EmbedBuilder()
      .setColor('#7289DA')
      .setTitle('Aqui está a lista de comandos disponíveis:')
      .setDescription(commandList);

    message.channel.send({ embeds: [catEmbed] });
  }
});

client.login(process.env.TOKEN);