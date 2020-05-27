//Roll a dice and present result
module.exports = {
  name: 'roll',
  description: 'roll x-number of n-sided dice',
  usage: '[default = 1d20+0]',
  args: true,
  execute(message, args){
    rolls = [];
    rollsTotal = 0;
    numberDice = Number(args[0]);
    numberSides = Number(args[1]);
    modifier = Number(args[2]);

    for(let i=0; i<numberDice; i++){
      rolls[i] = Math.floor(Math.random()*numberSides)+1;
    }

    for(let i=0; i<rolls.length; i++){
      rollsTotal += rolls[i];
      message.channel.send(`Roll #${i+1}: ${rolls[i]}`);
    }

    message.channel.send(`Total: ${rollsTotal}`);
  },
};