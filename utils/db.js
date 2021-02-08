const Discord = require('discord.js');
const { update } = require('../db/Users');
const SomtodaySessions = require('../db/Users');



let SchoolCache = new Discord.Collection();
const SchoolCacheLifetime = 5*60*1000
exports.getSchoolUuid = async(memberId) =>{
    return new Promise(async(resolve,  reject)=>{
        if(SchoolCache.has(memberId)){
            let School = SchoolCache.get(memberId);
            if(!School.lifetime < Date.now()){


                let db_user = await SomtodaySessions.findOne({memberId:memberId});
                if(!db_user)
                    return reject('No school found');
                resolve(db_user.schoolUuid);
                SchoolCache.set(memberId, {lifetime:Date.now()+SchoolCacheLifetime, uuid:db_user.schoolUuid});
                return;


            }else{
                resolve(School.uuid);
            }
        }else{


            let db_user = await SomtodaySessions.findOne({memberId:memberId});
            if(!db_user)
                return reject('No school found');
            resolve(db_user.schoolUuid);
            SchoolCache.set(memberId, {lifetime:Date.now()+SchoolCacheLifetime, uuid:db_user.schoolUuid});
            return;


        }        
       
    })
}

exports.storeSchoolUuid = async(memberId, schoolUuid)=>{
    

}

exports.getRefreshToken = async(memberId, studentUuid) => {
    let query = {};
    if(memberId){ 
        query = {memberId:memberId}
    }else if(studentUuid){
        query = {studentUuid:studentUuid}
    }
    return await SomtodaySessions.findOne(query)
}


exports.storeRefreshToken = async(memberId, refresh_token, api_url) => {
    if(!memberId || !refresh_token || !api_url){
        return undefined;
    }
    await SomtodaySessions.findOneAndUpdate(
        {memberId: memberId}, 
        {
            memberId, 
            refresh_token:refresh_token,
            api_url:api_url,
        },
        {
            upsert:true,
            setDefaultsOnInsert:true,
        }
    )
    //console.log(adf)
    //console.log('NEW DB')
}
