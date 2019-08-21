//ctrl-shift-b to RUN, ctrl-shift-t to open terminal
const Discord = require('discord.js'); //just making sure we have discord.js
const { prefix, token} = require('./config.json');
const client = new Discord.Client();
var maxRoll = 0;

client.once('ready', () => {
  console.log('Ready!')
})

client.on('message', message => {
  if(message.content.startsWith(`${prefix}reset`)){
    resetBot(message.channel);
  }

  else if(message.content.startsWith(`${prefix}r`)) {
    let player = message.member;
    var messageCont = message.content.substring(2);
    if(messageCont.length != 0)
    {
      messageCont = messageCont.replace(/ /g, "");
      var rollNum = processRoll(messageCont);
      if(rollNum == 0){
        message.channel.send("Invalid Input")
      }
      else{
        console.log(rollNum + " " + maxRoll);
        var funMessage = genMessage(rollNum, maxRoll);
        message.channel.send(funMessage);
        message.channel.send(player.displayName + " Rolled a " + rollNum);
      }
    }
  }
})

function processRoll(roll)
{
  var diceRoll = 0, i;
  var splitArr = roll.split('+');
  var k = splitArr.length;

  if(!splitArr[0].includes('d')){
    return 0;
  }
  else{
    for(i = 0; i < k; i++){
      diceRoll = diceRoll + sortSplit(splitArr[i]);
      }
    }
    return diceRoll;
}

function sortSplit(temp){
var num = 0, sub = 0;
  if(temp.includes('d')){
    if(temp.includes('-')){
      temp = temp.split('-');
      sub = parseInt(temp[1], 10);
      temp = temp[0];
    }
    temp = temp.split('d');
    var count = parseInt(temp[0], 10);
    var max = parseInt(temp[1],10);
    num = num + rollDice(count, 1, max);
    return num - sub;
  }
  if (temp.includes('-')){
    temp.replace(/-/g, '');
    num = parseInt(temp, 10);
    maxRoll = maxRoll - num;
    return -num;
  }
  else{
    num = parseInt(temp, 10);
    maxRoll = maxRoll + num;
    return num;
  }
}

function rollDice(count, min, max){
  if(count == 0){
    return 0;
  }
  else {
    var num = (Math.floor(Math.random() * (max - min) + min)) + rollDice(count-1, min, max);
    maxRoll = maxRoll + max;
    return num;
  }
}

function genMessage(roll,max){
  var ratio = roll / max;
  var mess;
  var i = (Math.floor(Math.random() * (6 - 0) + 0));
  if(ratio == 1){
    mess = "Critical!";
  }
  else if(ratio < 1 && ratio > .8)
  {
    var potential = ["Good Roll!", "Great!", "WOW!", "Your mom would be proud.", "Sweet!", "Fantastic", "Great job!"];
    mess = potential[i];
  }
  else if(ratio < .8 && ratio > .6){
    var potential = ["Not Bad", "Okay Roll", "Okay", "Decent", "Doesn't suck", "Hopefully this is good enough", "Good stuff bud"];
    mess = potential[i];
  }
  else if(ratio < .6 && ratio > .4){
    var potential = ["Okay", "Could be better", "Could be worse", "Hmmm", "Pretty average", "Doesn't suck", "You fulfilled your potential to be average"];
    mess = potential[i];
  }
  else if(ratio < .4 && ratio > .2){
    var potential = ["Wow that's bad", "Pretty rough roll", "Atleast you're not cheating", "Hopefully this roll isn't important", "Yikes", "Mama is not proud", "Corey probably rolled this"];
    mess = potential[i];
  }
  else if(ratio <.2 && ratio > 0){
    var potential = ["Wow....", "You suck", "Horrible", "This blows", "Not good at all", "......", ":("];
    mess = potential[i];
  }
  if(roll == 1)
  {
    mess = "Critical Failure :(";
  }

  maxRoll = 0;
  return mess;
}

function resetBot(channel) {
    channel.send('Resetting Bot...')
    .then(msg => client.destroy())
    .then(() => client.login(token));
}

client.login(token);
