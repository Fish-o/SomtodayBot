let Discord = require('discord.js');
const { getStudent, getGrades } = require('../../utils/Somtoday');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.interaction = async (client, interaction, args)=>{


    const raw_student = await getStudent(interaction.member.id);
    
    
    if(!raw_student || !raw_student.items || !raw_student.items[0]){
        return interaction.sendSilent('You are not logged in')
    }
    
    
    const student = raw_student.items[0]
    let out = "";
    
    out+=`Account van: \`${student.roepnaam} ${student.achternaam}\`\n`
    out+=`Leerlingnummer:  \`${student.leerlingnummer}\`\n`
    out+=`Email:  \`${student.email}\`\n`
    out+=`Geslacht:  \`${student.geslacht}\`\n`
    out+=`Geboortedatum:  \`${student.geboortedatum}\`\n`
    interaction.sendSilent(out);
}


/*{
    "items": [
        {
            "$type": "leerling.RLeerling",
            "links": [
                {
                    "id": 2542621059,
                    "rel": "self",
                    "type": "leerling.RLeerling",
                    "href": "https://api.somtoday.nl/rest/v1/leerlingen/2542621059"
                }
            ],
            "permissions": [
                {
                    "full": "leerling.RLeerlingPrimer:READ:INSTANCE(2542621059)",
                    "type": "leerling.RLeerlingPrimer",
                    "operations": [
                        "READ"
                    ],
                    "instances": [
                        "INSTANCE(2542621059)"
                    ]
                }
            ],
            "additionalObjects": {},
            "UUID": "12caa3f7-13d6-4e8a-b8b2-0b2f16ea9f66",
            "leerlingnummer": 103929,
            "roepnaam": "Conner",
            "achternaam": "Hof",
            "email": "103929@gymcam.nl",
            "geboortedatum": "2005-08-31",
            "geslacht": "Man"
        }
    ]
}*/


exports.conf = {
    enabled: true,
    guildOnly: true,
    interaction:{
        name:'account',
        description:'Laat je account en leerling informate zien',
        options:[
        ]
    },
    aliases: [],
    perms: [
    ]
};
