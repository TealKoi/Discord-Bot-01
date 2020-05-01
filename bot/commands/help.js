const {prefix} = require('../config.json');

//Command to dynamically post a list of available commands and their usage/descriptions
module.exports = {
  name: 'help',
  description: 'List all commands or info about a specific command.',
  aliases: ['commands'],
  usage: '[command name]',
  cooldown: 5,
  execute(message, args){
    const data = [];
    const {commands} = message.client;

    //If no arguments are provided, list all available commands in the posters DMs. Notify the poster of the DM, or that the DM was unable to reach the poster
    if(!args.length){
      data.push('Here is a list of all my commands!\n');
      data.push(commands.map(command => command.name).join('\n'));
      data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

      return message.author.send(data, {split: true })
        .then(() => {
          if(message.channel.type === 'dm') return;
          message.reply('I have sent you a DM!');
        })
        .catch(error => {
          console.error(`Could not send DM to ${message.author.tag}.\n`, error);
          message.reply('It seems like I cannot DM you?');
        });
    }

    //If an argument was provided, look for the argument in the list of commands/aliases. If no match, notify the poster. If match, post the command name/aliases/description/usage/cooldown
    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if(!command){
      return message.reply('Not a valid command');
    }
    data.push(`**name:** ${command.name}`);
    if(command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
    if(command.description) data.push(`**Description:** ${command.description}`);
    if(command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
    data.push(`**Cooldown:** ${command.cooldown} || 3 second(s)`);
    message.channel.send(data, {split: true});
  },
};