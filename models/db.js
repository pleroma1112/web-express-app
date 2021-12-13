const mysql = require('mysql2')
const pool = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    connectionLimit : 10
})

const db = {
    user : {
        getById : (id)=>{
            return new Promise((resolve)=>{
                let sql = `select * from user where id = ${pool.escape(id)}`
                pool.query(sql,(err,results)=>{
                    if(err) throw err
                    resolve(results)
                })
            })
        },
        add : (id,hash,salt)=>{
            return new Promise((resolve)=>{
                let sql = `insert into user(id,_hash,salt) values(${pool.escape(id)},${pool.escape(hash)},${pool.escape(salt)})`
                pool.query(sql,(err)=>{
                    if(err) throw err
                    resolve('insert success')
                })
            })            
        }
    }
}

module.exports = db