$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    //定义美化时间过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    //定义补零方法
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    //筛选条件
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示几条
        cate_id: '',
        state: '' //文章的状态
    }

    initTable()
    initCate()

    //获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!')
                }
                //console.log(res);
                //使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);

                //渲染分页方法
                renderPage(res.total)
            }
        })
    }


    //初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }

                //模板引擎渲染分类
                var htmlStr = template('tpl-cate', res);

                $('[name=cate_id]').html(htmlStr);

                //通知layui 重新渲染表单区域
                form.render()
            }
        })
    }

    //筛选提交
    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()


        // console.log('cate_id:' + cate_id);
        // console.log('state:' + state);

        q.cate_id = cate_id;
        q.state = state;



        initTable()
    })

    //定义渲染分页方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //分页容器
            count: total, //总数据
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认选中那一页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页切换回调
            //触发jump 方式 
            //1. 点击页码
            //2. laypage.render 就会触发
            jump: function(obj, first) {
                //console.log(first);
                //console.log(obj.curr);
                q.pagenum = obj.curr;

                //把最新条目数赋值q
                q.pagesize = obj.limit;

                //直接调用 死循环
                //initTable()

                //如果是点击页码调用 执行 
                if (!first) {
                    initTable()
                }
            }
        })

    }

    //通过代理，为删除按钮绑定点击
    $('tbody').on('click', '.btn-delete', function() {
        //获取文章id
        var id = $(this).attr('data-id')

        var len = $('.btn-delete').length


        //console.log('ok');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功!');

                    //当数据完成，需要判断当前页是否有剩余数据
                    //需要页码值-1 再调用

                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }

                    initTable()
                }
            })

            layer.close(index);
        });
    })

})