// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()
//导入定义验证规则的包
const joi = require('joi')
// 导入配置文件
const config = require('./config')
// 导入 cors 中间件
const cors = require('cors')


// 导入并使用文章分类路由模块
const artCateRouter  = require('./router/artcate')
//登录注册路由模块
const userRouter = require('./router/user')
const artListRouter = require('./router/article')


// 将 cors 注册为全局中间件
app.use(cors())

//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))

//定义res.cc 响应数据的优化函数
app.use((req, res, next) => {
  //status的默认值为1
  //err的值，可能就是一个错误对象，也可能是一个错误的描述字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 解析 token 的中间件
const expressJWT = require('express-jwt')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))



// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))



app.use('/api', userRouter)



//用户信息路由模块
const userinfoRouter = require('./router/userinfo')
// 注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证
app.use('/my', userinfoRouter)




// 为文章分类的路由挂载统一的访问前缀 /my/article
app.use('/my/article', artCateRouter)

//为获取文章列表的路由挂载统一的访问前缀 /my/article
app.use('/my/article',artListRouter)





//定义错误级别的中间件
app.use((err, req, res, next) => {
  //验证失败导致的错误
  if (err instanceof joi.ValidationError) return res.cc(err)

  // 捕获身份认证失败的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')

  //未知的错误
  res.cc(err)
})




// 调用 app.listen 方法,指定端口号并启动web服务器
app.listen(3007, () => {
  console.log('api server running at http://127.0.0.1:3007')
})