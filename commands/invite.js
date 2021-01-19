const readXlsxFile = require('read-excel-file/node');
require('dotenv').config();
const fs = require('fs')

const pathToRoles = process.env.PATH_TO_ROLES;
const logFileName = process.env.LOG_FILE;
const SimpleNodeLogger = require('simple-node-logger'), opts = {
  logFilePath: `${logFileName}.log`,
  timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
},
      log = SimpleNodeLogger.createSimpleLogger(opts);


module.exports = {
  name: 'inviteHandler',

  description: 'Used to generate single use invite links',

  async execute(message, args, serverid, client, rolesList) {
    if (args[0] !== `make` && args[1] !== `invite`) {
      return;
    }
    // Only admins can add roles to other users
    if (!message.member.roles.cache.some(
            r => r.name === rolesList['MAINROLE']['roleName'])) {
      message.reply(`Only ${
          rolesList['MAINROLE']['roleName']} can use the update command.`);
      log.setLevel('warn');
      log.warn(`${message.author.username}#${
          message.author
              .discriminator} was rejected authorisation to use the update command.`);
      return;
    }
    if (args.length !== 3) {
      message.reply(`3 arguments only. [<prefix>make invite numberOfInvites]`);
      log.setLevel('warn');
      log.warn(`${message.author.username}#${
          message.author.discriminator} used the wrong command.`);
      return;
    }

    log.setLevel('info');
      log.info(`${message.author.username}#${
          message.author.discriminator} requested for ${args[2]} invite links.`);

    const maxUses = 1;
    const unique = true;
    const maxAge = 0;
    const reason = 'Invite teams to hashcode server';
    const numberOfInvites = args[2];

    for (let i = 0; i < numberOfInvites; i++)

    {
      let invite =
          await message.channel
              .createInvite(
                  {
                    maxAge:
                        maxAge,  // maximum time for the invite, in milliseconds
                    maxUses: maxUses,  // maximum times it can be used
                    unique: unique,
                    reason: reason,
                  },
                  `Requested with command by ${message.author.tag}`)
              .catch(console.log);

      message.reply(
          invite ?
              `Here's your invite: ${invite}` :
              'There has been an error during the creation of the invite.');
    }
    log.setLevel('info');
      log.info(` ${args[2]} invite links generated.`);
  }
}
