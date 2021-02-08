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
    const raw_grades = await getGrades(interaction.member.id).catch(err=>{
        //console.log(err)
        //return interaction.sendSilent('Could not fetch student, are you logged in?')
    });

    if(!raw_grades || !raw_grades.items || !raw_grades.items[0]){
        return interaction.sendSilent('You are not logged in')
    }

    const doel = args?.find(arg => arg.name == 'doel')?.value || 5.5;
    const weging = args?.find(arg => arg.name == 'weging')?.value;
    //console.log((await interaction.sendSilent('Logging in....')).toString())
    if(isNumeric(doel) == false){
        return interaction.sendSilent('Het ingestelde doel cijfer is niet correct.')
    }

    if(weging && isNumeric(weging) == false){
        return interaction.sendSilent('De ingestelde weging is niet correct')
    }
    let highest_year = 1;
    let highest_time = '2015-11-12T08:44:52.000+01:00';
    let les_raw_grades = []
    raw_grades.items.forEach(grade => {
        //let time = new Date()
        if(grade.type != 'Toetskolom'){
            return;
        }
        else if(Date.parse(grade.datumInvoer) > Date.parse(highest_time)){
            highest_time = grade.datumInvoer;
            highest_year = grade.leerjaar;
            les_raw_grades.push(grade)
        }else if(grade.leerjaar >= highest_year){
            les_raw_grades.push(grade);
        }
    });
    highest_year = 4
    //console.log('Highest year: '+highest_year)
    let subject_grades = {}
    les_raw_grades.forEach(grade=>{
        if(grade.leerjaar == highest_year && (grade.weging !== 0 || grade.isVoortgangsdossierResultaat ==true )){
            if(grade.vak.naam == 'lichamelijke opvoeding'){
                //console.log(grade)
            }
            let cijfer =    grade.geldendResultaat || 
                            grade.resultaat || 
                            undefined;
            if(!cijfer && grade.resultaatLabelAfkorting){
                let afk = grade.resultaatLabelAfkorting;
                if(afk == 'O'){
                    cijfer = 4
                } else if(afk == 'V'){
                    cijfer = 6.5
                }else if(afk == 'G'){
                    cijfer = 8
                }else if(afk == 'E'){
                    cijfer = 10
                }else{
                    return
                }
            }
            if(subject_grades[grade.vak.naam] && subject_grades[grade.vak.naam][0]){
                subject_grades[grade.vak.naam].push({weging: grade.weging, cijfer:parseFloat(cijfer)})
            } else{
                subject_grades[grade.vak.naam] = [{weging: grade.weging, cijfer:parseFloat(cijfer)}]
            }
        }
    })
    let out = ""
    out+=`Als je een ${doel} wil staan, haal dit:`// van: \`${student.roepnaam} ${student.achternaam}\`\n`
    //console.log(subject_grades)
    Object.keys(subject_grades).forEach(subject=>{
        let grades = subject_grades[subject]
        if(!grades || !grades[0]){
            return;
        }
        let summed = grades.reduce(function(previousValue, currentValue) {
            if(!previousValue?.cijfer){
                return {
                    cijfer: (currentValue.cijfer * currentValue.weging),
                    weging: currentValue.weging
                }
            }
            return {
              cijfer: previousValue.cijfer + (currentValue.cijfer * currentValue.weging),
              weging: previousValue.weging + currentValue.weging
            }
        });

        //console.log(summed)

        out += `\nVak: \`${subject}\`\n`
        if(!weging){
            for (let i = 1; i <= 6; i++) {
                let to_get = ((doel * (summed.weging+i)) - summed.cijfer)/i 
                out += `Weging \`${i}\`: ${Math.ceil(to_get*10)/10}\n`
            }
        }else{
            let i = parseFloat(weging);
            let to_get = ((doel * (summed.weging+i)) - summed.cijfer)/i 
                out += `Weging \`${i}\`: ${Math.ceil(to_get*10)/10}\n`
        }
        //console.log(out)
        if(subject ==  Object.keys(subject_grades)[Object.keys(subject_grades).length-1]){
            interaction.sendSilent(out);
        }
    });
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
        name:'cijfers',
        description:'Bereken het cijfer je wil halen',
        options:[
            {
                name:'doel',
                description:'Type het cijfer dat je wilt',
                type:3,
                required:false,
                options:[
                ]
            },
            {
                name:'weging',
                description:'Weging van de komende toets',
                type:4,
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