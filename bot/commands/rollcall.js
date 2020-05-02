//Notify if a bot is active in a channel
module.exports = {
  name: 'rollcall',
  description: 'Bot roll call.',
  aliases: 'attendance',
  execute(message, args){
    responses = ["Present!","I'm Here!","Accounted for!","At hand!","On Deck!","On hand!","Who does number two work for?!"];
    i = Math.round(Math.random()*responses.length);
    r = responses[i]
    message.channel.send(`${r}`);
  },
};