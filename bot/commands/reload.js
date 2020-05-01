//Command to reload specified commands without having to reboot the bot
module.exports = {
  name: 'reload',
  description: 'Reloads a command',
  args: true,
  execute(message, args){
    //Using the commandName, find a matching name/alias and set the match as a command. If no match, break loop. If match, delete the command from the cache.
    const commandName = args[0].toLowerCase();
    const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => 
      cmd.aliases && cmd.aliases.includes(commandName));
    
    if(!command) return message.channel.send(`No such command with name/alias \`${commandName}\`, ${message.author}!`);

    delete require.cache[require.resolve(`./${command.name}.js`)];

    //Try to reload the command. If an Error occurs, notify the poster and post the error message.
    try{
      const newCommand = require(`./${command.name}.js`);
      message.client.commands.set(newCommand.name, newCommand);
      message.channel.send(`Command \`${command.name}\` was reloaded!`);
    }catch(error){
      console.log(error);
      message.channel.send(`Error reloading command \`${command.name}\`:\n\`${error.message}\``);
    }
  },
};