const Discord = require('discord.js')
const rawSomtoday = require('./rawSomtoday');
const db = require('./db');

let access_tokens_lifetime = 30 * 60 * 1000
let access_tokens = new Discord.Collection();



exports.login = (memberId, studentId, password, schooluuid)=>{
    return new Promise(async(resolve, reject)=> {
        let authRes = await rawSomtoday.authLogin(schooluuid, studentId, password, memberId).catch(err=>reject(err));
        if(!authRes || !authRes.refresh_token) return reject('Loggin in failed');
        resolve(true);

        access_tokens.set(memberId,{
            lifetime:Date.now()+access_tokens_lifetime,
            data:authRes.access_token,
        })
        await db.storeRefreshToken(memberId, authRes.refresh_token, authRes.somtoday_api_url)
        await this.getStudent(memberId)
        return;
    })
}
exports.loggedIn = (memberId)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            let acces_token = getAccesToken();
            if(acces_token){
                return resolve(true);
            } else{
                return resolve(false)
            }
        }catch(err){
            return resolve(false)
        }
    })
}



let student_lifetime = 30 * 60 * 1000;
let student_cache = new Discord.Collection();
exports.getStudent = async(memberId)=>{
    return new Promise(async (resolve, reject)=>{
        // Check if in cache
        if(student_cache.has(memberId)){
            let student = student_cache.get(memberId);
            // Check if cache is old
            if(student.lifetime < Date.now()){
                const access_token = await getAccesToken(access_token).catch(err=>reject(err));
                if(!access_token) return reject('Could not fetch access token');
                let student = await rawSomtoday.fetchStudent(access_token).catch(err=>reject(err));
                if(!student) return reject('Could not find student');
                resolve(student);

                student_cache.set(memberId, {
                    lifetime:Date.now()+student_lifetime,
                    data:student,
                })
                return;

            }else{
                // Return cache bc its not old
                resolve(student.data)
            }
        }else{
            const access_token = await getAccesToken(memberId).catch(err=>reject(err));
            if(!access_token) return reject('Could not fetch access token');
            let student = await rawSomtoday.fetchStudent(access_token).catch(err=>reject(err));
            if(!student) return reject('Could not find student');
            resolve(student);

            student_cache.set(memberId, {
                lifetime:Date.now()+student_lifetime,
                data:student,
            })
            return;
        }
    })
}



let grades_lifetime = 30 * 60 * 1000;
let grades_cache = new Discord.Collection();
exports.getGrades = async(memberId, lluuid)=>{
    return new Promise(async (resolve, reject)=>{
        // Check if in cache
        if(grades_cache.has(memberId)){
            let grades = grades_cache.get(memberId);
            // Check if cache is old
            if(grades.lifetime < Date.now()){
                return resolve(await updateGrades(memberId, lluuid))
            }else{
                // Return cache bc its not old
                return resolve(grades.data)
            }
        }else{
            return resolve(await updateGrades(memberId, lluuid))
        }
    })
}

updateGrades = (memberId, lluuid)=>{
    return new Promise(async(resolve, reject)=>{
        let access_token= await getAccesToken(memberId).catch(err=>reject(err));
        if(!access_token) return reject('Could not fetch access token');

        if(!lluuid){
            let student = await rawSomtoday.fetchStudent(access_token).catch(err=>reject(err))
            if(!student?.items || !student.items || !student.items[0] || !student.items[0].links ) return reject('Could not fetch student');
            lluuid = student.items[0].links[0].id;
        }
        
        
        
        let grades = await rawSomtoday.fetchGrades(access_token, lluuid).catch(err=>reject(err));
        if(!grades) return reject('Could not get grades');
        resolve(grades);

        grades_cache.set(memberId, {
            lifetime:Date.now()+grades_lifetime,
            data:grades,
        })
        return;
    })
}





let homework_cache_lifetime = 30*60*1000
let homework_cache = {}
exports.getHomework = async(memberId)=>{
    return new Promise(async (resolve, reject)=>{
        // Check if in cache
        if(homework_cache.has(memberId)){
            let homework = homework_cache.get(memberId);
            // Check if cache is old
            if(homework.lifetime < Date.now()){
                return resolve(await updateHomework(memberId))
            }else{
                // Return cache bc its not old
                return resolve(homework.data)
            }
        }else{
            return resolve(await updateHomework(memberId))
        }
    })
}
updateHomework = (memberId)=>{
    return new Promise(async(resolve, reject)=>{
        let access_token= await getAccesToken(memberId).catch(err=>reject(err));
        if(!access_token) return reject('Could not fetch access token');

        let homework = await rawSomtoday.fetchHomework(access_token).catch(err=>reject(err))
        if(!homework || !homework.items || !homework.items[0] ) return reject('Could not fetch homework');
        
        resolve(homework);

        homework_cache.set(memberId, {
            lifetime:Date.now()+homework_cache_lifetime,
            data:homework,
        })
        return;
    })
}


















getAccesToken = (memberId) => {
    return new Promise(async (resolve, reject)=>{
        // Check for an acces token
        if(access_tokens.has(memberId)){
            let access_token = access_tokens.get(memberId);
            // Check if cache is old
            if(access_token.lifetime < Date.now()){
                resolve(await getNewAccesToken(memberId).catch(err=>reject(err)))
            }else{
                // Return cache bc its not old
                resolve(access_token.data)
            }
        }else{
            resolve(await getNewAccesToken(memberId).catch(err=>reject(err)))
        }
    })
}



getNewAccesToken = (memberId) => {
    return new Promise(async (resolve, reject)=>{
        
        let db_res = await db.getRefreshToken(memberId).catch(err=>reject(err));
        if(!db_res || !db_res.refresh_token){
            return reject('No refresh token found')
        }

        const res = await rawSomtoday.authRefresh(db_res.refresh_token).catch(err=>reject(err));
        if(!res || !res.refresh_token){
            return reject('Failed on fetching new tokens')
        }
        // Send the acces token over
        const new_refresh_token = res.refresh_token;
        const access_token = res.access_token;
        resolve(access_token)
        
        // Store access token
        access_tokens.set(memberId,{
            lifetime:Date.now()+access_tokens_lifetime,
            data:access_token,
        })
        // Save refresh token
        await db.storeRefreshToken(memberId, new_refresh_token, res.somtoday_api_url);
        

    })
}


