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
  name: 'updateHandler',

  description: 'Used to automatically update roles of users',

  async execute(message, args, serverid, client, rolesList) {
    if (args[0] !== `update`) {
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
    // Constantly update all roles
    for (role in rolesList) {
      if (role === 'MAINROLE') {
        continue;
      }
      // Get exact file path and role name
      let fileName = rolesList[role]['fileName'];
      let roleName = rolesList[role]['roleName']

          if (!fs.existsSync(`${pathToRoles}${fileName}.xlsx`)) {
        continue;
      }

      // Get all the usernames from the given xlsx sheet
      var peopleToUpdate = [];

      const readFromXlsx = async () =>  {
                var tempArray = [];
                const response = await readXlsxFile(`${pathToRoles}${fileName}.xlsx`)
                    .then((rows) => {
                        for (let i = 0; i < rows.length; ++i) {
                            tempArray.push(rows[i][0]);
                        }
                    })
                peopleToUpdate = tempArray;
            }

            await readFromXlsx();

      // Update the roles
      const roleId =
          message.member.guild.roles.cache.find(role => role.name === roleName);
      for (name of peopleToUpdate) {
        const user = client.users.cache.find(
            user => `${user.username}#${user.discriminator}` === name);
        if (!user) {
          continue;
        }
        if (message.member.roles.cache.find(r => r.id === roleId)) {
          continue;
        }
        let member = message.guild.members.cache.get(user.id);
        member.roles.add(roleId).catch(err => console.log(err));
        log.setLevel('info');
        log.info(`Updated ${name}'s role to ${role}.`);
      }
    }
  }
}
