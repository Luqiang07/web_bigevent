$(function () {
    var layer = layui.layer;
    var form = layui.form;

    //定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }


    //定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    //定义一个查询的参数对象，将来请求数据的时候，
    //需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1,//页码值，默认请求第一页的数据
        pagesize: 2,//每页显示几条数据，默认每页显示2条
        cate_id: '',//文章分类的Id
        state: ''//文章发布状态
    };


    initTable();
    initCate();
    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res[0].is_delete !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                var a = {}
                a.data = res
                console.log(a);
                //使用模板引擎渲染数据
                var htmlStr = template('tpl-table', a);
                $('tbody').html(htmlStr);
                renderPage(res)
            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method:'GET',
            url:'/my/article/cates',
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取分类数据失败!')
                }
                //调用模板引擎渲染分类可选项
               var htmlStr = template('tpl-cate',res);
               $('[name=cate_id]').html(htmlStr);
               //通知layui重新渲染表单区域的UI结构
               form.render();
            }
        })
    }
    //为筛选表单绑定 submit 事件
    $('#form-search').on('submit',function(e) {
        e.preventDefault();
        //获取表单中选项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        q.cate_id=cate_id;
        q.state = state;
        //根据最新筛选条件重新渲染页面
        initTable();
    })



    //定义渲染分页的方法
    function renderPage() {

    }

})