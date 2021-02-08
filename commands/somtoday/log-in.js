let Discord = require('discord.js');
const Somtoday = require('../../utils/Somtoday')
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.interaction = async (client, interaction, args)=>{
    const schooluuid = '22573883-6e73-47f0-9cfe-ea748b0103c3';

    let logged_in = await Somtoday.getStudent(interaction.member.id).catch(err=>{});
    if(logged_in?.items){
        return interaction.sendSilent('You are already logged in')
    }

    const leerlingnummer = args.find(arg => arg.name == 'leerlingnummer')?.value
    const password = args.find(arg => arg.name == 'wachtwoord')?.value
    //console.log((await interaction.sendSilent('Logging in....')).toString())
    if(!leerlingnummer || !password){
        return interaction.sendSilent('Please enter a username and password')
    }
    let res = await Somtoday.login(interaction.member.id, leerlingnummer, password, schooluuid)
    if(res === true){
        return interaction.sendSilent('Succesfully logged in!')
    }else {

        return interaction.sendSilent('Failed to log in :(')

    }
    
}





exports.conf = {
    enabled: true,
    guildOnly: true,
    interaction:{
        name:'somlogin',
        description:'Log in bij somtoday',
        options:[
            {
                name:'LeerlingNummer',
                description:'Type je leerlingnummer hier',
                type:4,
                required:true,
                options:[

                ]
            },
            {
                name:'WachtWoord',
                description:'Type je wachtwoord hier',
                type:3,
                required:true,
                options:[

                ]
            },
        ]
    },
    aliases: [],
    perms: [
    ]
};
