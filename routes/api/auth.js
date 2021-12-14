const express = require('express')
const router = express.Router()
const hasher = require('pbkdf2-password')()
const db = require('../../models/db')

router.post('/login',(req,res,next)=>{
    let {id,password} = req.body
    db.user.getById(id).then(results=>{
        if(results.length>0){
            hasher({password, salt : results[0].salt},(err,pass,salt,hash)=>{
                if(err) throw err
                if(hash===results[0]._hash){
                    req.session.regenerate(()=>{
                        req.session.auth = true
                        req.session.save(()=>{
                            res.json({
                                auth : true
                            })
                        })
                    })
                }
                else{
                    res.json({
                        auth : false,
                        msg : 'Wrong Password'
                    })
                }
            })
        }
        else{
            res.json({
                auth : false,
                msg : 'Wrong ID'
            })
        }
    }).catch(next)
})

router.post('/regist',(req,res,next)=>{
    let {id, password} = req.body
    db.user.getById(id).then(results=>{
        if(results.length>0){
            res.json({
                regist : false,
                msg : 'already exist ID'
            })
        }
        else{
            hasher({password},(err,pass,salt,hash)=>{
                if(err) throw err
                db.user.add(id,hash,salt).then(result=>{
                    res.json({
                        regist : true
                    })
                }).catch(next)
            })
        }
    }).catch(next)
})

router.get('/logout',(req,res)=>{
    if(req.session.auth){
        req.session.destroy((err)=>{
            if(err) throw err
            res.clearCookie(process.env.SESSION_NAME)
            res.json({
                logout : true
            })
        })
    }
    else{
        res.json({
            logout : false,
            msg : 'login first'
        })
    }
})

router.get('/authcheck',(req,res)=>{
    if(req.session.auth){
        res.json({
            auth : true
        })
    }
    else{
        res.json({
            auth : false
        })
    }
})

module.exports = router