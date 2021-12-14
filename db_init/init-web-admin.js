require('dotenv').config()
const hasher = require('pbkdf2-password')()
const fs = require('fs')

hasher({passsword:process.env.DB_PASSWORD},(err,pass,salt,hash)=>{
    const data = {
        hash,
        salt
    }
    fs.writeFile('db_init/web-admin.txt',JSON.stringify(data),'utf8',(err)=>{
        if(err) throw err
        console.log('Done!')
    })
})