$(function () {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });

    //点击去登录账号的链接
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    //   从layui 中获取 form 对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verify()函数自定义校验规则 
    form.verify({
        //自定义了一个叫做 pwd 校验规则
        pwd:[/^[\S]{6,12}$/,'密码必须6-12位且不能出现空格'],
        //校验两次密码是否一致
        repwd:function(value) {
            //通过形参拿到的是确认密码框的内容
            //还需要拿到密码框的内容
            //然后进行一次比较
            //如果两个密码框内容不一致，则return一个错误提示消息即可

            //获取密码框内容
            var pwd = $('.reg-box [name=password]').val();
            //value是确认密码框内容 lay-verify="required|repwd"
            //进行判断
            if(pwd!== value) {
                return '两次密码不一致';
            }
        }
    });
    //监听注册表单的提交行为
    $('#form_reg').on('submit',function (e) {
        //阻止表单提交默认行为
        e.preventDefault();
        //发起请求 url 参数 回调函数
        var data = {username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()};
        $.post('/api/reguser',data,function (res) {
            if(res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功,请登录!');
            //注册成功手动调用点击去登陆按钮
            $('#link_login').click();
        })
    });


    //监听登录表单的提交行为
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url:'/api/login',
            method:'POST',
            data:$(this).serialize(),
            success:function (res) {
                if(res.status !== 0) {
                    return layer.msg('登录失败');
                }
                layer.msg('登陆成功');
                //登录成功的token字符串保存到localStorage中
                localStorage.setItem('token',res.token);
                //跳转到后台主页
                location.href = '/index.html';
            }
        })
    })
})