const Discord = require('discord.js');
require('dotenv').config();
const fs = require('fs');
var glob = require('glob');
const roles = require('./roles.json');


// Getting all environment variables
const prefix = process.env.PREFIX;
const token = process.env.TOKEN;
const serverid = process.env.SERVERID;
const pathToRoles = process.env.PATH_TO_ROLES;
const logFileName = process.env.LOG_FILE;

// Logging function
const SimpleNodeLogger = require('simple-node-logger'), opts = {
  logFilePath: `${logFileName}.log`,
  timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
},
      log = SimpleNodeLogger.createSimpleLogger(opts);



const client = new Discord.Client();
client.commands = new Discord.Collection();

// Recursively going through commands folder and adding commands to
// client.commands
const addToCollection = (err, res) => {
  if (err) {
    console.log('Error', err);
    return;
  }
  for (file of res) {
    const command = require(`${file}`);
    client.commands.set(command.name, command);
  }
};
const getDirectories = async (src, callback) => {
  const response = await glob(src + '/**/*.js', callback);
};
getDirectories('./commands', addToCollection);



// Logging if bot is up and ready
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  log.info(`${client.user.tag} has started.`);
});


// Activated whenever someone new joins
client.on('guildMemberAdd', (member) => {
  log.setLevel('info');
  log.info(
      `New User "${member.user.username}" has joined "${member.guild.name}"`)
});

// Remove these functions if you dont want too much debugging, espcially the
// "debug" event causes a lot of logging. Used for extra debugging
client.on('error', (e) => {
  log.setLevel('error');
  log.error(`Error: ${e}`);
});
client.on('warn', (e) => {
  log.setLevel('warn');
  log.warn(`Warning: ${e}`);
});
// client.on("debug", (e) => {
//     log.setLevel('info');
//     log.info(`Debug: ${e}`);
// });


// Main even to execute commands
client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(' ');

  if (args[0] === 'update') {
    log.setLevel('info');
    log.info(`${message.author.username}#${
        message.author.discriminator} requested update command.`);
    await client.commands.get('updateHandler')
        .execute(message, args, serverid, client, roles);
  }

  else if (args[0] === 'make') {
    if (args[1] === 'invite') {
      log.setLevel('info');
      log.info(`${message.author.username}#${
          message.author.discriminator} requested make invite command.`);
      await client.commands.get('inviteHandler')
          .execute(message, args, serverid, client, roles);
    }
  }
});


// Starting the bot using the token
client.login(token);
