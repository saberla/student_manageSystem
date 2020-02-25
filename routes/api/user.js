// login & register
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const User = require('../../Schemas/userSchema') //user数据库

// 注册 请求会带数据 POST请求
// api/user/register
router.post('/register', (req, res) => {
    // 判断账号是否已经注册
    User.findOne({num:req.body.num})
        .then((user) => {
            if(user) {
                return res.json({data: {code:400, msg:'该账号号已注册'}})
            } else {
                const NewUser = new User({
                    name: req.body.name,
                    password: req.body.password,
                    college: req.body.college,
                    num: req.body.num,
                    identity: req.body.identity
                })
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(NewUser.password, salt, function(err, hash) {
                        if (err) throw err
                        NewUser.password = hash
                        NewUser.save()
                                .then(user => res.json({data:{code:200, msg:'注册成功'}}))
                                .catch(err => console.log(err))
                    })
                });
            }
        })
})

// 登录 请求会带数据 POST请求
// 返回token, jwt passport
// api/user/login
router.post('/login', (req,res) => {
    let num = req.body.num
    let name = req.body.name
    let password = req.body.password
    User.findOne({num, name})
        .then(user => {
            if(!user) {
                return res.json({data:{code: 404, msg:'用户不存在'}})
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // jwt.sign('规则', '加密名字', '过期时间', '回调函数')
                        let rule = {
                            id: user.id,
                            num: user.num,
                            college: user.college,
                            date: user.date,
                            name: user.name,
                            identity: user.identity
                        }
                        jwt.sign(rule, 'secret', {expiresIn: 60*60*24}, (err, token) => {
                            if (err) throw err
                            return res.json({data: {code: 200, msg: '登陆成功', token: 'Bearer ' + token}})
                        })
                        // return res.json({data: {code: 200, msg: '登陆成功', user:[user]}})
                    } else {
                        return res.json({data: {code: 400, msg:'密码错误'}})
                    }
                })
        })
})

// 返回用户数据 POST请求
// passport 验证tocken
// api/user/getUser
router.post('/getUsers',passport.authenticate('jwt', {session:false}) , (req, res) => {
    User.find({identity: '学生'})
        .then(user => {
            res.json({data:{
                code: 200,
                user
            }})
        })
})

// 删除用户数据 POST请求
// passport 验证tocken
// api/user/deleteUser
router.post('/deleteUser', passport.authenticate('jwt', {session:false}), (req, res) => {
    User.deleteOne({num: req.body.num})
    .then(user => {
        res.json({data:{
            code:200,
            msg: '移除成功'
        }})
    })
    .catch(err => {
        console.log(err)
    })
})

// 修改用户数据 POST请求
// passport 验证tocken
// api/user/updateUser
router.post('/updateUser', passport.authenticate('jwt', {session:false}), (req, res) => {
    User.update({num: req.body.num1}, {
        num: req.body.num,
        name: req.body.name,
        college: req.body.college
    })
    .then(user => {
        res.json({data:{
            code:200,
            msg: '修改成功'
        }})
    })
    .catch(err => {
        console.log(err)
    })
})

module.exports = router