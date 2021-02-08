const axios = require('axios')
const Querystring = require('querystring');
const basic_auth = "RDUwRTBDMDYtMzJEMS00QjQxLUExMzctQTlBODUwQzg5MkMyOnZEZFdkS3dQTmFQQ3loQ0RoYUNuTmV5ZHlMeFNHTkpY";
const apiurl = 'https://api.somtoday.nl';

exports.authLogin = async(SCHOOLUUID, LEERLINGNUMMER, WACHTWOORD) => {
    const url = "https://production.somtoday.nl/oauth2/token"
    const headers = {
        'Content-Type': "application/x-www-form-urlencoded",
        'Authorization': `Basic ${basic_auth}`
    }
    const data = Querystring['stringify']({
        grant_type:"password",
        username:`${SCHOOLUUID}\\${LEERLINGNUMMER}`,
        password:WACHTWOORD,
        scope:"openid"
    })
    let r;
    try {
        let p = await axios.post(url, data, {headers: headers})
        r = p
    }catch(err){
        console.log('Catched')
        if (!err.response  || (err.response.status !== 400 && err.response.status !== 405)) {
            //console.log(err)
        }
        return undefined;
    }
    
    return r.data
}

exports.authRefresh = async(refresh_token) => {
    const url = "https://production.somtoday.nl/oauth2/token";
    const headers = {
        'Content-Type': "application/x-www-form-urlencoded",
        'Authorization': `Basic ${basic_auth}`
    }
    const data = Querystring.stringify({
        grant_type:"refresh_token",
        refresh_token:refresh_token,
        //client_id: "D50E0C06-32D1-4B41-A137-A9A850C892C2",
        //client_secret: "vDdWdKwPNaPCyhCDhaCnNeydyLxSGNJX"
    })
    let r;
    try {
        let p = await axios.post(url, data, {headers: headers})
        r = p
    }catch(err){
        console.log('Catched')
        if (err.response?.status !== 403) {
            //console.log(err)
        }
        console.log(err.response.data)
        return undefined;
    }
    return r.data
}



exports.fetchStudent = async(access_token) => {
    let url = `${apiurl}/rest/v1/leerlingen`
    headers = {
        'Authorization': 'Bearer '+access_token,
        "Accept": "application/json"
    }
    let r;
    try{
        r = await axios.get(url, {headers: headers})
    }catch(err){
        console.log('Catched')
        if (err.response.status !== 403) {
            //console.log(err)
        }
        console.log(err.response.data)
        return undefined; 
    }
    return r.data
}


exports.fetchGrades = async(access_token, lluuid)=>{
    const url = `${apiurl}/rest/v1/resultaten/huidigVoorLeerling/${lluuid}`
    const headers = {
        'Authorization': 'Bearer '+access_token,
        "Accept": "application/json",
        "Range":"items=1-500"
    }
    let r;
    try{
        r = await axios.get(url, {headers: headers})
    }catch(err){
        console.log('Catched')
        if (err.response.status !== 403) {
            //console.log(err)
        }
        console.log(err.response.data)
        return undefined; 
    }
    return r.data
}

exports.fetchHomework = async(access_token, startDate)=>{
    if(!startDate){
        let d = new Date();
        startDate = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    }
    const url = `${apiurl}/rest/v1/resultaten/huidigVoorLeerling/${lluuid}`
    const headers = {
        'Authorization': 'Bearer '+access_token,
        "Accept": "application/json"
    }
    const params = {
        begintNaOfOp:startDate
    }

    let r;
    try{
        r = await axios.get(url, {headers: headers, params:params})
    }catch(err){
        console.log('Catched')
        if (err.response.status !== 403) {
            //console.log(err)
        }
        console.log(err.response.data)
        return undefined; 
    }
    return r.data
}

