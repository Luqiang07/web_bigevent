//注册新用户的处理函数 导入mysql
const db = require('../db/index')
//导入 bcryptjs 这个包
const bcrypt = require('bcryptjs')
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
// 导入配置文件
const config = require('../config')




exports.regUser = (req, res) => {
    //获取客户端向服务器提交的用户信息
    const userinfo = req.body
    //对表单中的数据，进行合法性的校验
    if (!userinfo.username || !userinfo.password) {
        return res.cc('用户名或密码不合法!')
    }
    

    //定义SQL语句
    const sqlStr = 'select * from my_db_01.ev_users where username=?'
    //执行SQL语句
    db.query(sqlStr, userinfo.username, (err, results) => {
        //执行SQL语句失败
        if (err) return res.cc(err)
        //判断用户名是否被占用
        if (results.length > 0) {
            return res.cc('用户名被占用,请更换其他用户名')
        }
        //用户名可以使用
        // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)

        //定义新增用户的SQL语句
        const sql = 'insert into my_db_01.ev_users set ?'
        //执行新增用户SQL语句
        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            //执行新增用户SQL语句失败
            if (err) return res.cc(err)
            //判断影响行数是否为1
            if (results.affectedRows !== 1) return res.cc('注册用户失败!请稍后再试')
            res.cc('注册用户成功!', 0)
        })
    })
}




exports.login = (req, res) => {
    //获取客户端发送到服务器的用户数据
    const userinfo = req.body
    //定义SQL语句
    const sql = 'select * from my_db_01.ev_users where username=?'
    //执行SQL语句
    db.query(sql, userinfo.username, (err, results) => {
        //验证用户名
        if (err) return res.cc(err)
        if (results.length !== 1) return res.cc('登陆失败!')
        //验证密码  接收的值是布尔值  bcrypt.compareSync()去比较用户发过来的密码和服务器的密码
        const pareResults = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!pareResults) return res.cc('登录失败')
        //用户名和密码都验证成功 生成Token字符串
        //定义用户的数据 剔除密码和头像信息
        const user = { ...results[0], password: '', user_pic: '' }

        // 生成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: config.expiresIn, // token 有效期为 10 个小时
        })
        //登陆成功响应给客户端的数据
        res.send({
            status:0,
            msg:'登陆成功!',
        // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token:'Bearer ' + tokenStr
        })
    })
}