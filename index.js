require('dotenv').config({})
const Discord = require('discord.js')
const axios = require('axios');
const client = new Discord.Client()
const fs = require('fs');
const mongoose = require('mongoose')
process.on('SIGTERM', async() => {
    await Promise.all([
        //mongoose.connection.close(),
        client.destroy()
    ])
    process.exit()
})

process.on('SIGINT', async () => {
    await Promise.all([
        //mongoose.connection.close(),
        client.destroy()
    ])
    process.exit()
});

client.config = {
    token: process.env.TOKEN
};


mongoose.connect(process.env.DBPATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


(async () => {
    
    
    
    
    
    let userdata = await axios.get('https://discord.com/api/v8/users/@me', {headers:{'Authorization': `Bot ${client.config.token}`}});
    let user = userdata.data

    let discordSlashCommandsData = await axios.get(`https://discord.com/api/v8/applications/${user.id}/commands`, {headers:{'Authorization': `Bot ${client.config.token}`}});
    let discordSlashCommands = discordSlashCommandsData.data;

    client.interactions = new Discord.Collection()
    await fs.readdir("./commands/", (direrr, dirs) =>{
        if (direrr) {
            return console.log('Unable to scan directory: ' + err);
        }
        console.log(dirs)
        dirs.forEach((dir) => {
            // Make a path to that subdir
            const path = "./commands/"+dir+"/";
            // Read the contents of that subdir
            fs.readdir(path, (err, files) => {
                if (err) return console.error(err);
                // Go thru all files in the subdir
                files.forEach(async (file) => {
                    // Check if they end with .js
                    if (!file.endsWith(".js")) return;
                    // Load the command file
                    let command_file = require(path+file);
                    
                    // Check if the file has an interaction for it
                    if( typeof command_file.interaction == 'function') {
                        
                        let interaction = command_file.conf.interaction;
                        interaction.name = interaction.name || command_file.help.name
                        interaction.description = interaction.description || command_file.help.description

                        console.log(`Loading Interaction: ${interaction.name}`);

                        if(!discordSlashCommands.find(slashCommand => {
                            slashCommand.name === interaction.name &&
                            slashCommand.description === interaction.name &&
                            slashCommand.options === interaction.options
                        })){
                            let res = await axios.post(`https://discord.com/api/v8/applications/${user.id}/commands`, interaction, {headers:{'Authorization': `Bot ${client.config.token}`}}).catch(err=>console.log(err.response))
                            //client.api.applications(user.id).commands.post({data: interaction})
                            console.log(`Updated Interaction: ${interaction.name}`)
                        }

                        client.interactions.set(interaction.name, command_file)
                    } ///somlogin leerlingnummer:103929 wachtwoord:CLH082005 
                });
            });
        })
    })

    fs.readdir("./events/", (err, files) => {
        if (err) return console.error(err);
        let discordEvents = Discord.Constants.Events;
        files.forEach(file => {
            const event = require(`./events/${file}`);
            //let eventName = file.split(".")[0];
            if(Object.keys(discordEvents).includes(event.conf.event.toUpperCase()) || Object.values(discordEvents).includes(event.conf.event))
                client.on(event.conf.event, event.event.bind(null, client));
            else{
                client.ws.on(event.conf.event, event.event.bind(null, client));
            }
        });
    });

    client.login(process.env.TOKEN);
    exports.client = client;
})();
