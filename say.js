let Discord = require('discord.js');
const { getStudent, getGrades } = require('../../utils/Somtoday');
function isNumeric(str) {
    if (typeof str == "number") return true;
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.interaction = async (client, interaction, args)=>{
    interaction.sendSilent(args.find(arg=>arg.name === 'text')?.value || 'asdf')
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
        name:'say',
        description:'Laat de bot dingen zeggen',
        options:[
            {
                name:'text',
                description:'Wat moet ie zeggen',
                type:3,
                required:true,
                options:[

                ]
            },
            {
                name:'silent',
                description:'shhhh',
                type:5,
                required:false,
                options:[

                ]
            },
        ]
    },
    aliases: [],
    perms: [
    ]
};


/*
      '$type': 'resultaten.RResultaat',
      links: [Array],
      permissions: [Array],
      additionalObjects: {},
      herkansingstype: 'Geen',
      datumInvoer: '2020-11-12T08:44:52.000+01:00',
      teltNietmee: false,
      toetsNietGemaakt: false,
      leerjaar: 4,
      periode: 2,
      isExamendossierResultaat: false,
      isVoortgangsdossierResultaat: true,
      type: 'PeriodeGemiddeldeKolom',
      vak: [Object],
      leerling: [Object]
    },*/