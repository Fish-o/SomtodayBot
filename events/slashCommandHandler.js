
const axios = require('axios');
const Discord = require('discord.js')
const { Interaction }  = require('../utils/classes/interaction')

/*

{
  version: 1,
  type: 2,
  token: 'asdf'
  member: {
    user: {
      username: 'Fish',
      public_flags: 256,
      id: '325893549071663104',
      discriminator: '2455',
      avatar: '5a4e62341afa47f200bd8f0dcf759512'
    },
    roles: [
      '790969042851856425',
      '790969058710519808',
      '790969073210097715'
    ],
    premium_since: null,
    permissions: '2147483647',
    pending: false,
    nick: 'sdfgsdfg',
    mute: false,
    joined_at: '2020-09-06T13:18:35.776000+00:00',
    is_pending: false,
    deaf: false
  },
  id: '792502570592894986',
  guild_id: '752155794153406476',
  data: { name: 'help', id: '791272914905333760' },
  channel_id: '784438571620106311'
}
*/



exports.event = async (client, raw_interaction) => {
    //console.log(raw_interaction)
    // Make .send a propperty of the interaction
    let interaction = new Interaction(client, raw_interaction);

    // Define the command and the args
    const commandName = interaction.name;
    const args = interaction.args;

    let cmd = client.interactions.get(commandName)
    if(!cmd) return;
    
    cmd.interaction(client, interaction, args)

};


exports.conf = {
    event: "INTERACTION_CREATE"
};

