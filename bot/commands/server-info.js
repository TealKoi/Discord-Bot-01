//Provide information about arguments ***will be changed to server-info
module.exports = {
  name: 'server-info',
  description: 'Information about the server.',
  aliases: 'server',
  execute(message, args){
    message.channel.send(`Server Name: ${message.guild.name}\nTotal Members: ${message.guild.memberCount}`);
  },
};