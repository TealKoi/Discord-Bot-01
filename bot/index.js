const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

//Create an array for commands
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//Populate commands array
for(const file of commandFiles){
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

//Create a cooldown array
const cooldowns = new Discord.Collection();

//When starting bot, notify when it is ready
client.once('ready', () => {console.log('Ready!');});

//Main Loop for messages
client.on('message', message => {
  //Break loop if message does not have the designated prefix or is from a bot
  if(!message.content.startsWith(prefix) || message.author.bot) return;

  //Break the prefix off the message, make the message lowercase, and set it as commandName
  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  //Using the commandName, find a matching name/alias and set the match as a command. If no match, break loop
  const command = client.commands.get(commandName) || client.commands.find(cmd =>
    cmd.aliases && cmd.aliases.includes(commandName));
    if(!command) return;
  
  //If the command requires arguments but none were provided, notify poster of it missing argument(s) if listed
  if(command.args && !args.length){
    let reply = `No arguments provided, ${message.author}!`;

    if(command.usage){
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  //If the command does not have a cooldown in the array, set a new one with a default of 3 second if one is not specified in the command
  if(!cooldowns.has(command.name)){
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  //If the command has a cooldown in the array, notify the poster of the remaining time
  if(timestamps.has(message.author.id)){
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if(now < expirationTime){
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before resusing the \`${command.name}\` command.`);
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  
  //Try to execute the command provided. If an error occurs, notify the poster
  try{
    command.execute(message, args);
  }catch(error){
    console.error(error);
    message.reply('Error executing command!');
  }
});

//Verify client token for bot
client.login(token);